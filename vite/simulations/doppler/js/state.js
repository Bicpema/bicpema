// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** 音源の X 座標 */
  posx: 50,
  /** 音源の Y 座標 */
  posy: 0,
  /** フレームカウント */
  count: 0,
  /** 音波オブジェクトの配列 */
  sounds: [],
  /** シミュレーションが実行中かどうか */
  clickedCount: false,
  /** 音源の速度（m/s） */
  speedValue: 340,
};
