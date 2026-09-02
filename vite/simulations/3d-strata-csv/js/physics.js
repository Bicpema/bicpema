/**
 * 座標データの配列から最小値・最大値の範囲を計算する。
 * 値が存在しない場合は0を範囲として返す。
 * @param {number[]} values 座標値の配列
 * @returns {{min: number, max: number}} 最小値・最大値
 */
export function computeCoordinateBounds(values) {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }
  let min = values[0];
  let max = values[0];
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
}

/**
 * x方向・y方向の表示範囲を、短い方に余白を加えて正方形（同じ長さ）に揃える。
 * @param {number} xMin x方向の最小値
 * @param {number} xMax x方向の最大値
 * @param {number} yMin y方向の最小値
 * @param {number} yMax y方向の最大値
 * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
 */
export function computeSquareBounds(xMin, xMax, yMin, yMax) {
  const xLen = xMax - xMin;
  const yLen = yMax - yMin;
  const unitLen = Math.max(xLen, yLen);

  if (xLen <= yLen) {
    const addLenValue = (unitLen - xLen) / 2;
    return { xMin: xMin - addLenValue, xMax: xMax + addLenValue, yMin, yMax };
  }
  const addLenValue = (unitLen - yLen) / 2;
  return { xMin, xMax, yMin: yMin - addLenValue, yMax: yMax + addLenValue };
}
