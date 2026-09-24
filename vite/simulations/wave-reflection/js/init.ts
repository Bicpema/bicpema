import { state } from "./state.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export function settingInit(p: p5) {
  const wavelength = 200;
  state.A = wavelength / 4;
  state.k = p.TWO_PI / wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
}

export function elementSelectInit(p: p5) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    onToggle: () => toggleMove(toggleButton?.elt),
    onReset: () => resetSim(toggleButton?.elt)
  });
}

export function elementPositionInit(p: p5) {
  state.reflectX = p.width / 2;

  const modeBtn = document.getElementById("modeBtn");
  if (modeBtn) {
    // oxlint-disable-next-line unicorn/prefer-add-event-listener -- 呼び出しのたびに再実行されるため、代入で単一ハンドラのみを保つ
    modeBtn.onclick = () => toggleMode(modeBtn);
  }
}

export function valueInit(p: p5) {
  state.t = 0;
  state.front = 0;
  state.running = false;
}

function toggleMove(moveBtn: HTMLElement | null | undefined) {
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

function toggleMode(modeBtn: HTMLElement) {
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

function resetSim(moveBtn: HTMLElement | null | undefined) {
  state.t = 0;
  state.front = 0;
  state.running = false;
  if (!moveBtn) return;
  moveBtn.textContent = "スタート";
  moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
  moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
}
