/**
 * 2つの力ベクトルの合力を計算する（力の合成）。
 * @param {number} f1x F1のx成分
 * @param {number} f1y F1のy成分
 * @param {number} f2x F2のx成分
 * @param {number} f2y F2のy成分
 * @returns {{x: number, y: number}} 合力ベクトル
 */
export function composeForces(f1x, f1y, f2x, f2y) {
  return { x: f1x + f2x, y: f1y + f2y };
}

/**
 * 力ベクトルの大きさを計算する。
 * @param {number} x x成分（ピクセル単位）
 * @param {number} y y成分（ピクセル単位）
 * @param {number} forceScale スケール (px/N)
 * @returns {number} 力の大きさ (N)
 */
export function computeForceMagnitude(x, y, forceScale) {
  return Math.sqrt(x * x + y * y) / forceScale;
}

/**
 * 力ベクトルの向き（角度）を計算する。
 * 画面座標系（y下向き正）を物理座標系（y上向き正）に変換して角度を求める。
 * @param {number} x x成分
 * @param {number} y y成分（画面座標系、下向き正）
 * @returns {number} x軸正方向を0度とした角度 (度)
 */
export function computeForceAngleDeg(x, y) {
  return (Math.atan2(-y, x) * 180) / Math.PI;
}
