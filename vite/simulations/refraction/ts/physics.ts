import { computeRefractionAngle as commonComputeRefractionAngle } from "../../../ts/physics/optics.js";

/**
 * スネルの法則における sin(θ2) の値（= sin(θ1)/n12）を計算する。
 * この値の絶対値が1を超える場合は全反射が起こる（屈折角が存在しない）。
 * @param theta1 - 入射角 (ラジアン)
 * @param n12 - 相対屈折率 (n2/n1)
 * @returns sin(θ2) に相当する値
 */
export function computeSnellRatio(theta1: number, n12: number) {
  return Math.sin(theta1) / n12;
}

/**
 * スネルの法則から屈折角を計算する。
 * n1 sinθ1 = n2 sinθ2
 * @param theta1 - 入射角 (ラジアン)
 * @param n12 - 相対屈折率 (n2/n1)
 * @returns 屈折角 θ2 (ラジアン)。全反射のとき NaN（共通関数の null を描画用に変換する）
 */
export function computeRefractionAngle(theta1: number, n12: number) {
  return commonComputeRefractionAngle(1, n12, theta1) ?? NaN;
}
