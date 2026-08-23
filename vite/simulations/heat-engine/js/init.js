import { state } from "./state.js";

export function elementPositionInit(p) {
  state.pistonY = 160;
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
      state.pistonY = 160;
      state.weightOn = true;
      state.isPlaying = true;
      playButton.textContent = "一時停止";
    });
  }
}
