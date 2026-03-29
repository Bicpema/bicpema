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
  state.atomPlusBtn = document.getElementById("atomPlusBtn");
  state.atomMinusBtn = document.getElementById("atomMinusBtn");
  state.materialRadios = document.querySelectorAll('input[name="material"]');
}

/**
 * HTML要素の位置調整（CSSで管理するため実装なし）。
 * @param {*} p p5インスタンス。
 */
export function elementPositionInit(p) {
  // CSS の position-absolute で配置するため不要
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
