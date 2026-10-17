// PRで実行するテストの範囲を、変更されたファイルから判定する。
// 判定結果はGitHub Actionsのステップ出力（GITHUB_OUTPUT）に書き出す。
//
// - scope: all（全テスト）/ simulations（対象のみ）/ none（実行不要）
// - unit-targets: 実行するユニットテストのディレクトリ（空白区切り）
// - e2e-targets: 実行するE2Eテストのファイル（空白区切り）
// - run-e2e: E2Eテストを実行する場合はtrue（Playwrightのセットアップ要否の判定用）
//
// 使い方:
//   node scripts/detect-changed-tests.js <base> [head]

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifyChangedFiles } from "./_lib/detectChangedTests.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [base, head = "HEAD"] = process.argv.slice(2);

if (!base) {
  console.error("使い方: node scripts/detect-changed-tests.js <base> [head]");
  process.exit(1);
}

const files = execFileSync("git", ["diff", "--name-only", base, head], {
  cwd: rootDir,
  encoding: "utf-8"
})
  .split("\n")
  .filter(Boolean);

const { scope, simulations } = classifyChangedFiles(files);

// テストが存在するシミュレーションのみ対象にする（テスト0件でVitest・Playwrightが失敗するのを避ける）
const unitTargets = simulations
  .map((name) => `test/simulations/${name}/`)
  .filter((target) => existsSync(resolve(rootDir, target)));
const e2eTargets = simulations
  .map((name) => `test/e2e/${name}.spec.js`)
  .filter((target) => existsSync(resolve(rootDir, target)));

const outputs = {
  scope,
  "unit-targets": unitTargets.join(" "),
  "e2e-targets": e2eTargets.join(" "),
  "run-e2e": String(scope === "all" || e2eTargets.length > 0)
};

for (const [key, value] of Object.entries(outputs)) {
  console.log(`${key}=${value}`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}
