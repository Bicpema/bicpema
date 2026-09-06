import { state } from "./state.js";
import {
  MIN_HEIGHT_INPUT,
  MAX_HEIGHT_INPUT,
  GROUND_LEVEL_HEIGHT,
} from "./constants.js";

/** 空気抵抗係数の最小値 */
const DRAG_COEFFICIENT_MIN = 0;
/** 空気抵抗係数の最大値 */
const DRAG_COEFFICIENT_MAX = 2;

/**
 * 高さ入力欄の値をクランプし、範囲外だった場合は入力欄の表示も補正する
 * @param {number} newHeight
 * @returns {number} クランプ後の高さ
 */
export function clampHeight(newHeight) {
  if (isNaN(newHeight) || newHeight < MIN_HEIGHT_INPUT) {
    state.heightInput.value(MIN_HEIGHT_INPUT);
    return MIN_HEIGHT_INPUT;
  }
  if (newHeight > MAX_HEIGHT_INPUT) {
    state.heightInput.value(MAX_HEIGHT_INPUT);
    return MAX_HEIGHT_INPUT;
  }
  return newHeight;
}

/**
 * 空気抵抗係数入力欄の値をクランプし、範囲外だった場合は入力欄の表示も補正する
 * @param {number} newDragCoefficient
 * @returns {number} クランプ後の空気抵抗係数
 */
export function clampDragCoefficient(newDragCoefficient) {
  if (isNaN(newDragCoefficient) || newDragCoefficient < DRAG_COEFFICIENT_MIN) {
    state.dragCoefficientInput.value(DRAG_COEFFICIENT_MIN);
    return DRAG_COEFFICIENT_MIN;
  }
  if (newDragCoefficient > DRAG_COEFFICIENT_MAX) {
    state.dragCoefficientInput.value(DRAG_COEFFICIENT_MAX);
    return DRAG_COEFFICIENT_MAX;
  }
  return newDragCoefficient;
}

/**
 * 高さ入力の値が変更されたときの処理
 */
export function onHeightChange() {
  const newHeight = clampHeight(parseFloat(state.heightInput.value()));
  if (!state.ball.isMoving) {
    state.ball.reset(newHeight, state.ball.dragCoefficient);
  }
}

/**
 * 空気抵抗係数入力の値が変更されたときの処理
 */
export function onDragCoefficientChange() {
  const newDragCoefficient = clampDragCoefficient(
    parseFloat(state.dragCoefficientInput.value())
  );
  if (!state.ball.isMoving) {
    state.ball.reset(state.ball.initialHeight, newDragCoefficient);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newHeight = clampHeight(parseFloat(state.heightInput.value()));
  const newDragCoefficient = clampDragCoefficient(
    parseFloat(state.dragCoefficientInput.value())
  );
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
