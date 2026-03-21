import { state } from "./state.js";

/**
 * 船の速度スライダーの値に応じてラベルを更新する。
 * @param {number} val 船の速度（左向き正）
 */
export function updateBoatSpeedLabel(val) {
  if (!state.boatSpeedValue) return;
  let labelText;
  if (Math.abs(val) < 0.05) {
    labelText = "0.0 m/s（停止）";
  } else if (val > 0) {
    labelText = `${val.toFixed(1)} m/s ← 下流`;
  } else {
    labelText = `${Math.abs(val).toFixed(1)} m/s → 上流`;
  }
  state.boatSpeedValue.html(labelText);
}

/**
 * 船の速度スライダーが変更されたときの処理。
 */
export function onBoatSpeedChange() {
  if (!state.boatSpeedInput || !state.boat) return;
  const val = parseFloat(state.boatSpeedInput.value());
  updateBoatSpeedLabel(val);
  state.boat.boatSpeed = val;
}

/**
 * 川の速度スライダーが変更されたときの処理。
 */
export function onRiverSpeedChange() {
  if (!state.riverSpeedInput || !state.boat) return;
  const val = parseFloat(state.riverSpeedInput.value());
  if (state.riverSpeedValue) state.riverSpeedValue.html(val.toFixed(1));
  state.boat.riverSpeed = val;
}

/**
 * リセットボタンが押されたときの処理。
 */
export function onReset() {
  if (!state.boatSpeedInput || !state.riverSpeedInput || !state.boat) return;
  const boatSpeed = parseFloat(state.boatSpeedInput.value());
  const riverSpeed = parseFloat(state.riverSpeedInput.value());
  state.boat.reset(boatSpeed, riverSpeed);
  if (state.playPauseButton) state.playPauseButton.html("開始");
}

/**
 * 開始/一時停止ボタンが押されたときの処理。
 */
export function onPlayPause() {
  if (!state.boat || !state.playPauseButton) return;
  if (state.boat.isMoving) {
    state.boat.isMoving = false;
    state.playPauseButton.html("再開");
  } else {
    state.boat.isMoving = true;
    state.playPauseButton.html("一時停止");
  }
}

/**
 * 設定パネルの表示/非表示を切り替える処理。
 */
export function onToggleModal() {
  if (!state.settingsModal) return;
  const display = state.settingsModal.style("display");
  state.settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定パネルを閉じる処理。
 */
export function onCloseModal() {
  if (!state.settingsModal) return;
  state.settingsModal.style("display", "none");
}
