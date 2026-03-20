// logic.js - 熱力学第一法則シミュレーションの計算ロジック

/**
 * 熱力学第一法則: 内部エネルギーの変化を計算する
 * ΔU = Q - W
 * @param {number} Q 加えた熱量 (概念単位)
 * @param {number} W 系がした仕事 (概念単位)
 * @returns {number} 内部エネルギーの変化量
 */
export function calcInternalEnergyChange(Q, W) {
  return Q - W;
}

/**
 * 定圧過程での仕事を計算する
 * W = P * ΔV
 * @param {number} P 圧力 (概念単位)
 * @param {number} deltaV 体積変化 (概念単位)
 * @returns {number} 仕事
 */
export function calcWork(P, deltaV) {
  return P * deltaV;
}

/**
 * 気体の温度を計算する（定圧理想気体近似）
 * @param {number} T0 基底温度
 * @param {number} step 加熱ステップ数
 * @param {number} dT_unit 1ステップあたりの温度上昇
 * @returns {number} 温度
 */
export function calcGasTemperature(T0, step, dT_unit) {
  return T0 + step * dT_unit;
}
