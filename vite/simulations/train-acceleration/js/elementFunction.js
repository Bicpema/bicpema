// elementFunction.js は仮想DOMメソッド管理専用のファイルです。

/**
 * 再生・停止ボタンのラベルを更新する。
 */
const updatePlayPauseButton = () => {
  const btn = select("#playPauseButton");
  if (isPlaying) {
    btn.html("⏸ 一時停止");
    btn.removeClass("btn-primary");
    btn.addClass("btn-warning");
  } else {
    btn.html("▶ 開始");
    btn.removeClass("btn-warning");
    btn.addClass("btn-primary");
  }
};

/**
 * 再生・停止ボタンが押されたときの処理。
 */
const onPlayPause = () => {
  isPlaying = !isPlaying;
  updatePlayPauseButton();
};

/**
 * リセットボタンが押されたときの処理。
 */
const onReset = () => {
  isPlaying = false;
  updatePlayPauseButton();
  elapsedTime = 0;
  lastGraphUpdate = 0;
  maxObservedVelocity = 0;
  train.reset();
  vtData = [{ x: 0, y: 0 }];
  updateChart();
};

/**
 * 設定モーダルを開閉する。
 */
const onToggleModal = () => {
  const modal = select("#settingsModal");
  if (modal.style("display") === "none") {
    modal.style("display", "block");
  } else {
    modal.style("display", "none");
  }
};

/**
 * 設定モーダルを閉じる。
 */
const onCloseModal = () => {
  select("#settingsModal").style("display", "none");
};

/**
 * 加速度入力が変更されたときの処理。
 */
const onAccelerationChange = () => {
  const val = parseFloat(select("#accelerationInput").value());
  if (!isNaN(val)) {
    acceleration = val;
  }
};
