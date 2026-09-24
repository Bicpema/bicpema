import type p5 from "p5";
import { state } from "./state.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/** 電流の強さの初期値（A） */
const INITIAL_CURRENT = 1;

export function settingInit(p: p5) {}

export function elementSelectInit(p: p5) {}

function updateControlLabels() {
  const currentSlider = document.getElementById(
    "currentSlider"
  ) as HTMLInputElement | null;
  const currentLabel = document.getElementById("currentLabel");
  if (currentSlider && currentLabel) {
    currentLabel.textContent = `電流の強さ: ${parseFloat(currentSlider.value).toFixed(1)} A`;
  }
}

export function elementPositionInit(p: p5) {
  const currentSlider = document.getElementById("currentSlider");
  if (currentSlider) {
    // oxlint-disable-next-line unicorn/prefer-add-event-listener -- 呼び出しのたびに再実行されるため、代入で単一ハンドラのみを保つ
    currentSlider.oninput = updateControlLabels;
  }

  updateControlLabels();
}

export function valueInit(p: p5) {
  const playPauseButton = document.getElementById("playPauseButton");
  if (!playPauseButton) return;

  const currentSlider = document.getElementById(
    "currentSlider"
  ) as HTMLInputElement | null;

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
    }
  });

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal"
  });
}
