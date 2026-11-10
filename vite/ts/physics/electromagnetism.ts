/** 電磁気学の計算（副作用のない純粋関数）。 */

import { VACUUM_PERMEABILITY } from "./constants.js";

/**
 * 直線電流がつくる磁場の強さ（SI）。B = μ0 I / (2π r)
 * @param current - 電流 I (A)
 * @param radius - 距離 r (m)
 * @returns 磁束密度の大きさ (T)。r が0以下のとき Infinity
 */
export function computeStraightCurrentField(current: number, radius: number) {
  if (!(radius > 0)) return Infinity;
  return (VACUUM_PERMEABILITY * Math.abs(current)) / (2 * Math.PI * radius);
}

/**
 * 変圧器の二次電圧。V2 = V1 × (N2 / N1)
 */
export function computeSecondaryVoltage(
  primaryVoltage: number,
  primaryTurns: number,
  secondaryTurns: number
) {
  return primaryVoltage * (secondaryTurns / primaryTurns);
}

/**
 * 変圧器の二次電流。I2 = I1 × (N1 / N2)
 */
export function computeSecondaryCurrent(
  primaryCurrent: number,
  primaryTurns: number,
  secondaryTurns: number
) {
  return primaryCurrent * (primaryTurns / secondaryTurns);
}
