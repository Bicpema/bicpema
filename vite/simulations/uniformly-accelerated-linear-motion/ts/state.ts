import type { Car } from "./car.js";
import type { MotionGraph } from "./graph.js";

export const state: {
  /** 車オブジェクト */
  car: Car | null;
  /** 車の画像 */
  carImage: p5.Image | null;
  /** フォント */
  font: p5.Font | null;
  /** 地面画像 */
  groundImage: p5.Image | null;
  /** グラフオブジェクト */
  graph: MotionGraph | null;
  /** グラフ表示状態 */
  graphVisible: boolean;
  /** v-t グラフ用データ */
  vtData: { x: number; y: number }[];
  /** x-t グラフ用データ */
  xtData: { x: number; y: number }[];
  /** 初速度入力 */
  initialVelocityInput: p5.Element | null;
  /** 加速度入力 */
  accelerationInput: p5.Element | null;
  /** リセットボタン */
  resetButton: p5.Element | null;
  /** 再生/一時停止ボタン */
  playPauseButton: p5.Element | null;
  /** グラフトグルボタン */
  graphToggleButton: p5.Element | null;
  /** 等時間マーカー表示チェックボックス */
  showMarkersCheckBox: p5.Element | null;
} = {
  car: null,
  carImage: null,
  font: null,
  groundImage: null,
  graph: null,
  graphVisible: true,
  vtData: [],
  xtData: [],
  initialVelocityInput: null,
  accelerationInput: null,
  resetButton: null,
  playPauseButton: null,
  graphToggleButton: null,
  showMarkersCheckBox: null
};
