import { state } from "./state.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export function settingInit(p) {
  const wavelength = 200;
  state.A = wavelength / 4;
  state.k = p.TWO_PI / wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
}

export function elementSelectInit(p) {
  const moveBtn = document.getElementById("moveBtn");

  bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    onToggle: () => toggleMove(moveBtn),
    onReset: () => resetSim(moveBtn),
  });
}

export function elementPositionInit(p) {
  state.reflectX = p.width / 2;

  const modeBtn = document.getElementById("modeBtn");
  if (modeBtn) {
    modeBtn.onclick = () => toggleMode(modeBtn);
  }
}

export function valueInit(p) {
  state.t = 0;
  state.front = 0;
  state.running = false;
}

function toggleMove(moveBtn) {
  state.running = !state.running;
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

function toggleMode(modeBtn) {
  state.mode = state.mode === "free" ? "fixed" : "free";
  if (state.mode === "free") {
    modeBtn.textContent = "自由端";
    modeBtn.classList.remove(
      "bg-green-600",
      "hover:bg-green-500",
      "text-white"
    );
    modeBtn.classList.add(
      "bg-amber-500",
      "hover:bg-amber-400",
      "text-neutral-900"
    );
  } else {
    modeBtn.textContent = "固定端";
    modeBtn.classList.remove(
      "bg-amber-500",
      "hover:bg-amber-400",
      "text-neutral-900"
    );
    modeBtn.classList.add("bg-green-600", "hover:bg-green-500", "text-white");
  }
}

function resetSim(moveBtn) {
  state.t = 0;
  state.front = 0;
  state.running = false;
  moveBtn.textContent = "スタート";
  moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
  moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
}
