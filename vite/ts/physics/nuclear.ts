/** 原子核の計算（副作用のない純粋関数）。 */

/**
 * 放射性崩壊における残存割合。N/N0 = (1/2)^(t/T)
 * @param halfLife - 半減期
 * @param t - 経過時間（halfLifeと同じ単位）
 */
export function computeDecayFraction(halfLife: number, t: number) {
  return 0.5 ** (t / halfLife);
}

/**
 * 放射性崩壊における残存個数。
 */
export function computeRemainingCount(n0: number, halfLife: number, t: number) {
  return n0 * computeDecayFraction(halfLife, t);
}
