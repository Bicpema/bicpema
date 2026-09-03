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
        moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
        moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
      } else {
        moveBtn.textContent = "ストップ";
        moveBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
        moveBtn.classList.add("bg-red-600", "hover:bg-red-500");
      }
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      state.t = 0;
      state.running = false;
      if (moveBtn) {
        moveBtn.textContent = "スタート";
        moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
        moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
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
