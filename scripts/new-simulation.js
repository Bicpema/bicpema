// templates/ のひな形から新しいシミュレーションを vite/simulations/ 配下に生成する。
//
// 使い方:
//   npm run new:simulation

import { dirname, resolve } from "node:path";
import process, { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import {
  createSimulation,
  validateDirName,
  validateTitle
} from "./_lib/newSimulation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const templateDir = resolve(rootDir, "templates");
const simulationsDir = resolve(rootDir, "vite", "simulations");

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
  const title = await ask(
    "シミュレーションのタイトルを日本語で入力してください：",
    validateTitle
  );
  const dirName = await ask(
    "シミュレーションのフォルダー名を半角英小文字・数字およびハイフン（-）区切りで入力してください（例: doppler, projectile-motion）：",
    (value) => validateDirName(value, simulationsDir)
  );

  createSimulation({ templateDir, simulationsDir, title, dirName });
  console.log(
    `\nvite/simulations/ に「${title}」のフォルダー「${dirName}」を生成しました。`
  );
} catch (error) {
  console.error(`\nエラー: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
