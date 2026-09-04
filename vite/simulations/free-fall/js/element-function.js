import { state } from "./state.js";

/** 空気抵抗係数の最小値 */
const DRAG_COEFFICIENT_MIN = 0;
/** 空気抵抗係数の最大値 */
const DRAG_COEFFICIENT_MAX = 2;

/**
 * 高さ入力の値が変更されたときの処理
 */
export function onHeightChange() {
  let newHeight = parseFloat(state.heightInput.value());
  if (isNaN(newHeight) || newHeight < 10) {
    newHeight = 10;
    state.heightInput.value(10);
  } else if (newHeight > 100) {
    newHeight = 100;
    state.heightInput.value(100);
  }
  if (!state.ball.isMoving) {
    state.ball.reset(newHeight, state.ball.dragCoefficient);
  }
}

/**
 * 空気抵抗係数入力の値が変更されたときの処理
 */
export function onDragCoefficientChange() {
  let newDragCoefficient = parseFloat(state.dragCoefficientInput.value());
  if (isNaN(newDragCoefficient) || newDragCoefficient < DRAG_COEFFICIENT_MIN) {
    newDragCoefficient = DRAG_COEFFICIENT_MIN;
    state.dragCoefficientInput.value(DRAG_COEFFICIENT_MIN);
  } else if (newDragCoefficient > DRAG_COEFFICIENT_MAX) {
    newDragCoefficient = DRAG_COEFFICIENT_MAX;
    state.dragCoefficientInput.value(DRAG_COEFFICIENT_MAX);
  }
  if (!state.ball.isMoving) {
    state.ball.reset(state.ball.initialHeight, newDragCoefficient);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newHeight = parseFloat(state.heightInput.value());
  const newDragCoefficient = parseFloat(state.dragCoefficientInput.value());
  state.ball.reset(newHeight, newDragCoefficient);
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
    if (state.ball.height <= 1) {
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
