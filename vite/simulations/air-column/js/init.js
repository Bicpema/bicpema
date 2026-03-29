import { state } from "./state.js";
import { updateWaveLayer } from "./logic.js";

export function elementPositionInit(p) {
  if (state.waveLayer) state.waveLayer.remove();
  state.waveLayer = p.createGraphics(p.width, p.height);
  updateWaveLayer(p);
}

function updateDisplays() {
  document.getElementById("mnDisplay").textContent = state.m_n;
  document.getElementById("lDisplay").textContent = state.pipeL;
}

export function setupControls(p) {
  const typeSelect = document.getElementById("typeSelect");
  const mnPlusBtn = document.getElementById("mnPlusBtn");
  const mnMinusBtn = document.getElementById("mnMinusBtn");
  const lplusBtn = document.getElementById("lplusBtn");
  const lminusBtn = document.getElementById("lminusBtn");

  typeSelect.addEventListener("change", () => {
    state.type = typeSelect.value;
    if (state.type === "closed" && state.m_n % 2 === 0) {
      state.m_n = Math.max(1, state.m_n - 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  mnPlusBtn.addEventListener("click", () => {
    if (state.type === "closed") {
      state.m_n = Math.min(9, state.m_n + 2);
    } else {
      state.m_n = Math.min(9, state.m_n + 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  mnMinusBtn.addEventListener("click", () => {
    if (state.type === "closed") {
      state.m_n = Math.max(1, state.m_n - 2);
    } else {
      state.m_n = Math.max(1, state.m_n - 1);
    }
    updateDisplays();
    updateWaveLayer(p);
  });

  lplusBtn.addEventListener("click", () => {
    state.pipeL = Math.min(600, state.pipeL + 50);
    updateDisplays();
    updateWaveLayer(p);
  });

  lminusBtn.addEventListener("click", () => {
    state.pipeL = Math.max(200, state.pipeL - 50);
    updateDisplays();
    updateWaveLayer(p);
  });
}
