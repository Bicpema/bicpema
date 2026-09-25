import type p5 from "p5";
import type { Train } from "./class.js";
import { DEFAULT_ACCELERATION } from "./constants.js";

// グローバル状態管理オブジェクト
export const state: {
  /** 再生中かどうか */
  isPlaying: boolean;
  /** 経過時間 (s) */
  elapsedTime: number;
  /** 加速度 (m/s²) */
  acceleration: number;
  /** 電車オブジェクト */
  train: Train | null;
  /** v-t グラフ用データ配列 */
  vtData: { x: number; y: number }[];
  /** グラフ更新カウンタ */
  lastGraphUpdate: number;
  /** v-t グラフで記録した速さの最大値（y軸上限計算用） */
  maxObservedVelocity: number;
  /** 読み込み済みフォント */
  font: p5.Font | null;
  /** Chart.js インスタンス */
  graphChart: InstanceType<typeof import("chart.js").Chart> | null;
} = {
  isPlaying: false,
  elapsedTime: 0,
  acceleration: DEFAULT_ACCELERATION,
  train: null,
  vtData: [],
  lastGraphUpdate: 0,
  maxObservedVelocity: 0,
  font: null,
  graphChart: null
};
