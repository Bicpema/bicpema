import { DT_UNIT, DV_UNIT } from "./constants.js";

/**
 * 熱量ステップ入力から、熱力学第一法則（定圧膨張: ΔU = Q + Win）にもとづく
 * 状態量（Q・W・ΔU・温度・ピストン目標位置）を計算する。
 *
 * このシミュレーションでは簡略化のため Q = W = ΔU = step としている。
 *
 * @param {number} step 入力された熱量ステップ
 * @param {number} t0 基準温度
 * @param {number} pistonInitX ピストンの初期X座標
 * @param {number} [dtUnit=DT_UNIT] ステップあたりの温度変化量
 * @param {number} [dvUnit=DV_UNIT] ステップあたりのピストン移動量
 * @returns {{Q: number, W: number, dU: number, T: number, pistonXTarget: number}}
 */
export function computeThermodynamicState(
  step,
  t0,
  pistonInitX,
  dtUnit = DT_UNIT,
  dvUnit = DV_UNIT
) {
  return {
    Q: step,
    W: step,
    dU: step,
    T: t0 + step * dtUnit,
    pistonXTarget: pistonInitX + step * dvUnit
  };
}

/**
 * 気体分子の運動速度を温度から計算する（アニメーション用の近似式）。
 * 温度が高いほど分子は速く動く。
 * @param {number} temperature 温度
 * @param {number} zFactor 分子ごとのばらつき係数
 * @returns {number} 分子の移動速度
 */
export function computeMoleculeSpeed(temperature, zFactor) {
  return Math.sqrt(temperature * temperature * temperature) * (0.6 + zFactor);
}
