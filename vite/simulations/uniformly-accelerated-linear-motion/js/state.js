export const state = {
  /** 車オブジェクト */
  car: null,
  /** 車の画像 */
  carImage: null,
  /** フォント */
  font: null,
  /** 地面画像 */
  groundImage: null,
  /** グラフオブジェクト */
  graph: null,
  /** グラフ表示状態 */
  graphVisible: false,
  /** v-t グラフ用データ */
  vtData: [],
  /** x-t グラフ用データ */
  xtData: [],
  /** 設定モーダル要素 */
  settingsModal: null,
  /** 初速度入力 */
  initialVelocityInput: null,
  /** 加速度入力 */
  accelerationInput: null,
  /** リセットボタン */
  resetButton: null,
  /** 再生/一時停止ボタン */
  playPauseButton: null,
  /** 設定トグルボタン */
  toggleModal: null,
  /** モーダルを閉じるボタン */
  closeModal: null,
  /** グラフトグルボタン */
  graphToggleButton: null,
  /** 等時間マーカー表示チェックボックス */
  showMarkersCheckBox: null,
};
