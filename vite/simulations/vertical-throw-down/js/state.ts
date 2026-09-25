import type p5 from "p5";
import type { Ball } from "./ball.js";
import type { BallGraph } from "./graph.js";

export const state: {
  ball: Ball | null;
  font: p5.Font | null;
  ballImage: p5.Image | null;
  groundImage: p5.Image | null;
  tallBuildingImage: p5.Image | null;
  heightInput: p5.Element | null;
  initialVelocityInput: p5.Element | null;
  resetButton: p5.Element | null;
  playPauseButton: p5.Element | null;

  /** グラフオブジェクト */
  graph: BallGraph | null;
  /** v-t グラフ用データ */
  vtData: { x: number; y: number }[];
  /** y-t グラフ用データ */
  ytData: { x: number; y: number }[];
} = {
  ball: null,
  font: null,
  ballImage: null,
  groundImage: null,
  tallBuildingImage: null,
  heightInput: null,
  initialVelocityInput: null,
  resetButton: null,
  playPauseButton: null,

  graph: null,
  vtData: [],
  ytData: []
};
