// elementFunction.js は仮想DOMメソッド管理専用のファイルです。

/**
 * 船の速度スライダーの値に応じてラベルを更新する。
 * @param {number} val 船の速度（左向き正）
 */
function updateBoatSpeedLabel(val) {
  if (!boatSpeedValue) return;
  let labelText;
  if (Math.abs(val) < 0.05) {
    labelText = "0.0 m/s（停止）";
  } else if (val > 0) {
    labelText = `${val.toFixed(1)} m/s ← 下流`;
  } else {
    labelText = `${Math.abs(val).toFixed(1)} m/s → 上流`;
  }
  boatSpeedValue.html(labelText);
}

/**
 * 船の速度スライダーが変更されたときの処理。
 */
function onBoatSpeedChange() {
  if (!boatSpeedInput || !boat) return;
  const val = parseFloat(boatSpeedInput.value());
  updateBoatSpeedLabel(val);
  boat.boatSpeed = val;
}

/**
 * 川の速度スライダーが変更されたときの処理。
 */
function onRiverSpeedChange() {
  if (!riverSpeedInput || !boat) return;
  const val = parseFloat(riverSpeedInput.value());
  if (riverSpeedValue) riverSpeedValue.html(val.toFixed(1));
  boat.riverSpeed = val;
}

/**
 * リセットボタンが押されたときの処理。
 */
function onReset() {
  if (!boatSpeedInput || !riverSpeedInput || !boat) return;
  const boatSpeed = parseFloat(boatSpeedInput.value());
  const riverSpeed = parseFloat(riverSpeedInput.value());
  boat.reset(boatSpeed, riverSpeed);
  if (playPauseButton) playPauseButton.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理。
 */
function onPlayPause() {
  if (!boat || !playPauseButton) return;
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
  if (!settingsModal) return;
  const display = settingsModal.style("display");
  settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定パネルを閉じる処理。
 */
function onCloseModal() {
  if (!settingsModal) return;
  settingsModal.style("display", "none");
}
