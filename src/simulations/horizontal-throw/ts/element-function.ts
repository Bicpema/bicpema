import { state } from "./state.js";
import {
  MIN_HEIGHT_INPUT,
  MAX_HEIGHT_INPUT,
  MIN_VELOCITY_INPUT,
  MAX_VELOCITY_INPUT
} from "./constants.js";

/**
 * 初期高さ入力の値が変更されたときの処理
 */
export function onHeightChange() {
  let newHeight = parseFloat(String(state.heightInput!.value()));
  if (Number.isNaN(newHeight) || newHeight < MIN_HEIGHT_INPUT) {
    newHeight = MIN_HEIGHT_INPUT;
    state.heightInput!.value(MIN_HEIGHT_INPUT);
  } else if (newHeight > MAX_HEIGHT_INPUT) {
    newHeight = MAX_HEIGHT_INPUT;
    state.heightInput!.value(MAX_HEIGHT_INPUT);
  }
  if (!state.ball!.isMoving) {
    state.ball!.reset(
      newHeight,
      parseFloat(String(state.velocityInput!.value()))
    );
  }
}

/**
 * 初速度入力の値が変更されたときの処理
 */
export function onVelocityChange() {
  let newVelocity = parseFloat(String(state.velocityInput!.value()));
  if (Number.isNaN(newVelocity) || newVelocity < MIN_VELOCITY_INPUT) {
    newVelocity = MIN_VELOCITY_INPUT;
    state.velocityInput!.value(MIN_VELOCITY_INPUT);
  } else if (newVelocity > MAX_VELOCITY_INPUT) {
    newVelocity = MAX_VELOCITY_INPUT;
    state.velocityInput!.value(MAX_VELOCITY_INPUT);
  }
  if (!state.ball!.isMoving) {
    state.ball!.reset(
      parseFloat(String(state.heightInput!.value())),
      newVelocity
    );
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newHeight = parseFloat(String(state.heightInput!.value()));
  const newVelocity = parseFloat(String(state.velocityInput!.value()));
  state.ball!.reset(newHeight, newVelocity);
  state.playPauseButton!.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.ball!.isMoving) {
    state.ball!.stop();
    state.playPauseButton!.html("再開");
  } else {
    if (state.ball!.height <= 0 && state.ball!.time > 0) {
      state.ball!.reset(
        parseFloat(String(state.heightInput!.value())),
        parseFloat(String(state.velocityInput!.value()))
      );
    }
    state.ball!.start();
    state.playPauseButton!.html("一時停止");
  }
}
