/**
 * 音源の等速直線運動による位置を計算する。
 * @param {number} speed 音源の速さ (m/s相当の単位)
 * @param {number} count 経過フレーム数
 * @param {number} fps フレームレート
 * @param {number} [offset=50] 初期位置オフセット
 * @returns {number} 音源のx座標
 */
export function computeSourcePosition(speed, count, fps, offset = 50) {
  return (speed * count) / fps + offset;
}
