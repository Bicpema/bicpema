/**
 * 熱量Qを加えたときの温度変化を計算する（Q = mcΔT）。
 * ΔT = Q / (m * c)
 * @param {number} heat 加えた熱量 Q
 * @param {number} mass 質量 m (g)
 * @param {number} specificHeat 比熱 c (J/(g・K))
 * @returns {number} 温度変化 ΔT (K)
 */
export function computeTemperatureChange(heat, mass, specificHeat) {
  return heat / (mass * specificHeat);
}
