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
