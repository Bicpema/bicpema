// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { onStartStopClick, onResetClick, onModeClick } from "./element-function.js";

/**
 * 波の定数と状態を初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  const wavelength = 200;
  state.A = wavelength / 4;
  state.k = p.TWO_PI / wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
  state.reflectX = p.width / 2;
  state.t = 0;
  state.front = 0;
  state.running = false;
  state.mode = "free";
}

/**
 * DOM 要素の選択とイベントハンドラの紐付けを行う。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.startStopButton = p.select("#startStopButton");
  state.resetButton = p.select("#resetButton");
  state.modeButton = p.select("#modeButton");

  state.startStopButton.mousePressed(() => onStartStopClick());
  state.resetButton.mousePressed(() => onResetClick(p));
  state.modeButton.mousePressed(() => onModeClick());
}
