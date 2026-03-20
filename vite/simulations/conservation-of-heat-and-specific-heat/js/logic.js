// logic.js - 熱量の保存・比熱のシミュレーションの計算ロジック

/**
 * 比熱テーブル [J/(g·K)]
 */
export const SPECIFIC_HEAT = {
  Al: 0.901, // アルミニウム
  Fe: 0.448, // 鉄
  Cu: 0.386, // 銅
  Ag: 0.236, // 銀
};

/**
 * 熱容量を計算する
 * @param {number} c 比熱 [J/(g·K)]
 * @param {number} m 質量 [g]
 * @returns {number} 熱容量 [J/K]
 */
export function heatCapacity(c, m) {
  return c * m;
}

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
 * @param {number} k_eff 有効冷却定数
 * @param {number} t 時刻 [s]
 * @returns {number} 温度 [K]
 */
export function calcTempAtTime(Teq, T0, k_eff, t) {
  return Teq + (T0 - Teq) * Math.exp(-k_eff * t);
}
