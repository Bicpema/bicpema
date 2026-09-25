import type p5 from "p5";
import type { Chart } from "chart.js";
import type { SlopeCart } from "./slope-cart.js";

// グローバル状態管理オブジェクト
export const state = {
  /** 再生中かどうか */
  isPlaying: false,
  /** 記録テープのマーク（各記録時刻の変位 m） */
  tapeMarks: [] as number[],
  /** 斜面角度 (度) */
  slopeDeg: 20,
  /** 記録間隔 (s) */
  recInterval: 0.1,
  /** グラフ Chart.js インスタンス（動的import・生成前はnull） */
  graphChart: null as Chart<"scatter"> | null,
  /** 台車画像（読み込み完了までnull） */
  cartImage: null as p5.Image | null,
  /** 地面画像（読み込み完了までnull） */
  groundImage: null as p5.Image | null,
  /** 台車オブジェクト（init()で生成するまでnull） */
  cart: null as SlopeCart | null,
  /** リセットボタン（p.select()で取得するまではnull） */
  resetButton: null as p5.Element | null,
  /** 再生/停止ボタン（p.select()で取得するまではnull） */
  playPauseButton: null as p5.Element | null,
  /** 角度入力（p.select()で取得するまではnull） */
  angleInput: null as p5.Element | null,
  /** 記録間隔入力（p.select()で取得するまではnull） */
  intervalInput: null as p5.Element | null,
  /** 読み込み済みフォント */
  font: null as p5.Font | null,
  /** v-tグラフの表示/非表示 */
  graphVisible: false,
  /** v-tグラフの記録データ点 */
  vtData: [] as { x: number; y: number }[]
};
