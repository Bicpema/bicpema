import { computeSlopeGravityComponents } from "../../../ts/physics/mechanics.js";

/**
 * 斜面上の物体にはたらく重力を、斜面方向・斜面垂直方向に分解する。
 * @param mass - 質量 (kg)
 * @param gravity - 重力加速度 (m/s^2)
 * @param angleDeg - 斜面の角度 (度)
 * @returns
 *   gravity: 重力の大きさ mg (N)
 *   parallel: 斜面方向成分 mg*sinθ (N)
 *   perpendicular: 斜面垂直方向成分 mg*cosθ (N)
 */
export function decomposeGravityOnSlope(
  mass: number,
  gravity: number,
  angleDeg: number
) {
  const { parallel, perpendicular } = computeSlopeGravityComponents(
    mass,
    angleDeg,
    gravity
  );
  return { gravity: mass * gravity, parallel, perpendicular };
}
