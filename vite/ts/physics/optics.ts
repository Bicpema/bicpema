/** 光学の計算（副作用のない純粋関数）。 */

/**
 * スネルの法則による屈折角（ラジアン）。n1 sinθ1 = n2 sinθ2
 * @param n1 - 入射側の屈折率
 * @param n2 - 屈折側の屈折率
 * @param incidentAngle - 入射角 (rad)
 * @returns 屈折角 (rad)。全反射のとき null
 */
export function computeRefractionAngle(
  n1: number,
  n2: number,
  incidentAngle: number
) {
  const s = (n1 / n2) * Math.sin(incidentAngle);
  return Math.abs(s) > 1 ? null : Math.asin(s);
}

/**
 * 全反射の臨界角 (rad)。sinθc = n2 / n1
 * @returns 臨界角。n1 ≤ n2 のとき全反射は起きないので null
 */
export function computeCriticalAngle(n1: number, n2: number) {
  return n1 > n2 ? Math.asin(n2 / n1) : null;
}

/**
 * 薄レンズの式から像の位置を求める。1/a + 1/b = 1/f
 * @param focalLength - 焦点距離 f
 * @param objectDistance - 物体距離 a
 * @returns 像距離 b。物体が焦点上にあるとき（像が無限遠）は null
 */
export function computeImageDistance(
  focalLength: number,
  objectDistance: number
) {
  const inv = 1 / focalLength - 1 / objectDistance;
  return Math.abs(inv) < 1e-12 ? null : 1 / inv;
}

/**
 * レンズの倍率。m = |b / a|
 */
export function computeLensMagnification(
  imageDistance: number,
  objectDistance: number
) {
  return Math.abs(imageDistance / objectDistance);
}

/**
 * 光路差から位相差 (rad) を求める。Δφ = 2π Δ / λ
 */
export function computePhaseDifference(
  pathDifference: number,
  wavelength: number
) {
  return (2 * Math.PI * pathDifference) / wavelength;
}
