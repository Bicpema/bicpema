/**
 * 熱平衡に至る過程での温度を、ニュートンの冷却法則的な指数緩和で計算する。
 * T(t) = Teq + (T0 - Teq) * exp(-k * t)
 * @param {number} teq 熱平衡温度
 * @param {number} t0 初期温度
 * @param {number} k 緩和係数
 * @param {number} t 経過時間
 * @returns {number} 時刻tでの温度
 */
export function computeTemperatureAtTime(teq, t0, k, t) {
  return teq + (t0 - teq) * Math.exp(-k * t);
}
