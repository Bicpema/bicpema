// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { onCurrentSliderInput } from "./element-function.js";

/**
 * DOM 要素を選択してイベントを設定する。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.currentSlider = p.select("#currentSlider");
  state.currentLabel = p.select("#currentLabel");

  state.currentSlider.input(() => onCurrentSliderInput(p));
}

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  // 初期値は HTML 側で設定済みのため特別な処理は不要
}
