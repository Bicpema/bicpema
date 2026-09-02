/**
 * 直線電流のまわりの磁場の強さ（相対値）を計算する（アンペールの法則）。
 * B ∝ |I| / r
 * @param {number} current 電流 I
 * @param {number} radius 電流からの距離 r
 * @returns {number} 相対磁場強度
 */
export function computeMagneticFieldStrength(current, radius) {
  return Math.abs(current) / radius;
}

/**
 * 電流の向きから磁場の回転方向を判定する（右ねじの法則）。
 * @param {number} current 電流 I
 * @returns {"counterclockwise"|"clockwise"|"none"} 磁場の向き
 */
export function computeFieldDirection(current) {
  if (current > 0.1) return "counterclockwise";
  if (current < -0.1) return "clockwise";
  return "none";
}
