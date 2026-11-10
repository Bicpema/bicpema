import type { Ball } from "./ball.js";

export const state: {
  ball: Ball | null;
  ballImage: p5.Image | null;
  groundImage: p5.Image | null;
  heightInput: p5.Element | null;
  velocityInput: p5.Element | null;
  resetButton: p5.Element | null;
  playPauseButton: p5.Element | null;
} = {
  ball: null,
  ballImage: null,
  groundImage: null,
  heightInput: null,
  velocityInput: null,
  resetButton: null,
  playPauseButton: null
};
