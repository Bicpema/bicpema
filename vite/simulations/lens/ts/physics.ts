/**
 * 凸レンズによる像までの距離を計算する（レンズの公式）。
 * 1/f = 1/a + 1/b を b について解いた形。
 * @param objectDistance - 物体からレンズまでの距離 a
 * @param focalLength - 焦点距離 f
 * @returns レンズから像までの距離 b
 */
export function computeConvexLensImageDistance(
  objectDistance: number,
  focalLength: number
) {
  return (objectDistance * focalLength) / (focalLength - objectDistance);
}

/**
 * 凹レンズによる像までの距離を計算する（レンズの公式、発散レンズ）。
 * @param objectDistance - 物体からレンズまでの距離 a
 * @param focalLength - 焦点距離 f
 * @returns レンズから像までの距離 b
 */
export function computeConcaveLensImageDistance(
  objectDistance: number,
  focalLength: number
) {
  return (objectDistance * focalLength) / (objectDistance + focalLength);
}

/**
 * 像の倍率を計算する。 m = b / a
 * @param imageDistance - 像までの距離 b
 * @param objectDistance - 物体までの距離 a
 * @returns 倍率
 */
export function computeMagnification(
  imageDistance: number,
  objectDistance: number
) {
  return imageDistance / objectDistance;
}
