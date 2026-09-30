// state.ts はシミュレーションの共有可変状態を管理するファイルです。

import { GRAVITY } from "./constants.js";
import type { Ball } from "./class.js";

export const state = {
  /** おもりの画像 */
  weightImage: null as p5.Image | null,
  /** 振り子の長さ一覧（CSV読み込み結果） */
  pendulumData: null as p5.Table | null,
  /** 振り子（Ball）の配列 */
  balls: [] as Ball[],
  /** 重力加速度 (m/s^2) */
  gravity: GRAVITY,
  /** 経過フレーム数（累積カウンタ） */
  count: 0
};
