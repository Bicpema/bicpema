// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * スタートボタンがクリックされたときの処理。
 */
export function startButtonFunction() {
  state.clickedCount = true;
}

/**
 * ストップボタンがクリックされたときの処理。
 */
export function stopButtonFunction() {
  state.clickedCount = false;
}

/**
 * リセットボタンがクリックされたときの処理。
 */
export function resetButtonAction() {
  state.posx = 50;
  state.clickedCount = false;
  state.count = 0;
  state.sounds = [];
}

/**
 * 速度入力値が変更されたときの処理。
 */
export function onSpeedInputChange() {
  const speedInput = document.getElementById("speedInput");
  if (!(speedInput instanceof HTMLInputElement)) return;
  const value = parseFloat(speedInput.value);
  if (!isNaN(value)) {
    state.speedValue = Math.max(0, Math.min(1000, value));
    speedInput.value = String(state.speedValue);
  }
}
