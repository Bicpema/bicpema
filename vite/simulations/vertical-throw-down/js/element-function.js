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
    if (state.ball.height <= 0) {
      state.ball.reset(parseFloat(state.heightInput.value()));
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
