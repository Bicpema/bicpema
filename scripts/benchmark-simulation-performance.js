// src/simulations/ 配下のシミュレーションをヘッドレスブラウザーで起動し、
// 平均frameRateとJSヒープ使用量（アイドル時のばらつき）を計測する。
// 描画負荷に関する変更（frameRate/pixelDensity/毎フレームの生成物削減 等）の
// before/after比較や、代表シミュレーションの現状把握に使う。
//
// 使い方:
//   npm run build
//   npm run benchmark:performance -- --filter=free-fall,projectile-motion
//
// オプション:
//   --filter=<name1,name2>  対象シミュレーション名（カンマ区切り、省略時は全件）
//   --duration=<ms>         計測時間（既定: 5000）
//   --device-scale=<n>      ブラウザーcontextのdeviceScaleFactor（既定: 1）
//   --base-url=<url>        既に起動済みのサーバーを使う場合に指定する

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startPreviewServer } from "./_lib/previewServer.js";
import { getSimulationSlugs } from "./_lib/simulations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const simulationsDir = join(rootDir, "src", "simulations");
const outDir = join(rootDir, "dist");

/**
 * コマンドライン引数を解析する。
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {{ filter: string[] | null, duration: number, deviceScale: number, baseUrl: string | null }} */
  const options = {
    filter: null,
    duration: 5000,
    deviceScale: 1,
    baseUrl: null
  };
  for (const arg of argv) {
    const separatorIndex = arg.indexOf("=");
    if (separatorIndex !== -1) {
      const key = arg.slice(0, separatorIndex);
      const value = arg.slice(separatorIndex + 1);
      if (key === "--filter") {
        options.filter = value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
      if (key === "--duration") {
        options.duration = Number(value) || options.duration;
      }
      if (key === "--device-scale") {
        options.deviceScale = Number(value) || options.deviceScale;
      }
      if (key === "--base-url") options.baseUrl = value;
    }
  }
  return options;
}

/**
 * 1つのシミュレーションを起動し、frameRateとJSヒープ使用量を計測する。
 * @param {import("playwright").Browser} browser
 * @param {string} baseUrl
 * @param {string} name
 * @param {{ duration: number, deviceScale: number }} options
 */
async function benchmarkSimulation(browser, baseUrl, name, options) {
  const context = await browser.newContext({
    deviceScaleFactor: options.deviceScale
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send("Performance.enable");

  await page.goto(`${baseUrl}/vite/simulations/${name}/`, {
    waitUntil: "load",
    timeout: 20000
  });
  await page.waitForTimeout(1000);

  // requestAnimationFrameのコールバック頻度から実効frameRateを求める。
  const frameCountPromise = page.evaluate(
    (duration) =>
      new Promise((resolvePromise) => {
        let count = 0;
        const start = performance.now();
        function tick() {
          count++;
          if (performance.now() - start < duration) {
            requestAnimationFrame(tick);
          } else {
            resolvePromise(count);
          }
        }
        requestAnimationFrame(tick);
      }),
    options.duration
  );

  // 同じ期間、JSヒープ使用量をサンプリングしてばらつき（アロケーション量の目安）を見る。
  /** @type {number[]} */
  const heapSamples = [];
  const sampleInterval = setInterval(async () => {
    try {
      const metrics = await client.send("Performance.getMetrics");
      const heap = metrics.metrics.find((m) => m.name === "JSHeapUsedSize");
      if (heap) heapSamples.push(heap.value);
    } catch {
      // ページ遷移・クローズ中の失敗は無視する
    }
  }, 250);

  const frameCount = await frameCountPromise;
  clearInterval(sampleInterval);

  const canvasSize = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      cssWidth: Math.round(rect.width),
      cssHeight: Math.round(rect.height),
      realWidth: canvas.width,
      realHeight: canvas.height
    };
  });

  await context.close();

  const measuredFps = (frameCount / options.duration) * 1000;
  const heapMin = heapSamples.length ? Math.min(...heapSamples) : null;
  const heapMax = heapSamples.length ? Math.max(...heapSamples) : null;

  return {
    name,
    measuredFps,
    heapMinMB: heapMin !== null ? heapMin / (1024 * 1024) : null,
    heapMaxMB: heapMax !== null ? heapMax / (1024 * 1024) : null,
    heapRangeMB:
      heapMin !== null && heapMax !== null
        ? (heapMax - heapMin) / (1024 * 1024)
        : null,
    canvasSize
  };
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

  const names = options.filter ?? getSimulationSlugs(simulationsDir);
  if (names.length === 0) {
    console.error("計測対象のシミュレーションが見つかりませんでした。");
    process.exitCode = 1;
    return;
  }

  // --base-url の指定がなければ、ビルド済みのサイトを配信するプレビューサーバーを起動する
  const previewServer = options.baseUrl
    ? null
    : await startPreviewServer(rootDir);
  // previewServerがnullのときは options.baseUrl が指定されている
  const baseUrl =
    previewServer?.baseUrl ?? /** @type {string} */ (options.baseUrl);

  const browser = await chromium.launch();
  console.log(
    `計測対象: ${names.join(", ")} (duration=${options.duration}ms, deviceScale=${options.deviceScale})`
  );
  console.log("");

  try {
    for (const name of names) {
      // oxlint-disable-next-line no-await-in-loop -- 計測値が他シミュレーションの負荷に影響されないよう、意図的に直列実行している
      const result = await benchmarkSimulation(browser, baseUrl, name, options);
      console.log(`■ ${result.name}`);
      // requestAnimationFrameベースの計測のため、p5のframeRate()による間引きが
      // 効いている場合は実際のdraw()実行頻度より高い値になる点に注意。
      console.log(
        `  画面のペイント頻度(rAFベース): ${result.measuredFps.toFixed(1)} fps`
      );
      if (
        result.heapMinMB !== null &&
        result.heapMaxMB !== null &&
        result.heapRangeMB !== null
      ) {
        console.log(
          `  JSHeapUsedSize: ${result.heapMinMB.toFixed(2)}〜${result.heapMaxMB.toFixed(2)} MB (幅 ${result.heapRangeMB.toFixed(2)} MB)`
        );
      }
      if (result.canvasSize) {
        const { cssWidth, cssHeight, realWidth, realHeight } =
          result.canvasSize;
        console.log(
          `  canvas: CSS ${cssWidth}x${cssHeight} / 実ピクセル ${realWidth}x${realHeight}`
        );
      }
      console.log("");
    }
  } finally {
    await browser.close();
    if (previewServer) {
      await previewServer.stop();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
