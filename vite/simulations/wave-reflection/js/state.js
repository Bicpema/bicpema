// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** 時刻カウンター */
  t: 0,
  /** 波数 */
  k: 0,
  /** 角周波数 */
  omega: 0,
  /** 波の速さ */
  v: 0,
  /** 振幅 */
  A: 0,
  /** 実行中かどうか */
  running: false,
  /** 反射位置のX座標 */
  reflectX: 0,
  /** 波の先端（入射波基準） */
  front: 0,
  /** 反射モード ("free" または "fixed") */
  mode: "free",
  /** スタート/ストップボタンの参照 */
  startStopButton: null,
  /** リセットボタンの参照 */
  resetButton: null,
  /** モード切り替えボタンの参照 */
  modeButton: null,
};
