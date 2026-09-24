// state.js はシミュレーションの共有可変状態を管理するファイルです。

import type { Ball } from "./class.js";

export const state: {
  // 操作パネルの仮想DOM要素
  backgroundDiv: p5.Element | null;
  startButton: p5.Element | null;
  stopButton: p5.Element | null;
  resetButton: p5.Element | null;
  ballExpla1: p5.Element | null;
  ballExpla2: p5.Element | null;
  speedExpla: p5.Element | null;
  speedButton1: p5.Element | null;
  speedButton2: p5.Element | null;
  angleExpla: p5.Element | null;
  angleButton1: p5.Element | null;
  angleButton2: p5.Element | null;
  weightExpla: p5.Element | null;
  weightButton1: p5.Element | null;
  weightButton2: p5.Element | null;
  heightExpla: p5.Element | null;
  heightButton1: p5.Element | null;
  heightButton2: p5.Element | null;
  konstantExpla: p5.Element | null;
  konstantButton1: p5.Element | null;
  konstantButton2: p5.Element | null;

  /** ヘッダー分(NAV_HEIGHT固定)を除いた、実際に使用できる高さ */
  usableHeight: number;
  /** ボールの半径 */
  radi: number;
  /** 軌跡を描画するオフスクリーングラフィックス */
  pg: p5.Graphics | null;

  /** 経過フレーム数に対応するカウンタ（再生中は毎フレーム10ずつ加算） */
  count: number;
  /** スタートボタンが押され再生中かどうか */
  clickedCount: boolean;
  /** リセット直後かどうか */
  resetCount: boolean;
  /** 赤玉 */
  b1: Ball | null;
  /** 青玉 */
  b2: Ball | null;
} = {
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

  usableHeight: 0,
  radi: 0,
  pg: null,

  count: 0,
  clickedCount: false,
  resetCount: true,
  b1: null,
  b2: null
};
