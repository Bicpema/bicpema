/**
 * 単振り子の角度を単振動近似で計算する。
 * θ(t) = θ0 * cos(ωt),  ω = sqrt(g / L)
 *
 * @param {number} theta0Deg 振れ幅（初期角度、度）
 * @param {number} stringLengthPx 振り子の長さ（表示ピクセル単位、50*100で割るとメートルになる）
 * @param {number} gravity 重力加速度 (m/s^2)
 * @param {number} count 経過フレーム数（累積カウンタ）
 * @param {number} [fps=60] フレームレート
 * @returns {number} 現在の振れ角 (ラジアン)
 */
export function computePendulumAngle(
  theta0Deg,
  stringLengthPx,
  gravity,
  count,
  fps = 60
) {
  const theta0 = (theta0Deg * Math.PI) / 180;
  const lengthM = stringLengthPx / (50 * 100);
  const omega = Math.sqrt(gravity / lengthM);
  return theta0 * Math.cos(omega * (count / fps));
}

if (typeof window !== "undefined") {
  /** @type {any} */ (window).pendulumPhysics = { computePendulumAngle };
}
