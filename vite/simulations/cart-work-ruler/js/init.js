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
  state.resetButton = p.select("#resetButton").mousePressed(() => onReset(p));
  state.playPauseButton = p.select("#playPauseButton").mousePressed(onPlayPause);
  state.toggleModal = p.select("#toggleModal").mousePressed(onToggleModal);
  state.closeModal = p.select("#closeModal").mousePressed(onCloseModal);
  state.settingsModal = p.select("#settingsModal");

  // 情報パネルの DOM 要素参照
  state.infoMassEl = p.select("#info-mass");
  state.infoV0El = p.select("#info-v0");
  state.infoFEl = p.select("#info-F");
  state.infoKe0El = p.select("#info-ke0");
  state.infoDEl = p.select("#info-d");
  state.infoWEl = p.select("#info-W");
  state.infoStatusEl = p.select("#info-status");
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
  state.criticalExceeded = false;

  state.playPauseButton.html("▶ 開始");
  state.playPauseButton.removeAttribute("disabled");

  // 情報パネルの初期値を更新
  if (state.infoMassEl) state.infoMassEl.html(state.mass_kg.toFixed(1) + " kg");
  if (state.infoV0El) state.infoV0El.html(state.v0_ms.toFixed(1) + " m/s");
  if (state.infoFEl) state.infoFEl.html(state.force_N.toFixed(0) + " N");
  const ke0 = 0.5 * state.mass_kg * state.v0_ms * state.v0_ms;
  if (state.infoKe0El) state.infoKe0El.html(ke0.toFixed(3) + " J");
  if (state.infoDEl) state.infoDEl.html(state.penetration_m.toFixed(3) + " m");
  if (state.infoWEl) state.infoWEl.html((state.force_N * state.penetration_m).toFixed(3) + " J");
  if (state.infoStatusEl) state.infoStatusEl.html(
    "現在の運動エネルギー = " + (0.5 * state.mass_kg * state.velocity_ms * state.velocity_ms).toFixed(3) + " J"
  );
}
