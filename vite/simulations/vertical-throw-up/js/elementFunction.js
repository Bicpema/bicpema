// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下に仮想DOMメソッドを定義してください。

/**
 * 初速度入力の値が変更されたときの処理
 */
function onVelocityChange() {
  let newVelocity = parseFloat(velocityInput.value());
  // 入力値のバリデーション
  if (isNaN(newVelocity) || newVelocity < 5) {
    newVelocity = 5;
    velocityInput.value(5);
  } else if (newVelocity > 50) {
    newVelocity = 50;
    velocityInput.value(50);
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
    if (ball.height <= 0 && ball.time > 0) {
      ball.reset(parseFloat(velocityInput.value()));
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
