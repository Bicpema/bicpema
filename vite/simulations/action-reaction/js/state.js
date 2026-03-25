// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** シミュレーションの共有状態 */
export const state = {
  /** 物体A（左側） */
  blockA: null,
  /** 物体B（右側） */
  blockB: null,
  /** ばねオブジェクト */
  spring: null,
  /** シミュレーションのフェーズ: "ready" | "releasing" | "free" */
  phase: "ready",
  /** 読み込み済みフォント */
  font: null,
  /** 地面画像 */
  groundImg: null,
  /** 物体Aの質量入力要素 */
  massAInput: null,
  /** 物体Bの質量入力要素 */
  massBInput: null,
  /** 開始ボタン要素 */
  startButton: null,
  /** リセットボタン要素 */
  resetButton: null,
  /** 設定モーダル開閉ボタン要素 */
  toggleModal: null,
  /** 設定モーダル閉じるボタン要素 */
  closeModal: null,
  /** 設定モーダル要素 */
  settingsModal: null,
};
