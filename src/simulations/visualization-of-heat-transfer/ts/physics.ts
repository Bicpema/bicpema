/**
 * 熱平衡に至る過程での温度を、ニュートンの冷却法則的な指数緩和で計算する。
 * T(t) = Teq + (T0 - Teq) * exp(-k * t)
 * @param teq - 熱平衡温度
 * @param t0 - 初期温度
 * @param k - 緩和係数
 * @param t - 経過時間
 * @returns 時刻tでの温度
 */
export function computeTemperatureAtTime(
  teq: number,
  t0: number,
  k: number,
  t: number
) {
  return teq + (t0 - teq) * Math.exp(-k * t);
}
