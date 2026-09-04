import { state } from "./state.js";
import {
  MIN_HEIGHT_INPUT,
  MAX_HEIGHT_INPUT,
  GROUND_LEVEL_HEIGHT,
} from "./constants.js";

/**
 * 高さ入力の値が変更されたときの処理
 */
export function onHeightChange() {
  let newHeight = parseFloat(state.heightInput.value());
  if (isNaN(newHeight) || newHeight < MIN_HEIGHT_INPUT) {
    newHeight = MIN_HEIGHT_INPUT;
    state.heightInput.value(MIN_HEIGHT_INPUT);
  } else if (newHeight > MAX_HEIGHT_INPUT) {
    newHeight = MAX_HEIGHT_INPUT;
    state.heightInput.value(MAX_HEIGHT_INPUT);
  }
  if (!state.ball.isMoving) {
    state.ball.reset(newHeight);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newHeight = parseFloat(state.heightInput.value());
  state.ball.reset(newHeight);
  state.playPauseButton.html("▶ 開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.ball.isMoving) {
    state.ball.stop();
    state.playPauseButton.html("再開");
  } else {
    if (state.ball.height <= GROUND_LEVEL_HEIGHT) {
      return;
    }
    state.ball.start();
    state.playPauseButton.html("一時停止");
  }
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
