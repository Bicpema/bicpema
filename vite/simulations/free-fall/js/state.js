export const state = {
  /** ボールクラス */
  ball: null,
  /** フォント */
  font: null,
  /** ボール画像 */
  ballImage: null,
  /** 地面画像 */
  groundImage: null,
  /** 高さ入力 */
  heightInput: null,
  /** 空気抵抗係数入力 */
  dragCoefficientInput: null,
  /** リセットボタン */
  resetButton: null,
  /** 開始/一時停止ボタン */
  playPauseButton: null,

  /** グラフオブジェクト */
  graph: null,
  /** グラフ表示トグルボタン */
  graphToggleButton: null,
  /** v-t グラフ用データ */
  vtData: [],
  /** y-t グラフ用データ */
  ytData: [],
  /** グラフ表示状態 */
  graphVisible: false,
};
