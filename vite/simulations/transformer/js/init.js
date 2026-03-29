import { state } from "./state.js";

export const FPS = 60;

/**
 * UI要素のイベントリスナーを設定する関数。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  const coil1PlusBtn = document.getElementById("coil1PlusBtn");
  if (coil1PlusBtn) {
    coil1PlusBtn.addEventListener("click", () => {
      state.count1 = p.constrain(state.count1 + 5, state.minCount, state.maxCount);
    });
  }

  const coil1MinusBtn = document.getElementById("coil1MinusBtn");
  if (coil1MinusBtn) {
    coil1MinusBtn.addEventListener("click", () => {
      state.count1 = p.constrain(state.count1 - 5, state.minCount, state.maxCount);
    });
  }

  const coil2PlusBtn = document.getElementById("coil2PlusBtn");
  if (coil2PlusBtn) {
    coil2PlusBtn.addEventListener("click", () => {
      state.count2 = p.constrain(state.count2 + 5, state.minCount, state.maxCount);
    });
  }

  const coil2MinusBtn = document.getElementById("coil2MinusBtn");
  if (coil2MinusBtn) {
    coil2MinusBtn.addEventListener("click", () => {
      state.count2 = p.constrain(state.count2 - 5, state.minCount, state.maxCount);
    });
  }
}

/**
 * シミュレーションの初期値を設定する関数。
 */
export function initValue() {
  state.count1 = 19;
  state.count2 = 4;
  state.omega = 1;
  state.t = 0;
  state.phase = true;
}
