// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** おもりの画像 */
  weightImage: null,
  /** 振り子の長さ一覧（CSV読み込み結果） */
  pendulumData: null,
  /** 振り子（Ball）の配列 */
  balls: [],
  /** 重力加速度 (m/s^2) */
  gravity: 9.8,
  /** 経過フレーム数（累積カウンタ） */
  count: 0,
};
