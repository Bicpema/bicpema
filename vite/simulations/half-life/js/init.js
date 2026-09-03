import { initCollapse } from "../../../js/bicpema-modal-controller.js";
import { state } from "./state.js";
import { initAtoms } from "./logic.js";

/**
 * p5のフレームレートなど基本設定を行う。
 * @param {*} p p5インスタンス。
 */
export function settingInit(p) {
  p.frameRate(30);
}

/**
 * HTML要素の参照を取得し、state に保持する。
 * @param {*} p p5インスタンス。
 */
export function elementSelectInit(p) {
  state.toggleBtn = document.getElementById("toggleBtn");
  state.resetBtn = document.getElementById("resetBtn");
  state.atomPlusBtn = document.getElementById("atomPlusBtn");
  state.atomMinusBtn = document.getElementById("atomMinusBtn");
  state.materialRadios = document.querySelectorAll('input[name="material"]');
  initCollapse({
    toggleSelectors: "#settingsButton",
    targetSelector: "#settingsPanel",
  });
}

/**
 * HTML要素の位置と大きさをキャンバス座標に合わせて動的に調整する。
 * @param {*} p p5インスタンス。
 */
export function elementPositionInit(p) {
  const canvasEl = document.querySelector("#p5Canvas canvas");
  if (!canvasEl) return;

  const rect = canvasEl.getBoundingClientRect();
  const margin = 12;

  // 左下: スタート/ストップ + リセット ボタン
  const toggleWrapper = document.getElementById("toggleBtnWrapper");
  if (toggleWrapper) {
    toggleWrapper.style.position = "fixed";
    toggleWrapper.style.left = `${rect.left + margin}px`;
    toggleWrapper.style.bottom = `${window.innerHeight - rect.bottom + margin}px`;
    toggleWrapper.style.top = "auto";
    toggleWrapper.style.right = "auto";
    toggleWrapper.style.zIndex = "100";
  }

  // 右上: 設定ボタン
  const settingsBtnWrapper = document.getElementById("settingsBtnWrapper");
  if (settingsBtnWrapper) {
    settingsBtnWrapper.style.position = "fixed";
    settingsBtnWrapper.style.right = `${window.innerWidth - rect.right + margin}px`;
    settingsBtnWrapper.style.top = `${rect.top + margin}px`;
    settingsBtnWrapper.style.left = "auto";
    settingsBtnWrapper.style.bottom = "auto";
    settingsBtnWrapper.style.zIndex = "100";
  }

  // 設定パネル: 設定ボタンの下
  const settingsPanel = document.getElementById("settingsPanel");
  if (settingsPanel) {
    const panelWidth = Math.min(280, rect.width * 0.35);
    settingsPanel.style.position = "fixed";
    settingsPanel.style.right = `${window.innerWidth - rect.right + margin}px`;
    settingsPanel.style.top = `${rect.top + 50 + margin}px`;
    settingsPanel.style.left = "auto";
    settingsPanel.style.bottom = "auto";
    settingsPanel.style.width = `${panelWidth}px`;
    settingsPanel.style.zIndex = "99";
  }
}

/**
 * 初期値設定とイベントリスナーの登録を行う。
 * @param {*} p p5インスタンス。
 */
export function valueInit(p) {
  initAtoms();

  if (state.toggleBtn) {
    state.toggleBtn.addEventListener("click", () => {
      state.isRunning = !state.isRunning;
      state.toggleBtn.textContent = state.isRunning ? "ストップ" : "スタート";
    });
  }

  if (state.resetBtn) {
    state.resetBtn.addEventListener("click", () => {
      state.isRunning = false;
      state.currentTime = 0;
      initAtoms();
      if (state.toggleBtn) {
        state.toggleBtn.textContent = "スタート";
      }
    });
  }

  if (state.atomPlusBtn) {
    state.atomPlusBtn.addEventListener("click", () => {
      state.n = p.constrain(state.n + 1, 4, 30);
      state.N0 = state.n * state.n;
      state.currentTime = 0;
      initAtoms();
    });
  }

  if (state.atomMinusBtn) {
    state.atomMinusBtn.addEventListener("click", () => {
      state.n = p.constrain(state.n - 1, 4, 30);
      state.N0 = state.n * state.n;
      state.currentTime = 0;
      initAtoms();
    });
  }

  if (state.materialRadios) {
    state.materialRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        state.halfLife = parseFloat(radio.value);
        state.maxYears = state.halfLife * 5;
        state.T = state.halfLife / 150;
        state.currentTime = 0;
        initAtoms();
      });
    });
  }
}
