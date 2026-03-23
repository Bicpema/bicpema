// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { onStartStopClick, onResetClick } from "./element-function.js";

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  state.margin = 50;
  state.innerW = p.width - state.margin * 2;
  state.innerH = p.height - state.margin * 2;
  state.wavelength = 200;
  state.A = 40;
  state.k = p.TWO_PI / state.wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
  state.t = 0;
  state.running = false;
  state.rightFront = 0;
  state.leftFront = state.innerW;
}

/**
 * DOM 要素の選択とイベントハンドラーのバインドを行う。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.startStopButton = p.select("#startStopButton");
  state.resetButton = p.select("#resetButton");

  state.startStopButton.mousePressed(() => onStartStopClick(p));
  state.resetButton.mousePressed(() => onResetClick(p));
}
