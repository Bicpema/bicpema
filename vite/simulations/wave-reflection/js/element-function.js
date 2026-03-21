import { state } from "./state.js";
import { IncidenceWave } from "./incidence-wave.js";
import { initValue } from "./init.js";

/**
 * スタートボタンと紐づく関数。
 * 入射波の生成とシミュレーションの開始を担当する。
 * @param {*} p p5インスタンス。
 */
export function startButtonFunction(p) {
  state.waveArr.push(
    new IncidenceWave(
      60 * state.amplitudeInput.value(),
      state.waveSelect.value(),
      p
    )
  );
  state.moveIs = true;
}

/**
 * ストップボタンと紐づく関数。
 * シミュレーションの停止を担当する。
 */
export function stopButtonFunction() {
  state.moveIs = false;
}

/**
 * リスタートボタンと紐づく関数。
 */
export function restartButtonFunction() {
  state.moveIs = true;
}

/**
 * リセットボタンと紐づく関数。
 * シミュレーションの初期化を担当する。
 * @param {*} p p5インスタンス。
 */
export function resetButtonFunction(p) {
  initValue(p);
}
