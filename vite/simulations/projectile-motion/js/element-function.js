// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { resetSimulationState } from "./logic.js";

/**
 * スタートボタンがクリックされたときの処理。
 */
export function onStartClick() {
  state.clickedCount = true;
  state.resetCount = false;
  state.startButton.hide();
  state.stopButton.show();
}

/**
 * ストップボタンがクリックされたときの処理。
 */
export function onStopClick() {
  state.clickedCount = false;
  state.startButton.show();
  state.stopButton.hide();
}

/**
 * リセットボタンがクリックされたときの処理。
 * @param {*} p p5インスタンス
 */
export function onResetButtonClick(p) {
  resetSimulationState(p);
  state.clickedCount = false;
  state.resetCount = true;
  state.startButton.show();
  state.stopButton.hide();
}
