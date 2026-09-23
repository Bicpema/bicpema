/**
 * 高温物体と低温物体を接触させたときの熱平衡温度を、熱量の保存から計算する。
 * C_hot * (Thot0 - Teq) = C_cold * (Teq - Tcold0)
 * @param {number} cHot 高温側の熱容量 (= 比熱 × 質量)
 * @param {number} cCold 低温側の熱容量 (= 比熱 × 質量)
 * @param {number} thot0 高温側の初期温度
 * @param {number} tcold0 低温側の初期温度
 * @returns {number} 熱平衡温度
 */
export function computeEquilibriumTemperature(cHot, cCold, thot0, tcold0) {
  return (cHot * thot0 + cCold * tcold0) / (cHot + cCold);
}

/**
 * 熱平衡に至る過程での温度を、ニュートンの冷却法則的な指数緩和で計算する。
 * T(t) = Teq + (T0 - Teq) * exp(-k_eff * t)
 * @param {number} teq 熱平衡温度
 * @param {number} t0 初期温度
 * @param {number} kEff 緩和係数 (= G / C_hot)
 * @param {number} t 経過時間
 * @returns {number} 時刻tでの温度
 */
export function computeTemperatureAtTime(teq, t0, kEff, t) {
  return teq + (t0 - teq) * Math.exp(-kEff * t);
}
