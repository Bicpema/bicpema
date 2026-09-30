/**
 * 熱量Qを加えたときの温度変化を計算する（Q = mcΔT）。
 * ΔT = Q / (m * c)
 * @param heat - 加えた熱量 Q
 * @param mass - 質量 m (g)
 * @param specificHeat - 比熱 c (J/(g・K))
 * @returns 温度変化 ΔT (K)
 */
export function computeTemperatureChange(
  heat: number,
  mass: number,
  specificHeat: number
) {
  return heat / (mass * specificHeat);
}
