import { state } from "./state.js";
import { MARGIN, WAVELENGTH, PERIOD_FRAMES } from "./constants.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export function settingInit(p) {
  state.wavelength = WAVELENGTH;
  state.k = p.TWO_PI / state.wavelength;
  state.omega = p.TWO_PI / PERIOD_FRAMES;
  state.v = state.omega / state.k;
  state.A = state.wavelength / 5;
}

export function elementSelectInit(p) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    onToggle: () => toggleMove(toggleButton?.elt),
    onReset: () => resetSim(toggleButton?.elt),
  });
}

export function elementPositionInit(p) {
  state.margin = MARGIN;
  state.innerW = p.width - state.margin * 2;
  state.innerH = p.height - state.margin * 2;
}

export function valueInit(p) {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
}

function toggleMove(moveBtn) {
  state.running = !state.running;
  if (!moveBtn) return;
  if (!state.running) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
    moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
  } else {
    moveBtn.textContent = "ストップ";
    moveBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
    moveBtn.classList.add("bg-red-600", "hover:bg-red-500");
  }
}

function resetSim(moveBtn) {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
  if (!moveBtn) return;
  moveBtn.textContent = "スタート";
  moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
  moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
}
