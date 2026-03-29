import { state } from "./state.js";

export function settingInit(p) {
  state.k = p.TWO_PI / state.lambda;
}

export function elementSelectInit(p) {
  // Elements are accessed via document.getElementById in handlers
}

export function elementPositionInit(p) {
  const moveBtn = document.getElementById("moveBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (moveBtn) {
    moveBtn.onclick = () => {
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
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      state.t = 0;
      state.running = false;
      if (moveBtn) {
        moveBtn.textContent = "スタート";
        moveBtn.classList.remove("btn-danger");
        moveBtn.classList.add("btn-primary");
      }
    };
  }
}

export function valueInit(p) {
  state.xStart = 60;
  state.particles = [];
  for (let i = 0; i < state.N; i++) {
    let x0 = p.map(i, 0, state.N - 1, state.xStart, p.width - 60);
    state.particles.push({ x0 });
  }
  state.focusIndex = p.floor(state.N / 2);
}
