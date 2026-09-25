import { Ball } from "./ball.js";
import { BallGraph } from "./graph.js";

export const state: {
  /** ボールクラス */
  ball: Ball | null;
  /** フォント（プリロードされたp5.Fontインスタンス） */
  font: any;
  /** ボール画像（プリロードされたp5.Imageインスタンス） */
  ballImage: any;
  /** 地面画像（プリロードされたp5.Imageインスタンス） */
  groundImage: any;
  /** 高さ入力（p.select()が返すp5.Elementインスタンス） */
  heightInput: any;
  /** 空気抵抗係数入力（p.select()が返すp5.Elementインスタンス） */
  dragCoefficientInput: any;
  /** リセットボタン（p5.Elementインスタンス） */
  resetButton: any;
  /** 開始/一時停止ボタン（p5.Elementインスタンス） */
  playPauseButton: any;
  /** グラフオブジェクト */
  graph: BallGraph | null;
  /** グラフ表示トグルボタン（p5.Elementインスタンス） */
  graphToggleButton: any;
  /** v-t グラフ用データ */
  vtData: { x: number; y: number }[];
  /** y-t グラフ用データ */
  ytData: { x: number; y: number }[];
  /** グラフ表示状態 */
  graphVisible: boolean;
} = {
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
  graphVisible: false
};
