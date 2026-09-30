/**
 * 入射波の変位を計算する。 y = A sin(kx - ωt)
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @returns 変位
 */
export function computeIncidentDisplacement(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number
) {
  return amplitude * Math.sin(k * x - omega * t);
}

/**
 * 反射波の変位を計算する。壁を中心に位置を鏡映した入射波として求め、
 * 固定端反射の場合は位相を反転させる。
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param mirrorOrigin - 鏡映の中心（壁位置の2倍）
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @param mode - 反射の種類（固定端 / 自由端）
 * @returns 変位
 */
export function computeReflectedDisplacement(
  amplitude: number,
  k: number,
  mirrorOrigin: number,
  x: number,
  omega: number,
  t: number,
  mode: "fixed" | "free"
) {
  const y = amplitude * Math.sin(k * (mirrorOrigin - x) - omega * t);
  return mode === "fixed" ? -y : y;
}

/**
 * 入射波と反射波を重ね合わせた合成波の変位を計算する（波の独立性）。
 * @param amplitude - 振幅 A
 * @param k - 波数
 * @param x - 位置
 * @param omega - 角振動数 ω
 * @param t - 時刻
 * @param mirrorOrigin - 鏡映の中心（壁位置の2倍）
 * @param mode - 反射の種類（固定端 / 自由端）
 * @returns 変位
 */
export function computeCombinedDisplacement(
  amplitude: number,
  k: number,
  x: number,
  omega: number,
  t: number,
  mirrorOrigin: number,
  mode: "fixed" | "free"
) {
  const yIncident = computeIncidentDisplacement(amplitude, k, x, omega, t);
  const yReflected = computeReflectedDisplacement(
    amplitude,
    k,
    mirrorOrigin,
    x,
    omega,
    t,
    mode
  );
  return yIncident + yReflected;
}

/**
 * 経過時間から波の先端位置を計算する（上限あり）。
 * @param v - 波の伝わる速さ
 * @param t - 経過時間
 * @param maxFront - 先端位置の上限
 * @returns 波の先端位置
 */
export function computeWaveFront(v: number, t: number, maxFront: number) {
  return Math.min(v * t, maxFront);
}
