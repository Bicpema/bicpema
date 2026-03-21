// グローバル状態管理オブジェクト
export const state = {
  /** 再生中かどうか */
  isPlaying: false,
  /** 経過時間 (s) */
  elapsedTime: 0,
  /** 加速度 (m/s²) */
  acceleration: 2.0,
  /** 電車オブジェクト */
  train: null,
  /** v-t グラフ用データ配列 */
  vtData: [],
  /** グラフ更新カウンタ */
  lastGraphUpdate: 0,
  /** v-t グラフで記録した速さの最大値（y軸上限計算用） */
  maxObservedVelocity: 0,
  /** 読み込み済みフォント */
  font: null,
  /** Chart.js インスタンス */
  graphChart: null,
};
