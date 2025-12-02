// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

// メソッドの定義方法の例
// function exampleMethod() {
//   console.log("これは例です。");
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下に仮想DOMメソッドを定義してください。

/**
 * 高さスライダーの値が変更されたときの処理
 */
function onHeightChange() {
  const newHeight = parseFloat(heightSlider.value());
  heightValue.html(newHeight);
  if (!ball.isMoving) {
    ball.reset(newHeight);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  const newHeight = parseFloat(heightSlider.value());
  ball.reset(newHeight);
  playPauseButton.html("開始");
}

/**
 * 開始/停止ボタンが押されたときの処理
 */
function onPlayPause() {
  if (ball.isMoving) {
    ball.stop();
    playPauseButton.html("再開");
  } else {
    if (ball.height <= 0) {
      ball.reset(parseFloat(heightSlider.value()));
    }
    ball.start();
    playPauseButton.html("停止");
  }
}
