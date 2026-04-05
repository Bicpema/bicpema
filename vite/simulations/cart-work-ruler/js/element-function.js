// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * リセットボタンが押されたときの処理
 * @param {*} p p5インスタンス
 */
export function onReset(p) {
  initValue(p);
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.phase === "stopped") return;

  if (state.phase === "idle") {
    state.phase = "approach";
    state.isRunning = true;
    state.playPauseButton.html("⏸ 一時停止");
  } else if (state.isRunning) {
    state.isRunning = false;
    state.playPauseButton.html("▶ 再開");
  } else {
    state.isRunning = true;
    state.playPauseButton.html("⏸ 一時停止");
  }
}

/**
 * 設定モーダルの表示/非表示を切り替える
 */
export function onToggleModal() {
  const currentDisplay = state.settingsModal.style("display");
  if (currentDisplay === "none") {
    state.settingsModal.style("display", "block");
  } else {
    state.settingsModal.style("display", "none");
  }
}

/**
 * 設定モーダルを閉じる
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
