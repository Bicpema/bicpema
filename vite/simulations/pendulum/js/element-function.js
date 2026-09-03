// element-function.jsはイベントハンドラー専用のファイルです。

import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * スタートボタンが押されたときの処理
 */
export function onStartClick() {
  state.clickedCount = true;
}

/**
 * ストップボタンが押されたときの処理
 */
export function onStopClick() {
  state.clickedCount = false;
}

/**
 * リセットボタンが押されたときの処理
 * @param {*} p p5インスタンス
 */
export function onResetClick(p) {
  initValue(p);
}

/**
 * グリッド表示ボタンが押されたときの処理
 */
export function onGridClick() {
  state.gridIs = !state.gridIs;
}

/**
 * 振れ角度・紐の長さの入力が変更されたときの処理
 */
export function onInputChange() {
  state.leftPendulum.theta0 = Number(state.leftAngleInput.value());
  state.leftPendulum.stringLength = Number(state.leftLengthInput.value()) * 50;
  state.rightPendulum.theta0 = Number(state.rightAngleInput.value());
  state.rightPendulum.stringLength =
    Number(state.rightLengthInput.value()) * 50;
}
