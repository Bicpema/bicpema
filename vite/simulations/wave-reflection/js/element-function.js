// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * スタート/ストップボタンがクリックされたときの処理。
 */
export function onStartStopClick() {
  state.running = !state.running;
  if (state.running) {
    state.startStopButton.html("ストップ");
    state.startStopButton.elt.classList.remove("btn-primary");
    state.startStopButton.elt.classList.add("btn-danger");
  } else {
    state.startStopButton.html("スタート");
    state.startStopButton.elt.classList.remove("btn-danger");
    state.startStopButton.elt.classList.add("btn-primary");
  }
}

/**
 * リセットボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onResetClick(p) {
  initValue(p);
  state.startStopButton.html("スタート");
  state.startStopButton.elt.classList.remove("btn-danger");
  state.startStopButton.elt.classList.add("btn-primary");
}

/**
 * モード切り替えボタンがクリックされたときの処理。
 */
export function onModeClick() {
  state.mode = state.mode === "free" ? "fixed" : "free";
  if (state.mode === "free") {
    state.modeButton.html("自由端");
    state.modeButton.elt.classList.remove("btn-success");
    state.modeButton.elt.classList.add("btn-warning");
  } else {
    state.modeButton.html("固定端");
    state.modeButton.elt.classList.remove("btn-warning");
    state.modeButton.elt.classList.add("btn-success");
  }
}
