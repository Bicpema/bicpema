// init.js は初期処理専用のファイルです。

import { state, N, LAMBDA, OMEGA, X_START } from "./state.js";
import { onStartStopButtonClick, onResetButtonClick } from "./element-function.js";

/**
 * 設定の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function settingInit(p) {
  state.k = p.TWO_PI / LAMBDA;
}

/**
 * 要素の選択を初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function elementSelectInit(p) {
  state.startStopButton = p.select("#startStopButton");
  state.resetButton = p.select("#resetButton");
  state.timesSlider = p.select("#timesSlider");

  state.startStopButton.mousePressed(() => onStartStopButtonClick(p));
  state.resetButton.mousePressed(() => onResetButtonClick(p));
}

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function valueInit(p) {
  state.t = 0;
  state.running = false;
  state.focusIndex = Math.floor(N / 2);

  state.particles = [];
  for (let i = 0; i < N; i++) {
    const x0 = p.map(i, 0, N - 1, X_START, p.width - 60);
    state.particles.push({ x0 });
  }

  if (state.startStopButton) {
    state.startStopButton.html("スタート");
    state.startStopButton.removeClass("btn-danger");
    state.startStopButton.addClass("btn-primary");
  }
}
