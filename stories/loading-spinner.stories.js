import { hideLoadingSpinner } from "../vite/ts/bicpema-loading-spinner.ts";
import html from "./loading-spinner.html?bicpema";

export default {
  title: "UI/ローディングスピナー",
  parameters: { layout: "fullscreen" }
};

/**
 * スピナーを枠内に描画する。スピナーは画面全体を覆う固定表示のため、
 * transformで固定の基準をこの枠にして、枠内だけを覆うようにする。
 * @param {string} id - storyごとのid（同一ページでのid重複を避ける）
 * @returns {HTMLElement} ストーリーのルート要素
 */
function render(id) {
  const root = document.createElement("div");
  root.className = "relative h-[240px] w-full [transform:translateZ(0)]";
  root.innerHTML = html.replaceAll("loadingSpinner", id);
  return root;
}

/** 初期化完了までシミュレーション全体を覆うスピナー。 */
export const Default = { render: (args, { id }) => render(`${id}-spinner`) };

/** 「非表示にする」ボタンで`hideLoadingSpinner()`の動作を確認できる。 */
export const Hide = {
  render: (args, { id }) => {
    const spinnerId = `${id}-spinner`;
    const root = render(spinnerId);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "非表示にする";
    button.className =
      "absolute bottom-3 left-3 z-[2100] cursor-pointer rounded bg-neutral-100 px-3 py-1.5 text-neutral-900";
    button.addEventListener("click", () => hideLoadingSpinner(`#${spinnerId}`));
    root.append(button);
    return root;
  }
};
