import { WAVE_ORIGIN_X } from "./constants.js";

export interface Particle {
  x0: number;
}

export const state = {
  particles: [] as Particle[],
  N: 80,
  A: 40,
  lambda: 200,
  k: 0,
  omega: 0.1,
  t: 0,
  running: false,
  focusIndex: 0,
  xStart: WAVE_ORIGIN_X
};
