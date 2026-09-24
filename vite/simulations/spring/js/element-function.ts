// element-function.tsは仮想DOMメソッド管理専用のファイルです。

import p5 from "p5";
import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * スタート/ストップボタンが押されたときの処理。
 * スタートボタン・ストップボタンの両方に割り当てられており、再生状態をトグルする。
 */
export function moveButtonAction() {
  state.clickedCount = !state.clickedCount;
}

/**
 * リセットボタンが押されたときの処理。
 * @param {*} p p5インスタンス
 */
export function resetButtonAction(p: p5) {
  initValue(p);
}
