// logic.js - 熱移動の可視化シミュレーションの計算ロジック

/**
 * 混合後の平衡温度を計算する
 * @param {number} C_hot 高温物質の熱容量 [J/K]
 * @param {number} C_cold 低温物質の熱容量 [J/K]
 * @param {number} Thot0 高温物質の初期温度 [K]
 * @param {number} Tcold0 低温物質の初期温度 [K]
 * @returns {number} 平衡温度 [K]
 */
export function calcEquilibriumTemp(C_hot, C_cold, Thot0, Tcold0) {
  return (C_hot * Thot0 + C_cold * Tcold0) / (C_hot + C_cold);
}

/**
 * 時刻 t における温度を計算する（指数的緩和）
 * @param {number} Teq 平衡温度 [K]
 * @param {number} T0 初期温度 [K]
 * @param {number} k 冷却定数
 * @param {number} t 時刻
 * @returns {number} 温度 [K]
 */
export function calcTempAtTime(Teq, T0, k, t) {
  return Teq + (T0 - Teq) * Math.exp(-k * t);
}
