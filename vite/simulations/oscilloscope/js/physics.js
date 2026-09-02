/**
 * サンプル配列上のインデックスをキャンバス上のx座標に変換する。
 * @param {number} index サンプルのインデックス
 * @param {number} sampleCount サンプル総数
 * @param {number} canvasWidth キャンバス幅
 * @returns {number} x座標
 */
export function mapIndexToX(index, sampleCount, canvasWidth) {
  return (index / sampleCount) * canvasWidth;
}

/**
 * 波形モードの振幅値(-1〜1)をキャンバス上のy座標に変換する。
 * @param {number} value 振幅値 (-1〜1)
 * @param {number} canvasHeight キャンバス高さ
 * @returns {number} y座標
 */
export function mapWaveformValueToY(value, canvasHeight) {
  return ((value + 1) / 2) * canvasHeight;
}

/**
 * スペクトラムモードの強度値(0〜255)をキャンバス上のy座標に変換する。
 * 値が大きいほど上（yが小さい）になる。
 * @param {number} value 強度値 (0〜255)
 * @param {number} canvasHeight キャンバス高さ
 * @returns {number} y座標
 */
export function mapSpectrumValueToY(value, canvasHeight) {
  return (canvasHeight - 5) * (1 - value / 255);
}
