import p5 from "p5";
import { state } from "./state.js";

export const FPS = 30;

export function settingInit(p) {
  p.frameRate(FPS);
  p.textFont("sans-serif");
}

export function elementSelectInit() {
  return {
    startButton: document.querySelector("#startButton"),
    stopButton: document.querySelector("#stopButton"),
    restartButton: document.querySelector("#restartButton"),
    modeSelect: document.querySelector("#modeSelect"),
  };
}

export function elementPositionInit() {}

export function valueInit() {
  state.audioStarted = false;
  state.paused = false;
  state.displayMode = "waveform";
  state.waveform = [];
  state.spectrum = [];
}

export function setupControls(p, elements) {
  elements.startButton.addEventListener("click", () => {
    p.userStartAudio();
    if (!state.mic) {
      state.mic = new p5.AudioIn();
      state.mic.start(() => {
        state.audioStarted = true;
      });
      state.fft = new p5.FFT();
      state.fft.setInput(state.mic);
    }
  });
  elements.stopButton.addEventListener("click", () => {
    state.paused = true;
  });
  elements.restartButton.addEventListener("click", () => {
    state.paused = false;
  });
  elements.modeSelect.addEventListener("change", (event) => {
    state.displayMode = event.target.value;
  });
}
