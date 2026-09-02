/**
 * セロハンによる複屈折の位相差（リターデーション）を波長ごとに計算する。
 * 分散データ・セロハンの枚数・光路差パラメータ・波長から求める。
 * @param {number} dispersion その波長での分散係数（波長ごとの光路差データ）
 * @param {number} sheetCount セロハンの枚数
 * @param {number} opd 光路差パラメータ
 * @param {number} wavelength 波長 (nm)
 * @returns {number} 位相差 δ (ラジアン)
 */
export function computePhaseRetardation(
  dispersion,
  sheetCount,
  opd,
  wavelength
) {
  return (dispersion * sheetCount * 2 * opd * Math.PI) / wavelength / 100;
}

if (typeof window !== "undefined") {
  /** @type {any} */ (window).cellophaneColor2Physics = {
    computePhaseRetardation,
  };
}
