// state.js はシミュレーションの共有可変状態を管理するファイルです。

import { ORIGIN_X, SOUND_SPEED } from "./constants.js";

export const state = {
  /** 音源の X 座標 */
  posx: ORIGIN_X,
  /** 音源の Y 座標 */
  posy: 0,
  /** フレームカウント */
  count: 0,
  /** 音波オブジェクトの配列 */
  sounds: [],
  /** シミュレーションが実行中かどうか */
  clickedCount: false,
  /** 音源の速度（m/s） */
  speedValue: SOUND_SPEED,
};
