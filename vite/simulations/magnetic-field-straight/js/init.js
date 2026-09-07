import { state } from "./state.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/** 電流の強さの初期値（A） */
const INITIAL_CURRENT = 1;

export function settingInit(p) {}

export function elementSelectInit(p) {}

function updateControlLabels() {
  const currentSlider = document.getElementById("currentSlider");
  const currentLabel = document.getElementById("currentLabel");
  if (currentSlider && currentLabel) {
    currentLabel.textContent = `電流の強さ: ${parseFloat(currentSlider.value).toFixed(1)} A`;
  }
}

export function elementPositionInit(p) {
  const currentSlider = document.getElementById("currentSlider");
  if (currentSlider) {
    currentSlider.oninput = updateControlLabels;
  }

  updateControlLabels();
}

export function valueInit(p) {
  const playPauseButton = document.getElementById("playPauseButton");
  const currentSlider = document.getElementById("currentSlider");

  bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: () => {
      state.isRunning = !state.isRunning;
      playPauseButton.textContent = state.isRunning ? "⏸ 一時停止" : "▶ 再開";
    },
    onReset: () => {
      state.isRunning = false;
      state.t = 0;
      if (currentSlider) currentSlider.value = String(INITIAL_CURRENT);
      updateControlLabels();
      playPauseButton.textContent = "▶ 開始";
    },
  });

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
}
