/** 空気抵抗係数がこの値未満の場合は抵抗なしの自由落下の式を用いる */
const DRAG_EPSILON = 1e-6;

/**
 * 空気抵抗（速度に比例する抵抗力）を考慮した自由落下の
 * 落下距離と速度を計算する（質量1kgとして正規化した抵抗係数kを用いる）。
 *
 * k が十分小さい場合は空気抵抗なしの等加速度運動の式を用い、
 * それ以外の場合は線形抵抗を受ける運動の解析解を用いる。
 *
 * @param {Object} params
 * @param {number} params.t 経過時間 (s)
 * @param {number} params.gravity 重力加速度 (m/s^2)
 * @param {number} params.k 空気抵抗係数（質量1kgあたり）
 * @returns {{distanceFallen: number, velocity: number}} 落下距離と速度
 */
export function computeDragFreeFall({ t, gravity, k }) {
  if (k < DRAG_EPSILON) {
    const velocity = gravity * t;
    const distanceFallen = 0.5 * gravity * t * t;
    return { distanceFallen, velocity };
  }

  const terminalVelocity = gravity / k;
  const decay = 1 - Math.exp(-k * t);
  const velocity = terminalVelocity * decay;
  const distanceFallen = terminalVelocity * t - (terminalVelocity / k) * decay;
  return { distanceFallen, velocity };
}
