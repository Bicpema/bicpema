/**
 * サンプル配列上のインデックスをキャンバス上のx座標に変換する。
 * @param index - サンプルのインデックス
 * @param sampleCount - サンプル総数
 * @param canvasWidth - キャンバス幅
 * @returns x座標
 */
export function mapIndexToX(
  index: number,
  sampleCount: number,
  canvasWidth: number
) {
  return (index / sampleCount) * canvasWidth;
}

/**
 * 波形モードの振幅値(-1〜1)をキャンバス上のy座標に変換する。
 * @param value - 振幅値 (-1〜1)
 * @param canvasHeight - キャンバス高さ
 * @returns y座標
 */
export function mapWaveformValueToY(value: number, canvasHeight: number) {
  return ((value + 1) / 2) * canvasHeight;
}

/** キャンバス下端に確保する余白（スペクトラムの底が枠線に重ならないようにする） */
const SPECTRUM_BOTTOM_MARGIN = 5;

/**
 * スペクトラムモードの強度値(0〜255)をキャンバス上のy座標に変換する。
 * 値が大きいほど上（yが小さい）になる。
 * @param value - 強度値 (0〜255)
 * @param canvasHeight - キャンバス高さ
 * @returns y座標
 */
export function mapSpectrumValueToY(value: number, canvasHeight: number) {
  return (canvasHeight - SPECTRUM_BOTTOM_MARGIN) * (1 - value / 255);
}
