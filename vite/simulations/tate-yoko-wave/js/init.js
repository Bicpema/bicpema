import { state } from "./state.js";
import { WAVE_ORIGIN_X } from "./constants.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export function settingInit(p) {
  state.k = p.TWO_PI / state.lambda;
}

export function elementSelectInit(p) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    onToggle: () => {
      const moveBtn = toggleButton?.elt;
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
    },
    onReset: () => {
      const moveBtn = toggleButton?.elt;
      state.t = 0;
      state.running = false;
      if (!moveBtn) return;
      moveBtn.textContent = "スタート";
      moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
      moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
    },
  });
}

export function elementPositionInit(p) {
  // リサイズに追従して再配置が必要な要素はない（ボタン等の初期化はelementSelectInitで実施済み）
}

export function valueInit(p) {
  state.xStart = WAVE_ORIGIN_X;
  state.particles = [];
  for (let i = 0; i < state.N; i++) {
    let x0 = p.map(i, 0, state.N - 1, state.xStart, p.width - WAVE_ORIGIN_X);
    state.particles.push({ x0 });
  }
  state.focusIndex = p.floor(state.N / 2);
}
