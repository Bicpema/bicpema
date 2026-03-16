// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  valueInit();
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
function onPlayPause() {
  if (phase === "stopped") return;

  if (phase === "idle") {
    phase = "approach";
    isRunning = true;
    playPauseButton.html("⏸ 一時停止");
  } else if (isRunning) {
    isRunning = false;
    playPauseButton.html("▶ 再開");
  } else {
    isRunning = true;
    playPauseButton.html("⏸ 一時停止");
  }
}

/**
 * 設定モーダルの表示/非表示を切り替える
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
 * 設定モーダルを閉じる
 */
function onCloseModal() {
  settingsModal.style("display", "none");
}
