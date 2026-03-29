import { state } from "./state.js";

export function settingInit(p) {
  state.wavelength = 200;
  state.k = p.TWO_PI / state.wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
  state.A = state.wavelength / 5;
}

export function elementSelectInit(p) {
  // All UI elements are HTML Bootstrap elements; no p5 DOM selection needed.
}

export function elementPositionInit(p) {
  state.margin = 50;
  state.innerW = p.width - state.margin * 2;
  state.innerH = p.height - state.margin * 2;

  const moveBtn = document.getElementById("moveBtn");
  if (moveBtn) {
    moveBtn.onclick = () => toggleMove(moveBtn);
  }

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.onclick = () => resetSim();
  }
}

export function valueInit(p) {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
}

function toggleMove(moveBtn) {
  state.running = !state.running;
  if (!state.running) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("btn-danger");
    moveBtn.classList.add("btn-primary");
  } else {
    moveBtn.textContent = "ストップ";
    moveBtn.classList.remove("btn-primary");
    moveBtn.classList.add("btn-danger");
  }
}

function resetSim() {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
  const moveBtn = document.getElementById("moveBtn");
  if (moveBtn) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("btn-danger");
    moveBtn.classList.add("btn-primary");
  }
}
