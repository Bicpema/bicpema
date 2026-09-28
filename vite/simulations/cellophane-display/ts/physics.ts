/**
 * セロハンによる複屈折の位相差（リターデーション）を波長ごとに計算する。
 * 分散データ・セロハンの枚数・光路差パラメータ・波長から求める。
 * @param dispersion - その波長での分散係数（波長ごとの光路差データ）
 * @param sheetCount - セロハンの枚数
 * @param opd - 光路差パラメータ
 * @param wavelength - 波長 (nm)
 * @returns 位相差 δ (ラジアン)
 */
export function computePhaseRetardation(
  dispersion: number,
  sheetCount: number,
  opd: number,
  wavelength: number
) {
  return (dispersion * sheetCount * 2 * opd * Math.PI) / wavelength / 100;
}
