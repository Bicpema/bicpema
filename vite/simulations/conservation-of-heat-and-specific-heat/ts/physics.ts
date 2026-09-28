/**
 * 高温物体と低温物体を接触させたときの熱平衡温度を、熱量の保存から計算する。
 * C_hot * (Thot0 - Teq) = C_cold * (Teq - Tcold0)
 * @param cHot - 高温側の熱容量 (= 比熱 × 質量)
 * @param cCold - 低温側の熱容量 (= 比熱 × 質量)
 * @param thot0 - 高温側の初期温度
 * @param tcold0 - 低温側の初期温度
 * @returns 熱平衡温度
 */
export function computeEquilibriumTemperature(
  cHot: number,
  cCold: number,
  thot0: number,
  tcold0: number
) {
  return (cHot * thot0 + cCold * tcold0) / (cHot + cCold);
}

/**
 * 熱平衡に至る過程での温度を、ニュートンの冷却法則的な指数緩和で計算する。
 * T(t) = Teq + (T0 - Teq) * exp(-k_eff * t)
 * @param teq - 熱平衡温度
 * @param t0 - 初期温度
 * @param kEff - 緩和係数 (= G / C_hot)
 * @param t - 経過時間
 * @returns 時刻tでの温度
 */
export function computeTemperatureAtTime(
  teq: number,
  t0: number,
  kEff: number,
  t: number
) {
  return teq + (t0 - teq) * Math.exp(-kEff * t);
}
