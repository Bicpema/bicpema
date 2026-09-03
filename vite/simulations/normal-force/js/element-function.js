// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { initSettings, materialSet } from "./init.js";

/** 表示パターンを1（重力・鉛直抗力・水平抗力を分解表示）に切り替える。 */
export function sortButtonAction1() {
  state.material.sort = 1;
}

/** 表示パターンを2（重力・分力・合成過程を表示）に切り替える。 */
export function sortButtonAction2() {
  state.material.sort = 2;
}

/** 表示パターンを3（重力のみ表示）に切り替える。 */
export function sortButtonAction3() {
  state.material.sort = 3;
}

/** スタート/ストップボタンが押されたときの処理。 */
export function moveButtonAction() {
  if (state.clickedCount == false) {
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
 * リセットボタンが押されたときの処理。
 * @param {*} p p5インスタンス
 */
export function resetButtonAction(p) {
  initSettings(p);
  materialSet(p);
  state.clickedCount = false;
  state.resetCount = true;
  state.startButton.show();
  state.stopButton.hide();
}
