import type p5 from "p5";
import type { Cart } from "./class.js";

// グローバル状態管理オブジェクト
export const state = {
  /** 台車オブジェクト（init()で生成するまでnull） */
  cart: null as Cart | null,
  /** 読み込み済みフォント */
  font: null as p5.Font | null,
  /** 地面画像（読み込み完了までnull） */
  groundImg: null as p5.Image | null,
  /** 台車画像（読み込み完了までnull） */
  cartImg: null as p5.Image | null,
  /** 台車の上からドラッグが開始されているか */
  isDraggingFromCart: false,
  /** 質量入力要素（p.select()で取得するまではnull） */
  massInput: null as p5.Element | null,
  /** リセットボタン要素（p.select()で取得するまではnull） */
  resetButton: null as p5.Element | null,
  /** 最大値クリアボタン要素（p.select()で取得するまではnull） */
  clearMaxButton: null as p5.Element | null
};
