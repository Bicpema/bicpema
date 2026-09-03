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

/**
 * initCollapse
 *
 * Bootstrap JSのcollapse（data-bs-toggle="collapse"等）の代替。
 * 1つのトグル要素のクリックで、対象要素の表示/非表示（Tailwindの
 * "hidden"クラス）を切り替える。開閉アニメーションは行わない。
 *
 * @param {object} options
 * @param {string} options.toggleSelectors トグルする要素のCSSセレクタ（複数要素にマッチしてよい）
 * @param {string} options.targetSelector 表示/非表示を切り替える対象のCSSセレクタ（単一要素）
 */
export function initCollapse({ toggleSelectors, targetSelector }) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const toggles = document.querySelectorAll(toggleSelectors);
  const syncExpandedState = () => {
    const isExpanded = !target.classList.contains("hidden");
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isExpanded));
    });
  };

  syncExpandedState();

  toggles.forEach((el) => {
    el.addEventListener("click", () => {
      target.classList.toggle("hidden");
      syncExpandedState();
    });
  });
}

/**
 * initTabs
 *
 * Bootstrap JSのタブ（data-bs-toggle="tab"等）の代替。
 * タブ要素（トリガー）のhref属性（例: "#paneId"）で対象のペインを
 * 特定し、クリックされたタブとそれに対応するペインのみを表示する。
 * タブの見た目（active状態）は呼び出し側のCSSで
 * ".nav-link" / ".nav-link.active" を定義しておく想定。
 *
 * @param {object} options
 * @param {string} options.tabSelector タブ（トリガー）要素のCSSセレクタ（複数要素にマッチしてよい、各要素はhref="#paneId"を持つ）
 */
export function initTabs({ tabSelector }) {
  const tabs = Array.from(document.querySelectorAll(tabSelector));
  if (tabs.length === 0) return;

  const activate = (activeTab) => {
    tabs.forEach((tab) => {
      const pane = document.querySelector(tab.getAttribute("href"));
      const isActive = tab === activeTab;
      tab.classList.toggle("active", isActive);
      if (pane) pane.classList.toggle("hidden", !isActive);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      activate(tab);
    });
  });
}

/**
 * initOffcanvas
 *
 * Bootstrap JSのoffcanvas（data-bs-toggle="offcanvas"等）の代替。
 * 対象要素に"is-open"クラスを付け外しすることで表示/非表示を
 * 切り替える。スライドイン等の見た目は呼び出し側のCSSで
 * ".offcanvas" / ".offcanvas.is-open" を定義しておく想定。
 *
 * @param {object} options
 * @param {string} options.openSelectors 開く要素のCSSセレクタ（複数要素にマッチしてよい）
 * @param {string} options.offcanvasSelector 対象要素のCSSセレクタ（単一要素）
 * @param {string} options.closeSelectors 閉じる要素のCSSセレクタ（複数要素にマッチしてよい）
 */
export function initOffcanvas({
  openSelectors,
  offcanvasSelector,
  closeSelectors,
}) {
  const panel = document.querySelector(offcanvasSelector);
  if (!panel) return;

  const open = () => panel.classList.add("is-open");
  const close = () => panel.classList.remove("is-open");

  document.querySelectorAll(openSelectors).forEach((el) => {
    el.addEventListener("click", open);
  });
  document.querySelectorAll(closeSelectors).forEach((el) => {
    el.addEventListener("click", close);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) close();
  });
}
