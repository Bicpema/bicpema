import { state } from "./state.js";
import {
  MIN_HEIGHT_INPUT,
  MAX_HEIGHT_INPUT,
  MIN_INITIAL_VELOCITY_INPUT,
  MAX_INITIAL_VELOCITY_INPUT,
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
    state.ball.reset(newHeight, parseFloat(state.initialVelocityInput.value()));
    state.graph.reset();
  }
}

/**
 * 初速度入力の値が変更されたときの処理
 */
export function onInitialVelocityChange() {
  let newVelocity = parseFloat(state.initialVelocityInput.value());
  if (isNaN(newVelocity) || newVelocity < MIN_INITIAL_VELOCITY_INPUT) {
    newVelocity = MIN_INITIAL_VELOCITY_INPUT;
    state.initialVelocityInput.value(MIN_INITIAL_VELOCITY_INPUT);
  } else if (newVelocity > MAX_INITIAL_VELOCITY_INPUT) {
    newVelocity = MAX_INITIAL_VELOCITY_INPUT;
    state.initialVelocityInput.value(MAX_INITIAL_VELOCITY_INPUT);
  }
  if (!state.ball.isMoving) {
    state.ball.reset(parseFloat(state.heightInput.value()), newVelocity);
    state.graph.reset();
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newHeight = parseFloat(state.heightInput.value());
  const newInitialVelocity = parseFloat(state.initialVelocityInput.value());
  state.ball.reset(newHeight, newInitialVelocity);
  state.playPauseButton.html("▶ 開始");
  state.graph.reset();
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
      state.ball.reset(
        parseFloat(state.heightInput.value()),
        parseFloat(state.initialVelocityInput.value())
      );
    }
    state.ball.start();
    state.playPauseButton.html("一時停止");
  }
}

/**
 * モーダルを表示/非表示
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
 * モーダルを閉じる
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
