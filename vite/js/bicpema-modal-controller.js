/**
 * initModal
 *
 * Bootstrap JSのモーダル（data-bs-toggle="modal"等）の代替。
 * TailwindCSSへの移行に伴い、新規ライブラリを追加せず素のJSで
 * モーダルの開閉を行うための共通ユーティリティ。
 * モーダル要素はTailwindの"hidden"クラスで表示/非表示を切り替える想定。
 *
 * @param {object} options
 * @param {string} options.openSelectors モーダルを開く要素のCSSセレクタ（複数要素にマッチしてよい）
 * @param {string} options.modalSelector モーダル本体のCSSセレクタ（単一要素）
 * @param {string} options.closeSelectors モーダルを閉じる要素のCSSセレクタ（複数要素にマッチしてよい）
 */
export function initModal({ openSelectors, modalSelector, closeSelectors }) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return;

  const setModalVisibility = (isHidden) => {
    modal.classList.toggle("hidden", isHidden);
    modal.setAttribute("aria-hidden", String(isHidden));
  };
  const open = () => setModalVisibility(false);
  const close = () => setModalVisibility(true);

  setModalVisibility(modal.classList.contains("hidden"));

  document.querySelectorAll(openSelectors).forEach((el) => {
    el.addEventListener("click", open);
  });
  document.querySelectorAll(closeSelectors).forEach((el) => {
    el.addEventListener("click", close);
  });
  // モーダル背景（オーバーレイ部分）のクリックでも閉じる
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
}
