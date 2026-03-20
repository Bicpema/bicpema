// logic.js - 熱機関シミュレーションの計算ロジック

/**
 * カルノー効率を計算する
 * η = 1 - T_cold / T_hot
 * @param {number} T_hot 高温熱源の温度 [K]
 * @param {number} T_cold 低温熱源の温度 [K]
 * @returns {number} 熱効率 (0〜1)
 */
export function carnotEfficiency(T_hot, T_cold) {
  return 1 - T_cold / T_hot;
}

/**
 * 熱機関の熱効率を計算する
 * η = W / Q_in
 * @param {number} W 取り出した仕事
 * @param {number} Q_in 高温熱源から受け取った熱量
 * @returns {number} 熱効率
 */
export function thermalEfficiency(W, Q_in) {
  if (Q_in === 0) return 0;
  return W / Q_in;
}

/**
 * 低温熱源へ放出した熱量を計算する
 * Q_out = Q_in - W
 * @param {number} Q_in 高温熱源から受け取った熱量
 * @param {number} W 取り出した仕事
 * @returns {number} 放出熱量
 */
export function calcHeatOut(Q_in, W) {
  return Q_in - W;
}
