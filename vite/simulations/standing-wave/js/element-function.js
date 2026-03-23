// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * スタート/ストップボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onStartStopClick(p) {
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
export function onResetClick(p) {
  initValue(p);
  state.startStopButton.html("スタート");
  state.startStopButton.removeClass("btn-danger");
  state.startStopButton.addClass("btn-primary");
}
