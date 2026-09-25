// 新規シミュレーションのひな形生成に関する処理。
// 対話部分は scripts/new-simulation.js が担い、ここでは検証とファイル生成のみを行う。

import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";

// 半角英小文字・数字をハイフンで区切った形式（先頭末尾・連続のハイフンは不可）
export const SIMULATION_DIR_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * シミュレーションのタイトルを検証する。
 * @param {string} title
 * @returns {string | null} エラーメッセージ（問題なければnull）
 */
export function validateTitle(title) {
  if (title.trim() === "") {
    return "タイトルを入力してください。";
  }
  return null;
}

/**
 * シミュレーションのフォルダー名を検証する。
 * @param {string} dirName
 * @param {string} simulationsDir シミュレーションを格納するディレクトリ
 * @returns {string | null} エラーメッセージ（問題なければnull）
 */
export function validateDirName(dirName, simulationsDir) {
  if (!SIMULATION_DIR_NAME_PATTERN.test(dirName)) {
    return "半角英小文字・数字をハイフン（-）で区切った形式で入力してください（大文字・アンダースコア・先頭末尾や連続のハイフンは不可）。";
  }
  // 大文字小文字を区別しないファイルシステムでも衝突しないよう小文字で比較する
  const exists = readdirSync(simulationsDir).some(
    (name) => name.toLowerCase() === dirName
  );
  if (exists) {
    return `フォルダー「${dirName}」は既に存在します。別の名前を入力してください。`;
  }
  return null;
}

/**
 * テンプレート内の `{% key %}` を置換する。
 * @param {string} text
 * @param {Record<string, string>} values
 * @returns {string}
 */
export function renderTemplate(text, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{% ${key} %}`, value),
    text
  );
}

/**
 * テンプレートをコピーして新しいシミュレーションのフォルダーを生成する。
 * @param {{ templateDir: string, simulationsDir: string, title: string, dirName: string }} options
 * @returns {string} 生成したフォルダーのパス
 */
export function createSimulation({
  templateDir,
  simulationsDir,
  title,
  dirName
}) {
  const destDir = join(simulationsDir, dirName);
  if (existsSync(destDir)) {
    throw new Error(`フォルダー「${dirName}」は既に存在します。`);
  }
  cpSync(templateDir, destDir, {
    recursive: true,
    errorOnExist: true,
    force: false
  });

  const indexPath = join(destDir, "index.html");
  const html = readFileSync(indexPath, "utf-8");
  writeFileSync(
    indexPath,
    renderTemplate(html, { title, path: `/simulations/${dirName}` }),
    "utf-8"
  );
  return destDir;
}
