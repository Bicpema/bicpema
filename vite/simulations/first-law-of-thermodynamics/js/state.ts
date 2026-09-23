// state.js はシミュレーションの共有可変状態を管理するファイルです。

import { PISTON_INIT_X, CYL_LEFT } from "./constants.js";

export const state = {
  /** ピストンのX座標 */
  pistonX: PISTON_INIT_X,
  /** ピストンの目標X座標 */
  pistonX_target: PISTON_INIT_X,
  /** 気体の幅 */
  gasWidth: PISTON_INIT_X - CYL_LEFT,
  /** 分子の配列 */
  molecules: [],
  /** 分子の数 */
  N: 40,
  /** 基準温度 */
  T0: 1.5,
  /** 現在の温度 */
  T: 1.5,
  /** Qのステップ数 (0〜5) */
  step: 0,
  /** 加えた熱量 */
  Q: 0,
  /** 気体がした仕事 */
  W: 0,
  /** 内部エネルギー変化量 */
  dU: 0,
  /** 炎の画像 */
  img_flame: null
};
