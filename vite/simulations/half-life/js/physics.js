/**
 * 放射性崩壊における残存割合を計算する。
 * N(t)/N0 = (1/2)^(t/halfLife)
 * @param {number} halfLife 半減期
 * @param {number} t 経過時間（halfLifeと同じ単位）
 * @returns {number} 残存割合 (0〜1)
 */
export function computeDecayFraction(halfLife, t) {
  return Math.pow(0.5, t / halfLife);
}

/**
 * 放射性崩壊における残存個数を計算する。
 * @param {number} n0 初期個数
 * @param {number} halfLife 半減期
 * @param {number} t 経過時間（halfLifeと同じ単位）
 * @returns {number} 残存個数
 */
export function computeRemainingCount(n0, halfLife, t) {
  return n0 * computeDecayFraction(halfLife, t);
}
