// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { updateChart } from "./graph.js";

/**
 * 再生・停止ボタンのラベルを更新する。
 */
const updatePlayPauseButton = () => {
  const btn = document.getElementById("playPauseButton");
  if (state.isPlaying) {
    btn.innerHTML = "⏸ 一時停止";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-warning");
  } else {
    btn.innerHTML = "▶ 開始";
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-primary");
  }
};

/**
 * 再生・停止ボタンが押されたときの処理。
 */
export const onPlayPause = () => {
  state.isPlaying = !state.isPlaying;
  updatePlayPauseButton();
};

/**
 * リセットボタンが押されたときの処理。
 */
export const onReset = () => {
  state.isPlaying = false;
  updatePlayPauseButton();
  state.elapsedTime = 0;
  state.lastGraphUpdate = 0;
  state.maxObservedVelocity = 0;
  state.train.reset();
  state.vtData = [{ x: 0, y: 0 }];
  updateChart();
};

/**
 * 加速度入力が変更されたときの処理。
 */
export const onAccelerationChange = () => {
  const input = /** @type {HTMLInputElement | null} */ (
    document.getElementById("accelerationInput")
  );
  if (!input) return;
  const val = parseFloat(input.value);
  if (!isNaN(val)) {
    state.acceleration = val;
  }
};
