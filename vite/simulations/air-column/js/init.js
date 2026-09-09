import { state } from "./state.js";
import { updateWaveLayer } from "./logic.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

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

export function elementPositionInit(p) {
  if (state.waveLayer) state.waveLayer.remove();
  state.waveLayer = p.createGraphics(p.width, p.height);
  updateWaveLayer(p);
}

function updateDisplays() {
  document.getElementById("mnDisplay").textContent = state.m_n;
  document.getElementById("lDisplay").textContent = state.pipeL;
}

export function setupControls(p) {
  const typeSelect = document.getElementById("typeSelect");
  const mnPlusBtn = document.getElementById("mnPlusBtn");
  const mnMinusBtn = document.getElementById("mnMinusBtn");
  const lplusBtn = document.getElementById("lplusBtn");
  const lminusBtn = document.getElementById("lminusBtn");

  typeSelect.addEventListener("change", () => {
    state.type = typeSelect.value;
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

  bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: () => {
      state.isRunning = !state.isRunning;
      playPauseButton.textContent = state.isRunning ? "⏸ 一時停止" : "▶ 再開";
    },
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
    closeSelectors: "#closeModal"
  });
}
