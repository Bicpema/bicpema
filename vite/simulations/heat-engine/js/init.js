import { state } from "./state.js";
import { PISTON_Y_TOP } from "./constants.js";

export function elementPositionInit(p) {
  state.pistonY = PISTON_Y_TOP;
  const playButton = document.querySelector("#playButton");
  const resetButton = document.querySelector("#resetButton");
  if (playButton && !playButton.dataset.bound) {
    playButton.dataset.bound = "true";
    playButton.addEventListener("click", () => {
      state.isPlaying = !state.isPlaying;
      playButton.textContent = state.isPlaying ? "一時停止" : "再開";
    });
    resetButton.addEventListener("click", () => {
      state.stage = 0;
      state.t = 0;
      state.pistonY = PISTON_Y_TOP;
      state.weightOn = true;
      state.isPlaying = true;
      playButton.textContent = "一時停止";
    });
  }
}
