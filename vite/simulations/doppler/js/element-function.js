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
 * 設定ボタンがクリックされたときの処理。
 */
export function onToggleModalClick() {
  document.getElementById("settingsModal").style.display = "block";
}

/**
 * 設定モーダルの閉じるボタンがクリックされたときの処理。
 */
export function onCloseModalClick() {
  document.getElementById("settingsModal").style.display = "none";
}

/**
 * 速度入力値が変更されたときの処理。
 */
export function onSpeedInputChange() {
  const value = parseFloat(document.getElementById("speedInput").value);
  if (!isNaN(value)) {
    state.speedValue = value;
  }
}
