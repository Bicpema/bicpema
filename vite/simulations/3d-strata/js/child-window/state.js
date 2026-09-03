// state.js は子ウィンドウ（地層データ編集画面）の共有可変状態を管理するファイルです。

export { STRATA_KINDS } from "../state.js";

export const state = {
  /** 現在のtr要素の数 */
  trNum: 0,
  /** tr要素の累計生成数 */
  trSum: 0,
  /** 現在のtr要素のidの配列 */
  idArr: [],
  /** 現在のtr要素（TRインスタンス）の配列 */
  trArr: [],
  /** 地層の追加ボタンのDOM要素の参照 */
  trAddButton: null,
};
