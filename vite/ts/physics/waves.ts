/** 波動の計算（副作用のない純粋関数）。 */

/**
 * 正弦波（進行波）の変位。y = A sin(2π(t/T − x/λ))（+x方向に進む）
 * @param amplitude - 振幅 A
 * @param period - 周期 T
 * @param wavelength - 波長 λ
 * @param x - 位置
 * @param t - 時刻
 */
export function computeTravelingWave(
  amplitude: number,
  period: number,
  wavelength: number,
  x: number,
  t: number
) {
  return amplitude * Math.sin(2 * Math.PI * (t / period - x / wavelength));
}

/**
 * 定常波の変位。y = 2A sin(2πx/λ) cos(2πt/T)
 */
export function computeStandingWave(
  amplitude: number,
  period: number,
  wavelength: number,
  x: number,
  t: number
) {
  return (
    2 *
    amplitude *
    Math.sin((2 * Math.PI * x) / wavelength) *
    Math.cos((2 * Math.PI * t) / period)
  );
}

/**
 * 波の基本式から速さを求める。v = f λ
 */
export function computeWaveSpeed(frequency: number, wavelength: number) {
  return frequency * wavelength;
}

/**
 * 距離を波が伝わるのに要する時間。t = d / v
 * @returns 到達時間。速さが0以下のとき Infinity
 */
export function computeArrivalTime(distance: number, speed: number) {
  return speed > 0 ? distance / speed : Infinity;
}

/**
 * ドップラー効果で観測される振動数。
 * f' = f (V − vo) / (V − vs)
 * @param frequency - 音源の振動数 f
 * @param soundSpeed - 音速 V
 * @param observerVelocity - 観測者の速度 vo（音源から観測者へ向かう向きを正）
 * @param sourceVelocity - 音源の速度 vs（音源から観測者へ向かう向きを正）
 */
export function computeDopplerFrequency(
  frequency: number,
  soundSpeed: number,
  observerVelocity: number,
  sourceVelocity: number
) {
  return (
    (frequency * (soundSpeed - observerVelocity)) /
    (soundSpeed - sourceVelocity)
  );
}

/**
 * 気柱の共鳴（閉管）の共鳴波長。λ = 4L / (2m − 1)（m = 1, 2, ...）
 */
export function computeClosedTubeWavelength(length: number, mode: number) {
  return (4 * length) / (2 * mode - 1);
}

/**
 * 気柱の共鳴（開管）の共鳴波長。λ = 2L / m（m = 1, 2, ...）
 */
export function computeOpenTubeWavelength(length: number, mode: number) {
  return (2 * length) / mode;
}

/**
 * 角波数・角振動数で表した正弦波の変位。y = A sin(kx − ωt)（+x方向に進む）
 * @param amplitude - 振幅 A
 * @param k - 角波数 k = 2π/λ
 * @param x - 位置
 * @param omega - 角振動数 ω = 2π/T
 * @param t - 時刻
 * @param direction - 進行方向。1 で +x 方向、-1 で −x 方向
 */
export function computeSineWave(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number,
  direction: 1 | -1 = 1
) {
  return amplitude * Math.sin(k * x - direction * omega * t);
}

/**
 * 波面の進んだ距離。到達できる最大距離でクランプする。
 * @param speed - 波の速さ v
 * @param t - 経過時間
 * @param maxFront - 最大距離
 */
export function computeWaveFrontDistance(
  speed: number,
  t: number,
  maxFront: number
) {
  return Math.min(speed * t, maxFront);
}
