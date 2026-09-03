// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { resetSimulationState } from "./logic.js";

/**
 * スタート・ストップボタンがクリックされたときの処理。
 */
export function onStartStopButtonClick() {
  if (state.clickedCount === false) {
    state.clickedCount = true;
    state.resetCount = false;
    state.startButton.hide();
    state.stopButton.show();
  } else {
    state.clickedCount = false;
    state.startButton.show();
    state.stopButton.hide();
  }
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
