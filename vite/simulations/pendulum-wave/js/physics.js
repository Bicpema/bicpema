/**
 * 振り子の波（同期がずれていく複数の振り子）の振れ角を単振動近似で計算する。
 * θ(t) = θ0 * sin(ωt),  ω = sqrt(g / L)
 *
 * @param {number} theta0 振れ幅（初期角度、ラジアン）
 * @param {number} length 振り子の長さ（データ上の単位。0.25/300 倍するとメートルになる）
 * @param {number} gravity 重力加速度 (m/s^2)
 * @param {number} count 経過フレーム数（累積カウンタ）
 * @param {number} [fps=60] フレームレート
 * @returns {number} 現在の振れ角 (ラジアン)
 */
export function computePendulumWaveAngle(
  theta0,
  length,
  gravity,
  count,
  fps = 60
) {
  const lengthM = length * (0.25 / 300);
  const omega = Math.sqrt(gravity / lengthM);
  return theta0 * Math.sin(omega * (count / fps));
}
