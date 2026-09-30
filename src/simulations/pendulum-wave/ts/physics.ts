import { FPS, LENGTH_TO_METER_FACTOR } from "./constants.js";

/**
 * 振り子の波（同期がずれていく複数の振り子）の振れ角を単振動近似で計算する。
 * θ(t) = θ0 * sin(ωt),  ω = sqrt(g / L)
 *
 * @param theta0 - 振れ幅（初期角度、ラジアン）
 * @param length - 振り子の長さ（データ上の単位。LENGTH_TO_METER_FACTOR倍するとメートルになる）
 * @param gravity - 重力加速度 (m/s^2)
 * @param count - 経過フレーム数（累積カウンタ）
 * @param fps - フレームレート（省略時: FPS）
 * @returns 現在の振れ角 (ラジアン)
 */
export function computePendulumWaveAngle(
  theta0: number,
  length: number,
  gravity: number,
  count: number,
  fps = FPS
) {
  const lengthM = length * LENGTH_TO_METER_FACTOR;
  const omega = Math.sqrt(gravity / lengthM);
  return theta0 * Math.sin(omega * (count / fps));
}
