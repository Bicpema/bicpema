/**
 * 摩擦のない斜面を滑り落ちる物体の、1フレームあたりの変位を計算する。
 *
 * 斜面方向の加速度は g*sinθ で、その水平・鉛直成分（画面座標系、下向き正）は
 * それぞれ g*sinθ*cosθ, g*sin²θ となる。
 *
 * @param {number} gravity 重力加速度 (m/s^2)
 * @param {number} angleDeg 斜面の角度 (度)
 * @param {number} count 経過フレーム数（累積カウンタ）
 * @param {number} [fps=60] フレームレート
 * @returns {{dx: number, dy: number}} このフレームで加算すべき水平・鉛直変位
 */
export function computeSlideDisplacement(gravity, angleDeg, count, fps = 60) {
  const theta = (angleDeg * Math.PI) / 180;
  const t = count / fps;
  return {
    dx: gravity * Math.sin(theta) * Math.cos(theta) * t,
    dy: gravity * Math.sin(theta) * Math.sin(theta) * t,
  };
}

if (typeof window !== "undefined") {
  /** @type {any} */ (window).normalForcePhysics = {
    computeSlideDisplacement,
  };
}
