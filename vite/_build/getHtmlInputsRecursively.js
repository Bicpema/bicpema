import { readdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 指定したディレクトリから再帰的にHTMLファイルを取得
 * `_` で始まるディレクトリ（`_templates/` などビルド対象外のファイル置き場）は除外する
 * @param {string} dir - 検索するディレクトリ
 * @returns {Record<string, string>} - input設定用のオブジェクト
 */
export const getHtmlInputsRecursively = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.reduce((inputs, entry) => {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_")) {
        return inputs;
      }
      // ディレクトリの場合、再帰的に取得
      Object.assign(inputs, getHtmlInputsRecursively(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      // ファイル名（拡張子なし）と親ディレクトリ名を組み合わせてキーにする
      const directories = fullPath.split("/");
      const parentDir = directories[directories.length - 2];
      const fileName = entry.name.replace(/\.html$/, "");
      const key = fileName === "index" ? parentDir : `${parentDir}-${fileName}`;
      inputs[key] = fullPath;
    }
    return inputs;
  }, /** @type {Record<string, string>} */ ({}));
};
