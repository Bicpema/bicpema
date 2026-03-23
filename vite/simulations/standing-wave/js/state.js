// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** マージン（ピクセル） */
  margin: 50,
  /** キャンバス内の有効幅 */
  innerW: 0,
  /** キャンバス内の有効高さ */
  innerH: 0,
  /** 波長（ピクセル） */
  wavelength: 200,
  /** 振幅（ピクセル） */
  A: 40,
  /** 波数 */
  k: 0,
  /** 角周波数 */
  omega: 0,
  /** 位相速度 */
  v: 0,
  /** アニメーション進行フラグ */
  running: false,
  /** 時刻 */
  t: 0,
  /** 右向き波の先端位置 */
  rightFront: 0,
  /** 左向き波の先端位置 */
  leftFront: 0,
  /** スタート/ストップボタンの参照 */
  startStopButton: null,
  /** リセットボタンの参照 */
  resetButton: null,
};
