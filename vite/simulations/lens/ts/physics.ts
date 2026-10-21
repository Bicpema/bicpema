import { computeImageDistance } from "../../../ts/physics/optics.js";

/**
 * 凸レンズによる像までの距離を計算する（レンズの公式）。
 * 1/f = 1/a + 1/b を b について解いた形。共通関数 computeImageDistance とは
 * 像距離の符号の向きが逆（虚像側が負）なので、符号を反転して使う。
 * @param objectDistance - 物体からレンズまでの距離 a
 * @param focalLength - 焦点距離 f
 * @returns レンズから像までの距離 b。焦点上（像が無限遠）のとき Infinity
 */
export function computeConvexLensImageDistance(
  objectDistance: number,
  focalLength: number
) {
  return -(computeImageDistance(focalLength, objectDistance) ?? -Infinity);
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
  return -(computeImageDistance(-focalLength, objectDistance) ?? -Infinity);
}

/**
 * 像の倍率を計算する。 m = b / a
 * 共通関数 computeLensMagnification は絶対値を返すが、このシミュレーションは
 * 像の向き（符号）を描画に使うため、符号付きの値を返す。
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
