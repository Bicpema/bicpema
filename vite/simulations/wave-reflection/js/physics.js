/**
 * 入射波の変位を計算する。 y = A sin(kx - ωt)
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @returns {number} 変位
 */
export function computeIncidentDisplacement(amplitude, k, x, omega, t) {
  return amplitude * Math.sin(k * x - omega * t);
}

/**
 * 反射波の変位を計算する。壁を中心に位置を鏡映した入射波として求め、
 * 固定端反射の場合は位相を反転させる。
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} mirrorOrigin 鏡映の中心（壁位置の2倍）
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @param {"fixed"|"free"} mode 反射の種類（固定端 / 自由端）
 * @returns {number} 変位
 */
export function computeReflectedDisplacement(
  amplitude,
  k,
  mirrorOrigin,
  x,
  omega,
  t,
  mode
) {
  const y = amplitude * Math.sin(k * (mirrorOrigin - x) - omega * t);
  return mode === "fixed" ? -y : y;
}

/**
 * 入射波と反射波を重ね合わせた合成波の変位を計算する（波の独立性）。
 * @param {number} amplitude 振幅 A
 * @param {number} k 波数
 * @param {number} x 位置
 * @param {number} omega 角振動数 ω
 * @param {number} t 時刻
 * @param {number} mirrorOrigin 鏡映の中心（壁位置の2倍）
 * @param {"fixed"|"free"} mode 反射の種類（固定端 / 自由端）
 * @returns {number} 変位
 */
export function computeCombinedDisplacement(
  amplitude,
  k,
  x,
  omega,
  t,
  mirrorOrigin,
  mode
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
 * @param {number} v 波の伝わる速さ
 * @param {number} t 経過時間
 * @param {number} maxFront 先端位置の上限
 * @returns {number} 波の先端位置
 */
export function computeWaveFront(v, t, maxFront) {
  return Math.min(v * t, maxFront);
}
