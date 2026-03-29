import { state } from "./state.js";

/** フレームレート */
export const FPS = 60;

/**
 * UI要素のイベントリスナーを設定する関数。
 * 設定パネルの各ボタンにクリックイベントを登録する。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  // 一次コイル：巻数を増やす（+5、上限あり）
  const coil1PlusBtn = document.getElementById("coil1PlusBtn");
  if (coil1PlusBtn) {
    coil1PlusBtn.addEventListener("click", () => {
      state.count1 = p.constrain(
        state.count1 + 5,
        state.minCount,
        state.maxCount
      );
    });
  }

  // 一次コイル：巻数を減らす（-5、下限あり）
  const coil1MinusBtn = document.getElementById("coil1MinusBtn");
  if (coil1MinusBtn) {
    coil1MinusBtn.addEventListener("click", () => {
      state.count1 = p.constrain(
        state.count1 - 5,
        state.minCount,
        state.maxCount
      );
    });
  }

  // 二次コイル：巻数を増やす（+5、上限あり）
  const coil2PlusBtn = document.getElementById("coil2PlusBtn");
  if (coil2PlusBtn) {
    coil2PlusBtn.addEventListener("click", () => {
      state.count2 = p.constrain(
        state.count2 + 5,
        state.minCount,
        state.maxCount
      );
    });
  }

  // 二次コイル：巻数を減らす（-5、下限あり）
  const coil2MinusBtn = document.getElementById("coil2MinusBtn");
  if (coil2MinusBtn) {
    coil2MinusBtn.addEventListener("click", () => {
      state.count2 = p.constrain(
        state.count2 - 5,
        state.minCount,
        state.maxCount
      );
    });
  }
}

/**
 * シミュレーションの初期値を設定する関数。
 * p.setup() 内から呼び出す。
 */
export function initValue() {
  state.count1 = 19; // 一次コイル初期巻数インデックス（表示：20巻）
  state.count2 = 4; // 二次コイル初期巻数インデックス（表示：5巻）
  state.omega = 1; // 初期速度：ゆっくり
  state.t = 0; // タイムカウントリセット
  state.phase = true; // 初期位相：同位相
}
