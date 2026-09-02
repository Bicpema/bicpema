/**
 * 斜面上の物体にはたらく重力を、斜面方向・斜面垂直方向に分解する。
 * @param {number} mass 質量 (kg)
 * @param {number} gravity 重力加速度 (m/s^2)
 * @param {number} angleDeg 斜面の角度 (度)
 * @returns {{gravity: number, parallel: number, perpendicular: number}}
 *   gravity: 重力の大きさ mg (N)
 *   parallel: 斜面方向成分 mg*sinθ (N)
 *   perpendicular: 斜面垂直方向成分 mg*cosθ (N)
 */
export function decomposeGravityOnSlope(mass, gravity, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const mg = mass * gravity;
  return {
    gravity: mg,
    parallel: mg * Math.sin(theta),
    perpendicular: mg * Math.cos(theta),
  };
}
