/**
 * 空気抵抗（速度に比例する抵抗力）を考慮した斜方投射の位置を計算する
 *
 * k（抵抗係数）が十分小さい場合は空気抵抗なしの放物運動の式を用い、
 * それ以外の場合は線形抵抗を受ける運動の解析解を用いる。
 *
 * @param params -
 *   - `t`: 経過時間 (s)
 *   - `speed`: 初速度 (m/s)
 *   - `angleDeg`: 射出角度 (度)
 *   - `mass`: 質量 (kg)
 *   - `k`: 空気抵抗係数
 *   - `gravity`: 重力加速度 (m/s^2)
 *   - `posx0`: 初期x座標
 *   - `posy0`: 初期y座標
 * @returns 計算された位置
 */
export function computeDragProjectilePosition({
  t,
  speed,
  angleDeg,
  mass,
  k,
  gravity,
  posx0,
  posy0
}: {
  t: number;
  speed: number;
  angleDeg: number;
  mass: number;
  k: number;
  gravity: number;
  posx0: number;
  posy0: number;
}) {
  const theta = (angleDeg * Math.PI) / 180;

  if (k >= 0.1) {
    const decay = 1 - Math.exp((-k / mass) * t);
    const x = (mass / k) * speed * Math.cos(theta) * decay + posx0;
    const y =
      (mass / k) * (-speed * Math.sin(theta) - (mass * gravity) / k) * decay +
      ((mass * gravity) / k) * t +
      posy0;
    return { x, y };
  }

  const x = speed * Math.cos(theta) * t + posx0;
  const y = -speed * Math.sin(theta) * t + 0.5 * gravity * t * t + posy0;
  return { x, y };
}
