/**
 * 右向きに進む正弦波の変位を計算する。 y = A sin(kx - ωt)
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @returns {number} 変位
 */
export function computeRightWaveDisplacement(amplitude, k, x, omega, t) {
  return amplitude * Math.sin(k * x - omega * t);
}

/**
 * 左向きに進む正弦波の変位を計算する。 y = A sin(kx + ωt)
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @returns {number} 変位
 */
export function computeLeftWaveDisplacement(amplitude, k, x, omega, t) {
  return amplitude * Math.sin(k * x + omega * t);
}

/**
 * 定在波の変位を、右向き波と反射波の重ね合わせ（波の独立性）として計算する。
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @param {number} innerW 描画領域の幅（反射端の位置）
 * @returns {number} 変位
 */
export function computeStandingWaveDisplacement(
  amplitude,
  k,
  x,
  omega,
  t,
  innerW
) {
  const y1 = computeRightWaveDisplacement(amplitude, k, x, omega, t);
  const y2 = amplitude * Math.sin(k * (innerW - x) - omega * t);
  return y1 + y2;
}

/**
 * 経過時間から、右向き波・左向き波それぞれの先端位置を計算する。
 * @param {number} v 波の伝わる速さ
 * @param {number} t 経過時間
 * @param {number} innerW 描画領域の幅
 * @returns {{rightFront: number, leftFront: number}}
 */
export function computeWaveFronts(v, t, innerW) {
  return {
    rightFront: Math.min(v * t, innerW),
    leftFront: Math.max(innerW - v * t, 0),
  };
}
