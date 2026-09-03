// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** おもりの画像 */
  weightImage: null,
  /** おもりの表示半径 */
  radi: 0,
  /** 再生中かどうか */
  clickedCount: false,
  /** グリッド線を表示するかどうか */
  gridIs: false,
  /** 重力加速度 (m/s^2) */
  gravity: 9.8,
  /** 経過フレーム数（累積カウンタ） */
  count: 0,
  /** 左の振り子 */
  leftPendulum: null,
  /** 右の振り子 */
  rightPendulum: null,

  /** スタートボタンの参照 */
  startButton: null,
  /** ストップボタンの参照 */
  stopButton: null,
  /** リセットボタンの参照 */
  resetButton: null,
  /** グリッド表示ボタンの参照 */
  gridButton: null,
  /** 左の振れ角度入力の参照 */
  leftAngleInput: null,
  /** 左の紐の長さ入力の参照 */
  leftLengthInput: null,
  /** 右の振れ角度入力の参照 */
  rightAngleInput: null,
  /** 右の紐の長さ入力の参照 */
  rightLengthInput: null,
};
