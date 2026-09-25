import type p5 from "p5";

/**
 * loadFontFromUrl
 *
 * フォントファイルのURLからp5.Fontを読み込む。
 *
 * p5.js v2の`loadFont()`はURLを直接渡すと、Content-Type判定のためにまずHEADリクエストを送る。
 * Firebase StorageのダウンロードURLはHEADのレスポンスにCORSヘッダーを付与しないため、
 * GETへのフォールバックで読み込み自体は成功するものの、ブラウザのコンソールにCORSエラーが出力される。
 * `@font-face`形式のCSS文字列を渡した場合はHEADリクエストを経由せずGETのみで読み込まれるため、これを利用する。
 *
 * @param p p5インスタンス
 * @param url フォントファイル(.ttf/.otf/.woff/.woff2)のURL
 * @returns 読み込んだp5.Fontに解決されるPromise(読み込み失敗時はreject)
 */
export function loadFontFromUrl(p: p5, url: string): Promise<p5.Font> {
  const fileName = decodeURIComponent(new URL(url).pathname).split("/").pop();
  const family = fileName?.replace(/\.[^.]+$/, "") || "BicpemaFont";
  return p.loadFont(
    `@font-face { font-family: "${family}"; src: url("${url}"); }`
  );
}
