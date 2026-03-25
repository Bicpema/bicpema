// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * 物体Aの質量入力が変更されたときの処理
 */
export function onMassAChange() {
  let m = parseFloat(state.massAInput.value());
  if (isNaN(m) || m < 0.5) {
    m = 0.5;
    state.massAInput.value(0.5);
  } else if (m > 5) {
    m = 5;
    state.massAInput.value(5);
  }
  state.blockA.mass = m;
  onReset();
}

/**
 * 物体Bの質量入力が変更されたときの処理
 */
export function onMassBChange() {
  let m = parseFloat(state.massBInput.value());
  if (isNaN(m) || m < 0.5) {
    m = 0.5;
    state.massBInput.value(0.5);
  } else if (m > 5) {
    m = 5;
    state.massBInput.value(5);
  }
  state.blockB.mass = m;
  onReset();
}

/**
 * 開始ボタンが押されたときの処理
 */
export function onStart() {
  if (state.phase === "ready") {
    state.phase = "releasing";
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  state.blockA.reset();
  state.blockB.reset();
  state.phase = "ready";
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
