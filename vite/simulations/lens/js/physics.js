/**
 * 凸レンズによる像までの距離を計算する（レンズの公式）。
 * 1/f = 1/a + 1/b を b について解いた形。
 * @param {number} objectDistance 物体からレンズまでの距離 a
 * @param {number} focalLength 焦点距離 f
 * @returns {number} レンズから像までの距離 b
 */
export function computeConvexLensImageDistance(objectDistance, focalLength) {
  return (objectDistance * focalLength) / (focalLength - objectDistance);
}

/**
 * 凹レンズによる像までの距離を計算する（レンズの公式、発散レンズ）。
 * @param {number} objectDistance 物体からレンズまでの距離 a
 * @param {number} focalLength 焦点距離 f
 * @returns {number} レンズから像までの距離 b
 */
export function computeConcaveLensImageDistance(objectDistance, focalLength) {
  return (objectDistance * focalLength) / (objectDistance + focalLength);
}

/**
 * 像の倍率を計算する。 m = b / a
 * @param {number} imageDistance 像までの距離 b
 * @param {number} objectDistance 物体までの距離 a
 * @returns {number} 倍率
 */
export function computeMagnification(imageDistance, objectDistance) {
  return imageDistance / objectDistance;
}
