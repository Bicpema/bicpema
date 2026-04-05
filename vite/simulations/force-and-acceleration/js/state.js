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
  /** 設定モーダル開閉ボタン要素 */
  toggleModal: null,
  /** 設定モーダル閉じるボタン要素 */
  closeModal: null,
  /** 設定モーダル要素 */
  settingsModal: null,
};
