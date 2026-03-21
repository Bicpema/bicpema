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
 * 設定モーダルを開閉する。
 */
export const onToggleModal = () => {
  const modal = document.getElementById("settingsModal");
  if (modal.style.display === "none") {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
};

/**
 * 設定モーダルを閉じる。
 */
export const onCloseModal = () => {
  document.getElementById("settingsModal").style.display = "none";
};

/**
 * 加速度入力が変更されたときの処理。
 */
export const onAccelerationChange = () => {
  const val = parseFloat(document.getElementById("accelerationInput").value);
  if (!isNaN(val)) {
    state.acceleration = val;
  }
};
