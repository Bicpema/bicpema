/**
 * ばねの組み合わせ方（直列・並列）に応じた合成ばね定数を計算する。
 * @param {number} k 1本あたりのばね定数
 * @param {1|2|3} combination 1: 単独, 2: 並列（2本）, 3: 直列（2本、同じkの場合）
 * @returns {number} 合成ばね定数
 */
export function computeEffectiveSpringConstant(k, combination) {
  if (combination === 1) return k;
  if (combination === 2) return 2 * k;
  return (k * k) / (2 * k);
}

/**
 * ばね振り子の単振動における位置を計算する。
 * @param {number} springConstant 合成ばね定数
 * @param {number} mass 質量
 * @param {number} amplitude 振幅
 * @param {number} t 経過時間 (s)
 * @returns {{x: number, y: number}} 変位（原点からの相対位置）
 */
export function computeSpringPosition(springConstant, mass, amplitude, t) {
  const omega = Math.sqrt(springConstant / mass);
  return {
    x: amplitude * -Math.cos(omega * t + Math.PI / 2),
    y: amplitude * Math.sin(omega * t + Math.PI / 2),
  };
}

if (typeof window !== "undefined") {
  /** @type {any} */ (window).springPhysics = {
    computeEffectiveSpringConstant,
    computeSpringPosition,
  };
}
