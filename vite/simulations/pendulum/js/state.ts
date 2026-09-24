// state.ts はシミュレーションの共有可変状態を管理するファイルです。

import { GRAVITY } from "./constants.js";
import type { Ball } from "./class.js";

export const state: {
  /** おもりの画像 */
  weightImage: p5.Image | null;
  /** おもりの表示半径 */
  radi: number;
  /** 再生中かどうか */
  clickedCount: boolean;
  /** グリッド線を表示するかどうか */
  gridIs: boolean;
  /** 重力加速度 (m/s^2) */
  gravity: number;
  /** 経過フレーム数（累積カウンタ） */
  count: number;
  /** 左の振り子 */
  leftPendulum: Ball | null;
  /** 右の振り子 */
  rightPendulum: Ball | null;

  /** スタートボタンの参照 */
  startButton: p5.Element | null;
  /** ストップボタンの参照 */
  stopButton: p5.Element | null;
  /** リセットボタンの参照 */
  resetButton: p5.Element | null;
  /** グリッド表示ボタンの参照 */
  gridButton: p5.Element | null;
  /** 左の振れ角度入力の参照 */
  leftAngleInput: p5.Element | null;
  /** 左の紐の長さ入力の参照 */
  leftLengthInput: p5.Element | null;
  /** 右の振れ角度入力の参照 */
  rightAngleInput: p5.Element | null;
  /** 右の紐の長さ入力の参照 */
  rightLengthInput: p5.Element | null;
} = {
  weightImage: null,
  radi: 0,
  clickedCount: false,
  gridIs: false,
  gravity: GRAVITY,
  count: 0,
  leftPendulum: null,
  rightPendulum: null,

  startButton: null,
  stopButton: null,
  resetButton: null,
  gridButton: null,
  leftAngleInput: null,
  leftLengthInput: null,
  rightAngleInput: null,
  rightLengthInput: null
};
