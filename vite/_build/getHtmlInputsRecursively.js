import { readdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 指定したディレクトリから再帰的にHTMLファイルを取得
 * @param {string} dir - 検索するディレクトリ
 * @param {string} baseDir - ベースディレクトリ (ルートからの相対パス用)
 * @returns {Object} - input設定用のオブジェクト
 */
export const getHtmlInputsRecursively = (dir, baseDir = dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.reduce((inputs, entry) => {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      // ディレクトリの場合、再帰的に取得
      Object.assign(inputs, getHtmlInputsRecursively(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      // 最後のディレクトリ名をキーにする
      const directories = fullPath.split("/");
      const key = directories[directories.length - 2];
      inputs[key] = fullPath;
    }
    return inputs;
  }, {});
};
