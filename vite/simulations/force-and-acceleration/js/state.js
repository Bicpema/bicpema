// グローバル状態管理オブジェクト
export const state = {
  /** 台車オブジェクト */
  cart: null,
  /** 読み込み済みフォント */
  font: null,
  /** 地面画像 */
  groundImg: null,
  /** 台車画像 */
  cartImg: null,
  /** 台車の上からドラッグが開始されているか */
  isDraggingFromCart: false,
  /** 質量入力要素 */
  massInput: null,
  /** リセットボタン要素 */
  resetButton: null,
  /** 最大値クリアボタン要素 */
  clearMaxButton: null
};
