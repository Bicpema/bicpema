import { DEFAULT_FPS, LENGTH_TO_METER_DIVISOR } from "./constants.js";

/**
 * 単振り子の角度を単振動近似で計算する。
 * θ(t) = θ0 * cos(ωt),  ω = sqrt(g / L)
 *
 * @param theta0Deg - 振れ幅（初期角度、度）
 * @param stringLengthPx - 振り子の長さ（表示ピクセル単位、LENGTH_TO_METER_DIVISORで割るとメートルになる）
 * @param gravity - 重力加速度 (m/s^2)
 * @param count - 経過フレーム数（累積カウンタ）
 * @param fps - フレームレート（省略時: DEFAULT_FPS）
 * @returns 現在の振れ角 (ラジアン)
 */
export function computePendulumAngle(
  theta0Deg: number,
  stringLengthPx: number,
  gravity: number,
  count: number,
  fps = DEFAULT_FPS
) {
  const theta0 = (theta0Deg * Math.PI) / 180;
  const lengthM = stringLengthPx / LENGTH_TO_METER_DIVISOR;
  const omega = Math.sqrt(gravity / lengthM);
  return theta0 * Math.cos(omega * (count / fps));
}

/**
 * 振り子全体がパネル内に収まるように、内部の長さ単位を表示ピクセルへ変換する倍率を計算する。
 * 縦方向は最下点（θ=0）、横方向は最大振れ幅でのおもりの位置が収まるように求め、
 * 画面が十分に大きい場合は等倍（maxScale）を上限とする。
 *
 * @param params -
 *   - `canvasHeight`: キャンバスの高さ(px)
 *   - `pivotY`: 支点のY座標(px)
 *   - `halfPanelWidth`: 支点からパネル端までの水平距離(px)
 *   - `ballRadius`: おもりの表示半径(px)
 *   - `bottomMargin`: 操作ボタン等と重ならないよう下端に確保する余白(px)（省略時: 0）
 *   - `pendulums`: 紐の長さ（内部単位）と振れ幅（度）の一覧
 *   - `maxScale`: 倍率の上限（省略時: 1）
 * @returns 表示倍率（px / 内部単位）
 */
export function computeDisplayScale({
  canvasHeight,
  pivotY,
  halfPanelWidth,
  ballRadius,
  bottomMargin = 0,
  pendulums,
  maxScale = 1
}: {
  canvasHeight: number;
  pivotY: number;
  halfPanelWidth: number;
  ballRadius: number;
  bottomMargin?: number;
  pendulums: { stringLength: number; theta0: number }[];
  maxScale?: number;
}) {
  const availableY = canvasHeight - pivotY - bottomMargin - ballRadius * 2;
  const availableX = halfPanelWidth - ballRadius * 2;
  let scale = maxScale;
  const validPendulums = pendulums.filter(
    ({ stringLength }) => stringLength > 0
  );
  for (const { stringLength, theta0 } of validPendulums) {
    const amplitude = Math.min(Math.abs(theta0), 90);
    const extentX = stringLength * Math.sin((amplitude * Math.PI) / 180);
    scale = Math.min(scale, availableY / stringLength);
    if (extentX > 0) scale = Math.min(scale, availableX / extentX);
  }
  return Math.max(scale, 0);
}
