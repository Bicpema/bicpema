/**
 * 放射性崩壊における残存割合を計算する。
 * N(t)/N0 = (1/2)^(t/halfLife)
 * @param halfLife - 半減期
 * @param t - 経過時間（halfLifeと同じ単位）
 * @returns 残存割合 (0〜1)
 */
export function computeDecayFraction(halfLife: number, t: number) {
  return 0.5 ** (t / halfLife);
}

/**
 * 放射性崩壊における残存個数を計算する。
 * @param n0 - 初期個数
 * @param halfLife - 半減期
 * @param t - 経過時間（halfLifeと同じ単位）
 * @returns 残存個数
 */
export function computeRemainingCount(n0: number, halfLife: number, t: number) {
  return n0 * computeDecayFraction(halfLife, t);
}
