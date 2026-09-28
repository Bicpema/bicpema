import { ORIGIN_X } from "./constants.js";

/**
 * 音源の等速直線運動による位置を計算する。
 * @param speed - 音源の速さ (m/s相当の単位)
 * @param count - 経過フレーム数
 * @param fps - フレームレート
 * @param offset - 初期位置オフセット（省略時: ORIGIN_X）
 * @returns 音源のx座標
 */
export function computeSourcePosition(
  speed: number,
  count: number,
  fps: number,
  offset = ORIGIN_X
) {
  return (speed * count) / fps + offset;
}
