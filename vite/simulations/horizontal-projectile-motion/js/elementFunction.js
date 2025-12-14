/**
 * 初速度入力の値が変更されたときの処理
 */
function onVelocityChange() {
  let newVelocity = parseFloat(velocityInput.value());
  // 入力値のバリデーション
  if (isNaN(newVelocity) || newVelocity < 5) {
    newVelocity = 5;
    velocityInput.value(5);
  } else if (newVelocity > 30) {
    newVelocity = 30;
    velocityInput.value(30);
  }
  if (!ball.isMoving) {
    ball.reset(newVelocity);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  const newVelocity = parseFloat(velocityInput.value());
  ball.reset(newVelocity);
  playPauseButton.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
function onPlayPause() {
  if (ball.isMoving) {
    ball.stop();
    playPauseButton.html("再開");
  } else {
    if (ball.y >= ball.platformHeight && ball.time > 0) {
      ball.reset(parseFloat(velocityInput.value()));
    }
    ball.start();
    playPauseButton.html("一時停止");
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
