import { initModal } from "../vite/ts/bicpema-modal-controller.ts";
import html from "./settings-modal.html?bicpema";

/**
 * 設定ボタンと設定モーダルを描画し、開閉を有効にする。
 * @param {Record<string, string>} args - 未使用（Storybookの引数）
 * @param {{ id: string }} context - Storybookのコンテキスト
 * @returns {HTMLElement} ストーリーのルート要素
 */
function render(args, { id }) {
  const root = document.createElement("div");
  // 同一ページに複数のstoryが残らないよう、storyごとにidを分ける
  root.innerHTML = html.replaceAll("simulationSettingModal", `${id}-modal`);
  root.className = "relative h-[480px] w-full";
  queueMicrotask(() =>
    initModal({
      openSelectors: `#${id}-root .settings-modal-open`,
      modalSelector: `#${id}-modal`,
      closeSelectors: `#${id}-modal .modal-close`
    })
  );
  root.id = `${id}-root`;
  return root;
}

export default {
  title: "UI/設定ボタンと設定モーダル",
  parameters: { layout: "fullscreen" }
};

/** 白背景のモーダル（既定）。 */
export const Light = { render };
