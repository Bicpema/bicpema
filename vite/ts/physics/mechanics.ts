/** 力学の計算（副作用のない純粋関数）。 */

/** 空気抵抗係数がこの値未満の場合は抵抗なしの式を用いる */
const DRAG_EPSILON = 1e-6;

/**
 * 運動方程式から加速度を求める。a = F / m
 * @param force - 合力 F (N)
 * @param mass - 質量 m (kg)。0以下のときは 0 を返す
 * @returns 加速度 (m/s²)
 */
export function computeAcceleration(force: number, mass: number) {
  if (!(mass > 0)) return 0;
  return force / mass;
}

/**
 * 同一直線上の力の合力を求める。
 * @param forces - 各力 (N)。向きは符号で表す
 * @returns 合力 (N)
 */
export function computeNetForce(forces: readonly number[]) {
  return forces.reduce((sum, f) => sum + f, 0);
}

/**
 * 力を直交する2成分に分解する。
 * @param magnitude - 力の大きさ (N)
 * @param angleDeg - x軸からの角度 (度)
 * @returns x成分とy成分
 */
export function decomposeForce(magnitude: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: magnitude * Math.cos(rad), y: magnitude * Math.sin(rad) };
}

/**
 * 2つの力の合成（ベクトル和）を求める。
 * @returns 合力のx成分・y成分・大きさ
 */
export function composeForces(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  const x = a.x + b.x;
  const y = a.y + b.y;
  return { x, y, magnitude: Math.hypot(x, y) };
}

/**
 * 等加速度直線運動の速度。v = v0 + a t
 */
export function computeUniformAccelVelocity(
  v0: number,
  acceleration: number,
  t: number
) {
  return v0 + acceleration * t;
}

/**
 * 等加速度直線運動の変位。x = v0 t + a t² / 2
 */
export function computeUniformAccelDisplacement(
  v0: number,
  acceleration: number,
  t: number
) {
  return v0 * t + 0.5 * acceleration * t * t;
}

/**
 * 線形の空気抵抗（速度に比例）を考慮した自由落下の落下距離と速度を求める。
 * 質量1kgあたりに正規化した抵抗係数 k を用いる。
 * k が十分小さい場合は等加速度運動の式を用いる。
 * @param params - `t`: 経過時間 (s) / `gravity`: 重力加速度 (m/s²) / `k`: 空気抵抗係数 (1/s)
 * @returns 落下距離 (m) と速度 (m/s)
 */
export function computeDragFreeFall({
  t,
  gravity,
  k
}: {
  t: number;
  gravity: number;
  k: number;
}) {
  if (!Number.isFinite(k) || k < DRAG_EPSILON) {
    return {
      distanceFallen: 0.5 * gravity * t * t,
      velocity: gravity * t
    };
  }
  const terminalVelocity = gravity / k;
  const decay = 1 - Math.exp(-k * t);
  return {
    distanceFallen: terminalVelocity * t - (terminalVelocity / k) * decay,
    velocity: terminalVelocity * decay
  };
}

/**
 * 斜面上の物体にはたらく重力の斜面方向・斜面垂直方向の成分を求める。
 * @param mass - 質量 (kg)
 * @param angleDeg - 斜面の傾き (度)
 * @param gravity - 重力加速度 (m/s²)
 * @returns 斜面に平行な成分と垂直な成分 (N)
 */
export function computeSlopeGravityComponents(
  mass: number,
  angleDeg: number,
  gravity: number
) {
  const rad = (angleDeg * Math.PI) / 180;
  const weight = mass * gravity;
  return {
    parallel: weight * Math.sin(rad),
    perpendicular: weight * Math.cos(rad)
  };
}

/**
 * 単振り子の周期（微小振れ角）。T = 2π√(L/g)
 * @param length - 振り子の長さ (m)
 * @param gravity - 重力加速度 (m/s²)
 */
export function computePendulumPeriod(length: number, gravity: number) {
  return 2 * Math.PI * Math.sqrt(length / gravity);
}

/**
 * 並列ばねの合成ばね定数。k = k1 + k2 + ...
 */
export function computeParallelSpringConstant(constants: readonly number[]) {
  return constants.reduce((sum, k) => sum + k, 0);
}

/**
 * 直列ばねの合成ばね定数。1/k = 1/k1 + 1/k2 + ...
 * @returns 合成ばね定数。要素がない、またはいずれかが0以下のとき 0
 */
export function computeSeriesSpringConstant(constants: readonly number[]) {
  if (constants.length === 0 || constants.some((k) => !(k > 0))) return 0;
  return 1 / constants.reduce((sum, k) => sum + 1 / k, 0);
}

/**
 * フックの法則による弾性力。F = k x
 */
export function computeSpringForce(springConstant: number, extension: number) {
  return springConstant * extension;
}
