import { state } from "./state.js";

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
    state.ball.reset(newHeight, parseFloat(state.initialVelocityInput.value()));
    state.graph.reset();
  }
}

/**
 * 初速度入力の値が変更されたときの処理
 */
export function onInitialVelocityChange() {
  let newVelocity = parseFloat(state.initialVelocityInput.value());
  if (isNaN(newVelocity) || newVelocity < 1) {
    newVelocity = 1;
    state.initialVelocityInput.value(1);
  } else if (newVelocity > 30) {
    newVelocity = 30;
    state.initialVelocityInput.value(30);
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
    if (state.ball.height <= 1) {
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
