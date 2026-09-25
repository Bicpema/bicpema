// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { initValue } from "./init.js";

/**
 * リセットボタンが押されたときの処理
 * @param {p5} p p5インスタンス
 */
export function onReset(p: p5) {
  initValue(p);
}

/**
 * 開始/一時停止ボタンが押されたときの処理
 */
export function onPlayPause() {
  if (state.phase === "stopped") return;

  // elCreate()でイベント登録済みのため呼び出し時点でnullになりえない
  if (state.phase === "idle") {
    state.phase = "approach";
    state.isRunning = true;
    state.playPauseButton!.html("⏸ 一時停止");
  } else if (state.isRunning) {
    state.isRunning = false;
    state.playPauseButton!.html("▶ 再開");
  } else {
    state.isRunning = true;
    state.playPauseButton!.html("⏸ 一時停止");
  }
}
