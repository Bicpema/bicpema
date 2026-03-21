import { state } from "./state.js";

/**
 * 初速度入力の値が変更されたときの処理
 */
export function onVelocityChange() {
  let newVelocity = parseFloat(state.velocityInput.value());
  if (isNaN(newVelocity) || newVelocity < 5) {
    newVelocity = 5;
    state.velocityInput.value(5);
  } else if (newVelocity > 50) {
    newVelocity = 50;
    state.velocityInput.value(50);
  }
  if (!state.ball.isMoving) {
    state.ball.reset(newVelocity);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  const newVelocity = parseFloat(state.velocityInput.value());
  state.ball.reset(newVelocity);
  state.playPauseButton.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.ball.isMoving) {
    state.ball.stop();
    state.playPauseButton.html("再開");
  } else {
    if (state.ball.height <= 0 && state.ball.time > 0) {
      state.ball.reset(parseFloat(state.velocityInput.value()));
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
