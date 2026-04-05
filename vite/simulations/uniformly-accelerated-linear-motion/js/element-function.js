import { state } from "./state.js";

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const v0 = parseFloat(state.initialVelocityInput.value());
  const a = parseFloat(state.accelerationInput.value());
  state.car.reset(v0, a);
  state.graph.reset();
  state.playPauseButton.html("▶ 開始");
}

/**
 * 再生/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.car.isMoving) {
    state.car.stop();
    state.playPauseButton.html("再開");
  } else {
    state.car.start();
    state.playPauseButton.html("⏸ 一時停止");
  }
}

/**
 * 設定モーダルの表示/非表示を切り替える
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
}

/**
 * グラフの表示/非表示を切り替える
 */
export function onToggleGraph() {
  state.graphVisible = !state.graphVisible;
  const graphDiv = document.getElementById("graph");
  if (graphDiv) {
    graphDiv.style.display = state.graphVisible ? "block" : "none";
  }
  if (state.graphVisible) {
    state.graph.updateGraph();
  }
  state.graphToggleButton.html(
    state.graphVisible ? "📊 グラフを非表示" : "📊 グラフを表示"
  );
}
