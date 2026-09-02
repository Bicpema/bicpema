// vite/simulations/ 配下の各シミュレーションをヘッドレスブラウザーで起動し、
// ページロード時および起動直後の実行中に発生した未処理例外（pageerror）や
// console.error・リソースの読み込み失敗（requestfailed）を検知する。
// 1件でも検知した場合は非0終了し、CIでのビルド失敗に反映できるようにする。
//
// 使い方:
//   npm run build          # 先に static/vite/ をビルドしておく
//   npm run verify:runtime
//
// オプション:
//   --filter=<name>     指定した名前を含むシミュレーションのみ検証する
//   --concurrency=<n>   同時に起動するページ数（既定: 4）
//   --timeout=<ms>      ページ読み込みのタイムアウト（既定: 20000）
//   --settle=<ms>       読み込み後、draw()等の実行を観測する待機時間（既定: 2000）
//   --base-url=<url>    既に起動済みのサーバーを使う場合に指定する（省略時は vite preview を自動起動）

import { existsSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { preview } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const simulationsDir = join(rootDir, "vite", "simulations");
const outDir = join(rootDir, "static", "vite");

/**
 * min以上の整数として妥当な値であれば返し、そうでなければ既定値を返す。
 * @param {string | undefined} value
 * @param {number} fallback
 * @param {number} [min=1]
 * @returns {number}
 */
function parseIntWithMin(value, fallback, min = 1) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min ? parsed : fallback;
}

/**
 * コマンドライン引数を解析する。
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const options = {
    filter: null,
    concurrency: 4,
    timeout: 20000,
    settle: 2000,
    baseUrl: null,
  };
  for (const arg of argv) {
    // 値側に "=" を含む場合（例: --base-url=http://host/?a=b）があるため、
    // 最初の "=" のみでキーと値に分割する。
    const separatorIndex = arg.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = arg.slice(0, separatorIndex);
    const value = arg.slice(separatorIndex + 1);
    if (key === "--filter") options.filter = value;
    if (key === "--concurrency") {
      options.concurrency = parseIntWithMin(value, options.concurrency, 1);
    }
    if (key === "--timeout") {
      options.timeout = parseIntWithMin(value, options.timeout, 1);
    }
    if (key === "--settle") {
      options.settle = parseIntWithMin(value, options.settle, 0);
    }
    if (key === "--base-url") options.baseUrl = value;
  }
  return options;
}

/**
 * index.html を持つシミュレーションディレクトリ名の一覧を取得する。
 */
function listSimulationNames() {
  return readdirSync(simulationsDir)
    .filter((name) => {
      const dir = join(simulationsDir, name);
      return statSync(dir).isDirectory() && existsSync(join(dir, "index.html"));
    })
    .sort();
}

/**
 * 空いているTCPポートを1つ取得する。
 * @returns {Promise<number>}
 */
function findFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });
}

/**
 * 1つのシミュレーションをヘッドレスブラウザーで起動し、pageerrorを検知する。
 * @param {import("playwright").Browser} browser
 * @param {string} baseUrl
 * @param {string} name
 * @param {{ timeout: number, settle: number }} options
 * @returns {Promise<{ name: string, ok: boolean, errors: string[], consoleErrors: string[] }>}
 */
async function verifySimulation(browser, baseUrl, name, options) {
  const context = await browser.newContext();
  const page = await context.newPage();
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const consoleErrors = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    if (failure) {
      consoleErrors.push(
        `requestfailed: ${request.url()} (${failure.errorText})`
      );
    }
  });

  try {
    await page.goto(`${baseUrl}/vite/simulations/${name}/`, {
      waitUntil: "load",
      timeout: options.timeout,
    });
    await page.waitForTimeout(options.settle);
  } catch (error) {
    errors.push(
      `ページの読み込みに失敗しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    await context.close();
  }

  return {
    name,
    ok: errors.length === 0 && consoleErrors.length === 0,
    errors,
    consoleErrors,
  };
}

/**
 * 配列をタスクプールで並列処理する。
 * @template T
 * @template R
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T) => Promise<R>} worker
 * @returns {Promise<R[]>}
 */
async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runNext() {
    const currentIndex = nextIndex++;
    if (currentIndex >= items.length) return;
    results[currentIndex] = await worker(items[currentIndex]);
    await runNext();
  }

  // concurrencyが不正な値でも最低1ワーカーは確保し、
  // resultsが空のまま返る（呼び出し側でのクラッシュにつながる）ことを防ぐ。
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  const workers = Array.from({ length: workerCount }, () => runNext());
  await Promise.all(workers);
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.baseUrl && !existsSync(outDir)) {
    console.error(
      `${outDir} が見つかりません。先に \`npm run build\` を実行してください。`
    );
    process.exitCode = 1;
    return;
  }

  let names = listSimulationNames();
  if (options.filter) {
    names = names.filter((name) => name.includes(options.filter));
  }
  if (names.length === 0) {
    console.error("検証対象のシミュレーションが見つかりませんでした。");
    process.exitCode = 1;
    return;
  }

  /** @type {import("vite").PreviewServer | null} */
  let previewServer = null;
  let baseUrl = options.baseUrl;

  if (!baseUrl) {
    const port = await findFreePort();
    previewServer = await preview({
      root: join(rootDir, "vite"),
      base: "/vite",
      preview: { port, strictPort: true },
      build: { outDir },
    });
    baseUrl = `http://localhost:${port}`;
  }

  const browser = await chromium.launch();
  console.log(
    `検証対象: ${names.length}件 (concurrency=${options.concurrency})`
  );

  try {
    const results = await runWithConcurrency(
      names,
      options.concurrency,
      (name) => verifySimulation(browser, baseUrl, name, options)
    );

    const failed = results.filter((result) => !result.ok);

    for (const result of results) {
      const mark = result.ok ? "✓" : "✗";
      console.log(`${mark} ${result.name}`);
      if (!result.ok) {
        for (const error of result.errors) {
          console.log(`    error: ${error}`);
        }
      }
      if (result.consoleErrors.length > 0) {
        for (const error of result.consoleErrors) {
          console.log(`    console.error: ${error}`);
        }
      }
    }

    console.log("");
    console.log(
      `${results.length - failed.length}/${results.length} 件が成功しました。`
    );

    if (failed.length > 0) {
      console.log(
        `失敗したシミュレーション: ${failed.map((result) => result.name).join(", ")}`
      );
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
    if (previewServer) {
      await previewServer.close();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
