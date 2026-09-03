// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  // 操作パネルの仮想DOM要素
  backgroundDiv: null,
  startButton: null,
  stopButton: null,
  resetButton: null,
  ballExpla1: null,
  ballExpla2: null,
  speedExpla: null,
  speedButton1: null,
  speedButton2: null,
  angleExpla: null,
  angleButton1: null,
  angleButton2: null,
  weightExpla: null,
  weightButton1: null,
  weightButton2: null,
  heightExpla: null,
  heightButton1: null,
  heightButton2: null,
  konstantExpla: null,
  konstantButton1: null,
  konstantButton2: null,

  /** ヘッダー分(NAV_HEIGHT固定)を除いた、実際に使用できる高さ */
  usableHeight: 0,
  /** ボールの半径 */
  radi: 0,
  /** 軌跡を描画するオフスクリーングラフィックス */
  pg: null,

  /** 経過フレーム数に対応するカウンタ（再生中は毎フレーム10ずつ加算） */
  count: 0,
  /** スタートボタンが押され再生中かどうか */
  clickedCount: false,
  /** リセット直後かどうか */
  resetCount: true,
  /** 赤玉 */
  b1: null,
  /** 青玉 */
  b2: null,
};
