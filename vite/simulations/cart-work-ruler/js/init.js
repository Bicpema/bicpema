// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { CART_START_X } from "./logic.js";
import {
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

/**
 * UI要素の生成とイベントリスナーの設定を担当する関数。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.massInput = p.select("#massInput");
  state.velocityInput = p.select("#velocityInput");
  state.forceInput = p.select("#forceInput");
  state.resetButton = p
    .select("#resetButton")
    .mousePressed(() => onReset(p));
  state.playPauseButton = p
    .select("#playPauseButton")
    .mousePressed(onPlayPause);
  state.toggleModal = p.select("#toggleModal").mousePressed(onToggleModal);
  state.closeModal = p.select("#closeModal").mousePressed(onCloseModal);
  state.settingsModal = p.select("#settingsModal");
}

/**
 * パラメータと状態を初期化する
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(60);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont(state.font);
  p.textSize(16);

  state.mass_kg = parseFloat(state.massInput.value());
  state.v0_ms = parseFloat(state.velocityInput.value());
  state.force_N = parseFloat(state.forceInput.value());

  state.approachX_px = CART_START_X;
  state.velocity_ms = state.v0_ms;
  state.penetration_m = 0;
  state.phase = "idle";
  state.isRunning = false;

  state.playPauseButton.html("▶ 開始");
  state.playPauseButton.removeAttribute("disabled");
}
