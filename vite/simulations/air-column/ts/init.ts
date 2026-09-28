import { state } from "./state.js";
import { updateWaveLayer } from "./logic.js";
import { initModal } from "../../../ts/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";

/** 振動次数 m/n の最小値 */
const MN_MIN = 1;
/** 振動次数 m/n の最大値 */
const MN_MAX = 9;
/** 管の長さの最小値 */
const PIPE_LENGTH_MIN = 200;
/** 管の長さの最大値 */
const PIPE_LENGTH_MAX = 600;
/** 管の長さの増減ステップ */
const PIPE_LENGTH_STEP = 50;

/** 管の種類の初期値 */
const INITIAL_TYPE = "closed";
/** 振動次数 m/n の初期値 */
const INITIAL_M_N = 1;
/** 管の長さの初期値 */
const INITIAL_PIPE_L = 400;

/**
 * 波の描画用のグラフィックスレイヤーを作り直し、定常波を再描画する。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  if (state.waveLayer) state.waveLayer.remove();
  state.waveLayer = p.createGraphics(p.width, p.height);
  updateWaveLayer(p);
}

/**
 * 振動次数と管の長さの表示を現在の値に更新する。
 */
function updateDisplays() {
  const mnDisplay = document.getElementById("mnDisplay");
  const lDisplay = document.getElementById("lDisplay");
  if (mnDisplay) mnDisplay.textContent = String(state.m_n);
  if (lDisplay) lDisplay.textContent = String(state.pipeL);
}

/**
 * 管の種類・振動次数・管の長さの操作ボタン、再生・リセットボタン、設定モーダルにイベントを登録する。
 * @param p - p5インスタンス
 */
export function setupControls(p: p5) {
  const typeSelect = document.getElementById(
    "typeSelect"
  ) as HTMLSelectElement | null;
  const mnPlusBtn = document.getElementById("mnPlusBtn");
  const mnMinusBtn = document.getElementById("mnMinusBtn");
  const lplusBtn = document.getElementById("lplusBtn");
  const lminusBtn = document.getElementById("lminusBtn");

  if (!typeSelect || !mnPlusBtn || !mnMinusBtn || !lplusBtn || !lminusBtn) {
    return;
  }

  typeSelect.addEventListener("change", () => {
    state.type = typeSelect.value as "closed" | "open";
    if (state.type === "closed" && state.m_n % 2 === 0) {
      state.m_n = Math.max(MN_MIN, state.m_n - 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  mnPlusBtn.addEventListener("click", () => {
    if (state.type === "closed") {
      state.m_n = Math.min(MN_MAX, state.m_n + 2);
    } else {
      state.m_n = Math.min(MN_MAX, state.m_n + 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  mnMinusBtn.addEventListener("click", () => {
    if (state.type === "closed") {
      state.m_n = Math.max(MN_MIN, state.m_n - 2);
    } else {
      state.m_n = Math.max(MN_MIN, state.m_n - 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  lplusBtn.addEventListener("click", () => {
    state.pipeL = Math.min(PIPE_LENGTH_MAX, state.pipeL + PIPE_LENGTH_STEP);
    updateDisplays();
    updateWaveLayer(p);
  });

  lminusBtn.addEventListener("click", () => {
    state.pipeL = Math.max(PIPE_LENGTH_MIN, state.pipeL - PIPE_LENGTH_STEP);
    updateDisplays();
    updateWaveLayer(p);
  });

  const playPauseButton = document.getElementById("playPauseButton");
  if (!playPauseButton) return;

  bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    /** 再生・一時停止を切り替え、ボタンの表示を更新する。 */
    onToggle: () => {
      state.isRunning = !state.isRunning;
      playPauseButton.textContent = state.isRunning ? "⏸ 一時停止" : "▶ 再開";
    },
    /** 状態と入力を初期値に戻し、表示と波形レイヤーを更新する。 */
    onReset: () => {
      state.isRunning = false;
      state.type = INITIAL_TYPE;
      state.m_n = INITIAL_M_N;
      state.pipeL = INITIAL_PIPE_L;
      state.time = 0;
      typeSelect.value = INITIAL_TYPE;
      updateDisplays();
      updateWaveLayer(p);
      playPauseButton.textContent = "▶ 開始";
    }
  });

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#settingsModal .modal-close"
  });
}
