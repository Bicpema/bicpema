// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * 質量入力が変更されたときの処理
 */
export function onMassChange() {
  let m = parseFloat(state.massInput.value());
  if (isNaN(m) || m < 0.5) {
    m = 0.5;
    state.massInput.value(0.5);
  } else if (m > 5) {
    m = 5;
    state.massInput.value(5);
  }
  state.cart.mass = m;
  state.cart.reset();
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  state.cart.reset();
}

/**
 * 最大値をクリアする処理
 */
export function onClearMax() {
  if (!state.cart) return;
  state.cart.maxForce = 0;
  state.cart.maxAcceleration = 0;
  // 最大値発生時の質量は現在の質量にリセット
  state.cart.massAtMaxForce = state.cart.mass;
  state.cart.massAtMaxAcceleration = state.cart.mass;
}

/**
 * 設定モーダルを開閉するときの処理
 */
export function onToggleModal() {
  const currentDisplay = state.settingsModal.style("display");
  state.settingsModal.style(
    "display",
    currentDisplay === "none" ? "block" : "none"
  );
}

/**
 * 設定モーダルを閉じるときの処理
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
