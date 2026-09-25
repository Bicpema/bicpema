import type p5 from "p5";
import type { Boat, Person, WaterParticle } from "./boat.js";

export const state: {
  boat: Boat | null;
  waterParticles: WaterParticle[];
  person: Person | null;
  font: p5.Font | null;
  boatSpeedInput: p5.Element | null;
  riverSpeedInput: p5.Element | null;
  boatSpeedValue: p5.Element | null;
  riverSpeedValue: p5.Element | null;
  resetButton: p5.Element | null;
  playPauseButton: p5.Element | null;
} = {
  boat: null,
  waterParticles: [],
  person: null,
  font: null,
  boatSpeedInput: null,
  riverSpeedInput: null,
  boatSpeedValue: null,
  riverSpeedValue: null,
  resetButton: null,
  playPauseButton: null
};
