import { CURRENT_THRESHOLD } from "./constants.js";

/**
 * 直線電流のまわりの磁場の強さ（相対値）を計算する（アンペールの法則）。
 * B ∝ |I| / r
 * @param current - 電流 I
 * @param radius - 電流からの距離 r
 * @returns 相対磁場強度
 */
export function computeMagneticFieldStrength(current: number, radius: number) {
  return Math.abs(current) / radius;
}

/**
 * 電流の向きから磁場の回転方向を判定する（右ねじの法則）。
 * @param current - 電流 I
 * @returns 磁場の向き
 */
export function computeFieldDirection(current: number) {
  if (current > CURRENT_THRESHOLD) return "counterclockwise";
  if (current < -CURRENT_THRESHOLD) return "clockwise";
  return "none";
}
