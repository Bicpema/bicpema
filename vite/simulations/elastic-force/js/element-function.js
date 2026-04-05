// element-function.js はイベントハンドラー専用のファイルです。

import { state } from "./state.js";

/**
 * ばね定数スライダーの値が変更されたときの処理
 */
export function onSpringConstantChange() {
  const k = parseInt(state.springConstantInput.value());
  state.springConstantDisplay.html(`${k} N/m`);
  for (const spring of state.springs) {
    spring.updateK(k);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  for (const spring of state.springs) {
    spring.reset();
  }
}

/**
 * モーダルを表示/非表示
 */
export function onToggleModal() {
  const currentDisplay = state.settingsModal.style("display");
  if (currentDisplay === "none") {
    state.settingsModal.style("display", "block");
  } else {
    state.settingsModal.style("display", "none");
  }
}

/**
 * モーダルを閉じる
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
