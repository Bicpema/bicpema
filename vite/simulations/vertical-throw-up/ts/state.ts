import type p5 from "p5";
import type { Ball } from "./ball.js";

export const state: {
  ball: Ball | null;
  font: p5.Font | null;
  ballImage: p5.Image | null;
  groundImage: p5.Image | null;
  velocityInput: p5.Element | null;
  resetButton: p5.Element | null;
  playPauseButton: p5.Element | null;
} = {
  ball: null,
  font: null,
  ballImage: null,
  groundImage: null,
  velocityInput: null,
  resetButton: null,
  playPauseButton: null
};
