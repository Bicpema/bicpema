/**
 * 波源から発生した正弦波が、位置x0にもたらす変位を計算する。
 * 波はある有限の速さで伝わるため、まだ到達していない位置では変位0を返す。
 *
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} omega 角振動数 ω
 * @param {number} x0 対象位置
 * @param {number} xStart 波源の位置
 * @param {number} t 経過時間
 * @returns {number} 変位
 */
export function computeWaveDisplacement(amplitude, k, omega, x0, xStart, t) {
  if (t <= computeArrivalTime(k, omega, x0, xStart)) return 0;
  return -amplitude * Math.sin(k * (x0 - xStart) - omega * t);
}

/**
 * 波が位置x0に到達する時刻を計算する。
 * @param {number} k 波数
 * @param {number} omega 角振動数 ω
 * @param {number} x0 対象位置
 * @param {number} xStart 波源の位置
 * @returns {number} 到達時刻
 */
export function computeArrivalTime(k, omega, x0, xStart) {
  const v = omega / k;
  return (x0 - xStart) / v;
}
