import { bindToggleControls } from "../vite/ts/bicpema-controls-controller.ts";

/**
 * コンテナ内の要素をp.select()相当で取得するスタブを返す。
 * bindToggleControls()が受け取るp5インスタンスの代わりに使う。
 * @param {ParentNode} root - 検索対象のルート要素
 * @returns {{ select: (selector: string) => { elt: Element | null } | null }} p5のselect()を模したスタブ
 */
function createSelectStub(root) {
  return {
    select: (selector) => {
      const elt = root.querySelector(selector);
      return elt ? { elt } : null;
    }
  };
}

export default {
  title: "UI/再生・リセットボタン",
  parameters: { layout: "centered" }
};

/** 左下に配置する再生操作エリア。開始/一時停止のトグルとリセットを確認できる。 */
export const Toggle = {
  render: () => {
    const root = document.createElement("div");
    root.className = "flex gap-2";
    root.innerHTML = `
      <button type="button" class="cursor-pointer rounded bg-neutral-600 px-3 py-1.5 text-white hover:bg-neutral-500" id="playPauseButton">開始</button>
      <button type="button" class="cursor-pointer rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-500" id="resetButton">リセット</button>
    `;
    let isPlaying = false;
    const { toggleButton } = bindToggleControls(createSelectStub(root), {
      toggleSelector: "#playPauseButton",
      resetSelector: "#resetButton",
      onToggle: () => {
        isPlaying = !isPlaying;
        toggleButton.elt.textContent = isPlaying ? "一時停止" : "開始";
      },
      onReset: () => {
        isPlaying = false;
        toggleButton.elt.textContent = "開始";
      }
    });
    return root;
  }
};
