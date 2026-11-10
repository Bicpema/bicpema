// state.ts はシミュレーションの共有可変状態を管理するファイルです。

import { Train } from "./class.js";
import { DEFAULT_ACCELERATION } from "./constants.js";

/** v-tグラフの1点 */
export interface VtPoint {
  x: number;
  y: number;
}

/** シミュレーションの共有状態 */
export const state: {
  /** 再生中かどうか */
  isPlaying: boolean;
  /** 加速度 (m/s²) */
  acceleration: number;
  /** 再生開始からの更新ステップ数（経過時間 = stepCount / FPS。誤差を累積させない） */
  stepCount: number;
  /** 一時停止中に再描画が必要かどうか（設定変更・リセット・リサイズ時にtrue） */
  needsRedraw: boolean;
  /** 電車 */
  train: Train;
  /** v-tグラフ用データ（ChartLineが参照を保持する） */
  vtData: VtPoint[];
} = {
  isPlaying: false,
  acceleration: DEFAULT_ACCELERATION,
  stepCount: 0,
  needsRedraw: true,
  train: new Train(),
  vtData: [{ x: 0, y: 0 }]
};
