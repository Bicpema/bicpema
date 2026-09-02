/**
 * セロハンを重ねたときの光路差（位相差）を計算する。
 * 1枚あたりの光路差にセロハンの枚数を掛けたもの。
 * @param {number} sheetCount セロハンの枚数
 * @param {number} opdPerSheet セロハン1枚あたりの光路差 (nm)
 * @returns {number} 光路差 (nm)
 */
export function computeOpticalPathDifference(sheetCount, opdPerSheet) {
  return sheetCount * opdPerSheet;
}

/**
 * 直交ニコル（偏光板をクロスに配置した状態）でのセロハンの透過率を計算する。
 * I = (1/2)(1 - cos(2π・Δ/λ))
 * @param {number} opd 光路差 Δ (nm)
 * @param {number} wavelength 波長 λ (nm)
 * @returns {number} 透過率 (0〜1)
 */
export function computeTransmittance(opd, wavelength) {
  return 0.5 * (1 - Math.cos((opd / wavelength) * 2 * Math.PI));
}
