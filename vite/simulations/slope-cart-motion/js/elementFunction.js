// elementFunction.js - 仮想DOMメソッド管理専用のファイルです。

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  cart.reset();
  tapeMarks = [];
  vtData = [];
  isPlaying = false;
  playPauseButton.html("▶ 開始");
  updateGraph();
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
function onPlayPause() {
  if (cart.isAtBottom) {
    // 下端に到達済みの場合はリセットして再開
    onReset();
    isPlaying = true;
    playPauseButton.html("⏸ 停止");
    return;
  }
  isPlaying = !isPlaying;
  playPauseButton.html(isPlaying ? "⏸ 停止" : "▶ 再開");
}

/**
 * 設定モーダルを表示/非表示にする
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
  applySettings();
}

/**
 * 設定を適用してシミュレーションをリセットする
 */
function applySettings() {
  const newAngle = parseInt(angleInput.value());
  const newInterval = parseFloat(intervalInput.value());

  if (newAngle >= 10 && newAngle <= 40) {
    slopeDeg = newAngle;
    cart.setAngle(newAngle);
  }
  recInterval = newInterval;
  onReset();
}

/**
 * v-tグラフの表示/非表示を切り替える
 */
function onToggleGraph() {
  graphVisible = !graphVisible;
  const graphDiv = select("#graph");
  const toggleBtn = select("#graphToggleButton");
  if (graphVisible) {
    graphDiv.style("display", "block");
    toggleBtn.html("v-tグラフを非表示");
    updateGraph();
  } else {
    graphDiv.style("display", "none");
    toggleBtn.html("v-tグラフを表示");
  }
}
