// vite/simulations/ 配下で、共通コンポーネント（vite/ts/components/）と同種の
// 関数（drawArrow / drawDashedLine など）が独自に定義されていないかを検査する。
// 未移行の既存分は scripts/duplicate-components-allowlist.json で管理する。
//
// 使い方:
//   npm run check:duplicate-components

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkDuplicateComponents } from "./_lib/checkDuplicateComponents.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const allowlist = JSON.parse(
  readFileSync(
    resolve(__dirname, "duplicate-components-allowlist.json"),
    "utf8"
  )
);

const result = checkDuplicateComponents({
  simulationsDir: resolve(rootDir, "vite", "simulations"),
  allowlist
});

let hasError = false;

if (result.violations.length > 0) {
  hasError = true;
  console.error(
    "共通コンポーネントと同種の関数が独自に定義されています（形式: シミュレーション名:関数名）:"
  );
  for (const entry of result.violations) {
    console.error(`  ${entry}`);
  }
  console.error("vite/ts/components/ の共通コンポーネントを利用してください。");
}

if (result.staleAllowlist.length > 0) {
  hasError = true;
  console.error(
    "scripts/duplicate-components-allowlist.json に不要なエントリがあります（既に解消済みです。削除してください）:"
  );
  for (const entry of result.staleAllowlist) {
    console.error(`  ${entry}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log("共通コンポーネントの重複定義は見つかりませんでした。");
