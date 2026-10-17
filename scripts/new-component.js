// 共通コンポーネントのひな形（vite/ts/components/<name>.ts・test/components/<name>.test.js・
// stories/<name>.stories.js）を生成する。
//
// 使い方:
//   npm run new:component

import { dirname, relative, resolve } from "node:path";
import process, { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import {
  COMPONENT_KINDS,
  createComponent,
  validateComponentName,
  validateKind
} from "./_lib/newComponent.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const rl = createInterface({ input, output });
// question() は待機中以外に届いた行を捨てるため、パイプ入力でも取りこぼさないよう行イテレーターで読む
const lines = rl[Symbol.asyncIterator]();

/**
 * 検証を通過するまで入力を繰り返し求める。
 * @param {string} prompt
 * @param {(value: string) => string | null} validate
 * @returns {Promise<string>}
 */
async function ask(prompt, validate) {
  output.write(prompt);
  const { value: line, done } = await lines.next();
  if (done) {
    throw new Error("入力が中断されました。");
  }
  const value = line.trim();
  const error = validate(value);
  if (error === null) {
    return value;
  }
  console.error(`\nエラー: ${error}\n`);
  return ask(prompt, validate);
}

try {
  const name = await ask(
    "コンポーネント名を半角英小文字・数字およびハイフン（-）区切りで入力してください（例: grid-lines）：",
    (value) => validateComponentName(value, rootDir)
  );
  const title = await ask(
    "Storybookに表示する日本語名を入力してください（例: グリッド線）：",
    (value) => (value === "" ? "日本語名を入力してください。" : null)
  );
  const kind = await ask(
    `種類を入力してください（${COMPONENT_KINDS.join(" / ")}。状態を持たない描画はfunction、毎フレーム更新する部品はclass）：`,
    validateKind
  );

  const created = createComponent({ rootDir, name, title, kind });
  console.log("\n以下のファイルを生成しました。");
  for (const path of created) {
    console.log(`  ${relative(rootDir, path)}`);
  }
} catch (error) {
  console.error(`\nエラー: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
