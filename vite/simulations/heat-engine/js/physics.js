import { PISTON_Y_TOP, PISTON_Y_MID, PISTON_Y_BOTTOM } from "./constants.js";

/**
 * 熱機関サイクル（4段階）における、経過時間に応じたピストンの高さを計算する。
 * stage 0: 加熱・おもりを持ち上げる (PISTON_Y_TOP→PISTON_Y_MID)
 * stage 1: おもりを取り除く (PISTON_Y_MID→PISTON_Y_BOTTOM)
 * stage 2: 放熱して戻す (PISTON_Y_BOTTOM→PISTON_Y_MID)
 * stage 3: 元の状態に戻る (PISTON_Y_MID→PISTON_Y_TOP)
 *
 * @param {number} stage 現在のサイクル段階 (0〜3)
 * @param {number} t 段階内の経過フレーム数
 * @param {number} duration 各段階の所要フレーム数
 * @returns {number} ピストンのY座標
 */
export function computePistonY(stage, t, duration) {
  const ratio = t / duration;
  if (stage === 0) return lerp(PISTON_Y_TOP, PISTON_Y_MID, ratio);
  if (stage === 1) return lerp(PISTON_Y_MID, PISTON_Y_BOTTOM, ratio);
  if (stage === 2) return lerp(PISTON_Y_BOTTOM, PISTON_Y_MID, ratio);
  if (stage === 3) return lerp(PISTON_Y_MID, PISTON_Y_TOP, ratio);
  return PISTON_Y_TOP;
}

/**
 * サイクルの段階を次に進める（3の次は0に戻る）。
 * @param {number} stage 現在の段階
 * @returns {number} 次の段階
 */
export function advanceStage(stage) {
  return (stage + 1) % 4;
}

/**
 * 線形補間を行う。
 * @param {number} a 開始値
 * @param {number} b 終了値
 * @param {number} t 補間係数 (0〜1)
 * @returns {number}
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}
