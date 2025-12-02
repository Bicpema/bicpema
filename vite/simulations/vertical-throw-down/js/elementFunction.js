/**
 * 高さ入力の値が変更されたときの処理
 */
function onHeightChange() {
  let newHeight = parseFloat(heightInput.value());
  // 入力値のバリデーション
  if (isNaN(newHeight) || newHeight < 10) {
    newHeight = 10;
    heightInput.value(10);
  } else if (newHeight > 100) {
    newHeight = 100;
    heightInput.value(100);
  }
  if (!ball.isMoving) {
    ball.reset(newHeight);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  const newHeight = parseFloat(heightInput.value());
  ball.reset(newHeight);
  playPauseButton.html("▶ 開始");
}

/**
 * 開始/停止ボタンが押されたときの処理
 */
function onPlayPause() {
  if (ball.isMoving) {
    ball.stop();
    playPauseButton.html("▶ 再開");
  } else {
    if (ball.height <= 0) {
      ball.reset(parseFloat(heightInput.value()));
    }
    ball.start();
    playPauseButton.html("⏸ 停止");
  }
}

/**
 * モーダルを表示/非表示
 */
function onToggleModal() {
  const currentDisplay = settingsModal.style("display");
  if (currentDisplay === "none") {
    settingsModal.style("display", "block");
  } else {
    settingsModal.style("display", "none");
  }
}

/**
 * モーダルを閉じる
 */
function onCloseModal() {
  settingsModal.style("display", "none");
}
