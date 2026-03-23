// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const N = 80;
export const A = 40;
export const LAMBDA = 200;
export const OMEGA = 0.1;
export const X_START = 60;

export const state = {
  /** 粒子の配列 */
  particles: [],
  /** 波数 */
  k: 0,
  /** 経過フレーム数 */
  t: 0,
  /** アニメーション実行中かどうか */
  running: false,
  /** 注目する粒子のインデックス */
  focusIndex: Math.floor(N / 2),
  /** スタート／ストップボタンの参照 */
  startStopButton: null,
  /** リセットボタンの参照 */
  resetButton: null,
  /** 速度スライダーの参照 */
  timesSlider: null,
};
