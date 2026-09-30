/**
 * ばねの組み合わせ方（直列・並列）に応じた合成ばね定数を計算する。
 * @param k - 1本あたりのばね定数
 * @param combination - 1: 単独, 2: 並列（2本）, 3: 直列（2本、同じkの場合）
 * @returns 合成ばね定数
 */
export function computeEffectiveSpringConstant(
  k: number | string,
  combination: number | string
) {
  const springConstant = Number(k);
  const combinationType = Number(combination);
  if (combinationType === 1) return springConstant;
  if (combinationType === 2) return 2 * springConstant;
  return springConstant / 2;
}

/**
 * ばね振り子の単振動における位置を計算する。
 * @param springConstant - 合成ばね定数
 * @param mass - 質量
 * @param amplitude - 振幅
 * @param t - 経過時間 (s)
 * @returns 変位（原点からの相対位置）
 */
export function computeSpringPosition(
  springConstant: number,
  mass: number,
  amplitude: number,
  t: number
) {
  const omega = Math.sqrt(springConstant / mass);
  return {
    x: amplitude * -Math.cos(omega * t + Math.PI / 2),
    y: amplitude * Math.sin(omega * t + Math.PI / 2)
  };
}
