import { state } from "./state.js";

export function settingInit(p) {
  const wavelength = 200;
  state.A = wavelength / 4;
  state.k = p.TWO_PI / wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
}

export function elementSelectInit(p) {
  // All UI elements are HTML Bootstrap elements; no p5 DOM selection needed.
}

export function elementPositionInit(p) {
  state.reflectX = p.width / 2;

  const moveBtn = document.getElementById("moveBtn");
  if (moveBtn) {
    moveBtn.onclick = () => toggleMove(moveBtn);
  }

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.onclick = () => resetSim();
  }

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
    moveBtn.classList.remove("btn-danger");
    moveBtn.classList.add("btn-primary");
  } else {
    moveBtn.textContent = "ストップ";
    moveBtn.classList.remove("btn-primary");
    moveBtn.classList.add("btn-danger");
  }
}

function toggleMode(modeBtn) {
  state.mode = state.mode === "free" ? "fixed" : "free";
  if (state.mode === "free") {
    modeBtn.textContent = "自由端";
    modeBtn.classList.remove("btn-success");
    modeBtn.classList.add("btn-warning");
  } else {
    modeBtn.textContent = "固定端";
    modeBtn.classList.remove("btn-warning");
    modeBtn.classList.add("btn-success");
  }
}

function resetSim() {
  state.t = 0;
  state.front = 0;
  state.running = false;
  const moveBtn = document.getElementById("moveBtn");
  if (moveBtn) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("btn-danger");
    moveBtn.classList.add("btn-primary");
  }
}
