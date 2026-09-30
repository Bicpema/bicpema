/**
 * 気柱の両端の境界条件（閉管・開管）から定常波の波数に相当する定数を計算する。
 * 閉管: (m・π)/(2L)、開管: (n・π)/L
 * @param type - 管の種類
 * @param mn - 振動の次数 (閉管はm=1,3,5,...、開管はn=1,2,3,...)
 * @param pipeL - 管の長さ
 * @returns 波数に相当する定数
 */
export function computeFreqConst(
  type: "closed" | "open",
  mn: number,
  pipeL: number
) {
  return type === "closed"
    ? (mn * Math.PI) / (2 * pipeL)
    : (mn * Math.PI) / pipeL;
}

/**
 * 気柱内の定常波の変位を計算する。
 * y = A cos(x・freqConst) sin(ωt)
 * @param amplitude - 振幅 A
 * @param freqConst - 波数に相当する定数
 * @param x - 管内の位置
 * @param timeSinValue - 時間項 sin(ωt) の値
 * @returns 変位
 */
export function computeStandingWaveDisplacement(
  amplitude: number,
  freqConst: number,
  x: number,
  timeSinValue: number
) {
  return amplitude * Math.cos(x * freqConst) * timeSinValue;
}
