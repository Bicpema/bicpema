// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state, N, X_START } from "./state.js";

/**
 * スタート／ストップボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onStartStopButtonClick(p) {
  state.running = !state.running;
  if (state.running) {
    state.startStopButton.html("ストップ");
    state.startStopButton.removeClass("btn-primary");
    state.startStopButton.addClass("btn-danger");
  } else {
    state.startStopButton.html("スタート");
    state.startStopButton.removeClass("btn-danger");
    state.startStopButton.addClass("btn-primary");
  }
}

/**
 * リセットボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onResetButtonClick(p) {
  state.t = 0;
  state.running = false;
  state.focusIndex = Math.floor(N / 2);

  state.particles = [];
  for (let i = 0; i < N; i++) {
    const x0 = p.map(i, 0, N - 1, X_START, p.width - 60);
    state.particles.push({ x0 });
  }

  state.startStopButton.html("スタート");
  state.startStopButton.removeClass("btn-danger");
  state.startStopButton.addClass("btn-primary");
}
