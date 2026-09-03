/**
 * hideLoadingSpinner
 *
 * ローディングスピナー（#loadingSpinner）を非表示にする。
 * p5.jsの初回draw()実行時に呼び出し、初期化が完了したことをユーザーに伝える。
 *
 * @param {string} [selector] スピナー要素のCSSセレクタ
 */
export function hideLoadingSpinner(selector = "#loadingSpinner") {
  const spinner = document.querySelector(selector);
  if (!spinner) return;
  spinner.classList.add("hidden");
}
