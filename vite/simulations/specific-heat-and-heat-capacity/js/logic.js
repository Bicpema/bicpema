// logic.js - 比熱と熱容量シミュレーションの計算ロジック

/**
 * 比熱テーブル [J/(g·K)]
 */
export const SPECIFIC_HEAT_TABLE = [
  901, // アルミニウム
  448, // 鉄
  386, // 銅
  236, // 銀
  140, // 水銀
];

/**
 * 熱容量を計算する
 * @param {number} m 質量 [g]
 * @param {number} c 比熱 [J/(g·K)]
 * @returns {number} 熱容量 [J/K]
 */
export function heatCapacity(m, c) {
  return m * c;
}

/**
 * 熱量 Q を加えたときの温度上昇を計算する
 * @param {number} Q 熱量 [J]
 * @param {number} m 質量 [g]
 * @param {number} c 比熱 [J/(g·K)]
 * @returns {number} 温度上昇 [K]
 */
export function deltaTemperature(Q, m, c) {
  return Q / (m * c);
}

/**
 * 温度 T [K] を計算する（初期温度 T0 + ΔT）
 * @param {number} T0 初期温度 [K]
 * @param {number} Q 熱量 [J]
 * @param {number} m 質量 [g]
 * @param {number} c 比熱 [J/(g·K)]
 * @returns {number} 温度 [K]
 */
export function calcTemperature(T0, Q, m, c) {
  return T0 + deltaTemperature(Q, m, c);
}
