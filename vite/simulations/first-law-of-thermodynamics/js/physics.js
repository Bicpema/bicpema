/**
 * 熱量ステップ入力から、熱力学第一法則（定圧膨張: ΔU = Q + Win）にもとづく
 * 状態量（Q・W・ΔU・温度・ピストン目標位置）を計算する。
 *
 * このシミュレーションでは簡略化のため Q = W = ΔU = step としている。
 *
 * @param {number} step 入力された熱量ステップ
 * @param {number} t0 基準温度
 * @param {number} pistonInitX ピストンの初期X座標
 * @param {number} [dtUnit=0.3] ステップあたりの温度変化量
 * @param {number} [dvUnit=37] ステップあたりのピストン移動量
 * @returns {{Q: number, W: number, dU: number, T: number, pistonXTarget: number}}
 */
export function computeThermodynamicState(
  step,
  t0,
  pistonInitX,
  dtUnit = 0.3,
  dvUnit = 37
) {
  return {
    Q: step,
    W: step,
    dU: step,
    T: t0 + step * dtUnit,
    pistonXTarget: pistonInitX + step * dvUnit,
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
