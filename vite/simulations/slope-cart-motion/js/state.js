// グローバル状態管理オブジェクト
export const state = {
  /** 再生中かどうか */
  isPlaying: false,
  /** 記録テープのマーク（各記録時刻の変位 m） */
  tapeMarks: [],
  /** 斜面角度 (度) */
  slopeDeg: 20,
  /** 記録間隔 (s) */
  recInterval: 0.1,
  /** グラフ Chart.js インスタンス */
  graphChart: null,
  /** 台車画像 */
  cartImage: null,
  /** 地面画像 */
  groundImage: null,
  /** 台車オブジェクト */
  cart: null,
  /** リセットボタン */
  resetButton: null,
  /** 再生/停止ボタン */
  playPauseButton: null,
  /** 設定モーダル表示ボタン */
  toggleModal: null,
  /** 設定モーダル閉じるボタン */
  closeModal: null,
  /** 設定モーダル要素 */
  settingsModal: null,
  /** 角度入力 */
  angleInput: null,
  /** 記録間隔入力 */
  intervalInput: null,
  /** 読み込み済みフォント */
  font: null,
};
