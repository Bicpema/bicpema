import { computeSineWave } from "../../../ts/physics/waves.js";

/**
 * 右向きに進む正弦波の変位を計算する。 y = A sin(kx - ωt)
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @returns 変位
 */
export function computeRightWaveDisplacement(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number
) {
  return computeSineWave(amplitude, k, x, omega, t, 1);
}

/**
 * 固定端（x = innerW）で反射した左向きの正弦波の変位を計算する。
 * 入射波 A sin(kx - ωt) が固定端で位相πずれて反射するため、
 * y = A sin(k(x - 2L) + ωt) （L = innerW）となり、x = L が常に節になる。
 * 描画領域の幅が変わっても、反射端が節となる位相関係が保たれる。
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @param innerW - 描画領域の幅（反射端の位置 L）
 * @returns 変位
 */
export function computeLeftWaveDisplacement(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number,
  innerW: number
) {
  return computeSineWave(amplitude, k, x - 2 * innerW, omega, t, -1);
}

/**
 * 定在波の変位を、右向き波と固定端反射波の重ね合わせ（波の独立性）として計算する。
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @param innerW - 描画領域の幅（反射端の位置）
 * @returns 変位
 */
export function computeStandingWaveDisplacement(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number,
  innerW: number
) {
  const y1 = computeRightWaveDisplacement(amplitude, k, x, omega, t);
  const y2 = computeLeftWaveDisplacement(amplitude, k, x, omega, t, innerW);
  return y1 + y2;
}

/**
 * 経過時間から、右向き波・左向き波それぞれの先端位置を計算する。
 * @param v - 波の伝わる速さ
 * @param t - 経過時間
 * @param innerW - 描画領域の幅
 * @returns
 */
export function computeWaveFronts(v: number, t: number, innerW: number) {
  return {
    rightFront: Math.min(v * t, innerW),
    leftFront: Math.max(innerW - v * t, 0)
  };
}
