// elementFunction.js は仮想DOMメソッド管理専用のファイルです。

/**
 * 船の速度スライダーが変更されたときの処理。
 */
function onBoatSpeedChange() {
  const val = parseFloat(boatSpeedInput.value());
  boatSpeedValue.html(val.toFixed(1));
  boat.boatSpeed = val;
}

/**
 * 川の速度スライダーが変更されたときの処理。
 */
function onRiverSpeedChange() {
  const val = parseFloat(riverSpeedInput.value());
  riverSpeedValue.html(val.toFixed(1));
  boat.riverSpeed = val;
}

/**
 * リセットボタンが押されたときの処理。
 */
function onReset() {
  const boatSpeed = parseFloat(boatSpeedInput.value());
  const riverSpeed = parseFloat(riverSpeedInput.value());
  boat.reset(boatSpeed, riverSpeed);
  playPauseButton.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理。
 */
function onPlayPause() {
  if (boat.isMoving) {
    boat.isMoving = false;
    playPauseButton.html("再開");
  } else {
    boat.isMoving = true;
    playPauseButton.html("一時停止");
  }
}

/**
 * 設定パネルの表示/非表示を切り替える処理。
 */
function onToggleModal() {
  const display = settingsModal.style("display");
  settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定パネルを閉じる処理。
 */
function onCloseModal() {
  settingsModal.style("display", "none");
}
