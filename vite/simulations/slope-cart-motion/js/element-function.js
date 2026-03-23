// element-function.js - イベントハンドラー専用のファイルです。

import { state } from "./state.js";
import { updateGraph } from "./graph.js";

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  state.cart.reset();
  state.tapeMarks = [];
  state.vtData = [];
  state.isPlaying = false;
  state.playPauseButton.html("▶ 開始");
  updateGraph();
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.cart.isAtBottom) {
    // 下端に到達済みの場合はリセットして再開
    onReset();
    state.isPlaying = true;
    state.playPauseButton.html("⏸ 停止");
    return;
  }
  state.isPlaying = !state.isPlaying;
  state.playPauseButton.html(state.isPlaying ? "⏸ 停止" : "▶ 再開");
}

/**
 * 設定モーダルを表示/非表示にする
 */
export function onToggleModal() {
  const currentDisplay = state.settingsModal.style("display");
  if (currentDisplay === "none") {
    state.settingsModal.style("display", "block");
  } else {
    state.settingsModal.style("display", "none");
  }
}

/**
 * 設定モーダルを閉じる
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
  applySettings();
}

/**
 * 設定を適用してシミュレーションをリセットする
 */
export function applySettings() {
  const newAngle = parseInt(state.angleInput.value());
  const newInterval = parseFloat(state.intervalInput.value());

  if (newAngle >= 10 && newAngle <= 40) {
    state.slopeDeg = newAngle;
    state.cart.setAngle(newAngle);
  }
  state.recInterval = newInterval;
  onReset();
}

/**
 * v-tグラフの表示/非表示を切り替える
 */
export function onToggleGraph() {
  state.graphVisible = !state.graphVisible;
  const graphDiv = document.getElementById("graph");
  const toggleBtn = document.getElementById("graphToggleButton");
  if (state.graphVisible) {
    graphDiv.style.display = "block";
    toggleBtn.textContent = "v-tグラフを非表示";
    updateGraph();
  } else {
    graphDiv.style.display = "none";
    toggleBtn.textContent = "v-tグラフを表示";
  }
}
