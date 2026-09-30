import { state } from "./state.js";
import { WAVE_ORIGIN_X } from "./constants.js";
import { bindToggleControls } from "../../../lib/simulation/bicpema-controls-controller.js";

/**
 * 波長から波数を設定する。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5) {
  state.k = p.TWO_PI / state.lambda;
}

/**
 * スタート／ストップボタンとリセットボタンにイベントを登録する。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    /** 波の再生・停止を切り替え、ボタンの表示と色を更新する。 */
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
    /** 時刻を0に戻して停止し、ボタンをスタート表示に戻す。 */
    onReset: () => {
      const moveBtn = toggleButton?.elt;
      state.t = 0;
      state.running = false;
      if (!moveBtn) return;
      moveBtn.textContent = "スタート";
      moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
      moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
    }
  });
}

/**
 * DOM要素の位置を初期化する（再配置が必要な要素はないため処理は行わない）。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  // リサイズに追従して再配置が必要な要素はない（ボタン等の初期化はelementSelectInitで実施済み）
}

/**
 * 媒質の粒子の初期位置と、注目する粒子のインデックスを初期化する。
 * @param p - p5インスタンス
 */
export function valueInit(p: p5) {
  state.xStart = WAVE_ORIGIN_X;
  state.particles = [];
  for (let i = 0; i < state.N; i++) {
    const x0 = p.map(i, 0, state.N - 1, state.xStart, p.width - WAVE_ORIGIN_X);
    state.particles.push({ x0 });
  }
  state.focusIndex = p.floor(state.N / 2);
}
