/**
 * スネルの法則における sin(θ2) の値（= sin(θ1)/n12）を計算する。
 * この値の絶対値が1を超える場合は全反射が起こる（屈折角が存在しない）。
 * @param {number} theta1 入射角 (ラジアン)
 * @param {number} n12 相対屈折率 (n2/n1)
 * @returns {number} sin(θ2) に相当する値
 */
export function computeSnellRatio(theta1, n12) {
  return Math.sin(theta1) / n12;
}

/**
 * スネルの法則から屈折角を計算する。
 * n1 sinθ1 = n2 sinθ2
 * @param {number} theta1 入射角 (ラジアン)
 * @param {number} n12 相対屈折率 (n2/n1)
 * @returns {number} 屈折角 θ2 (ラジアン)
 */
export function computeRefractionAngle(theta1, n12) {
  return Math.asin(computeSnellRatio(theta1, n12));
}

if (typeof window !== "undefined") {
  /** @type {any} */ (window).refractionPhysics = {
    computeSnellRatio,
    computeRefractionAngle,
  };
}
