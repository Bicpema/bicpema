// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * 電流スライダーの値が変更されたときにラベルを更新する。
 * @param {*} p - p5 インスタンス。
 */
export function onCurrentSliderInput(p) {
  const val = parseFloat(state.currentSlider.value()).toFixed(1);
  state.currentLabel.elt.textContent = `${val} A`;
}
