/**
 * 気柱の両端の境界条件（閉管・開管）から定常波の波数に相当する定数を計算する。
 * 閉管: (m・π)/(2L)、開管: (n・π)/L
 * @param {"closed"|"open"} type 管の種類
 * @param {number} mn 振動の次数 (閉管はm=1,3,5,...、開管はn=1,2,3,...)
 * @param {number} pipeL 管の長さ
 * @returns {number} 波数に相当する定数
 */
export function computeFreqConst(type, mn, pipeL) {
  return type === "closed"
    ? (mn * Math.PI) / (2 * pipeL)
    : (mn * Math.PI) / pipeL;
}

/**
 * 気柱内の定常波の変位を計算する。
 * y = A cos(x・freqConst) sin(ωt)
 * @param {number} amplitude 振幅 A
 * @param {number} freqConst 波数に相当する定数
 * @param {number} x 管内の位置
 * @param {number} timeSinValue 時間項 sin(ωt) の値
 * @returns {number} 変位
 */
export function computeStandingWaveDisplacement(
  amplitude,
  freqConst,
  x,
  timeSinValue
) {
  return amplitude * Math.cos(x * freqConst) * timeSinValue;
}
