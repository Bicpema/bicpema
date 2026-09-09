import p5 from "p5";
import { state } from "./state.js";
import { bindStartStopControls } from "../../../js/bicpema-controls-controller.js";

export const FPS = 30;

export function settingInit(p) {
  p.frameRate(FPS);
  p.textFont("sans-serif");
}

export function elementSelectInit() {
  return {
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
  bindStartStopControls(p, {
    startSelector: "#startButton",
    stopSelector: "#stopButton",
    resetSelector: "#restartButton",
    onStart: () => {
      p.userStartAudio();
      if (!state.mic) {
        state.mic = new p5.AudioIn();
        state.mic.start(() => {
          state.audioStarted = true;
        });
        state.fft = new p5.FFT();
        state.fft.setInput(state.mic);
      }
    },
    onStop: () => {
      state.paused = true;
    },
    onReset: () => {
      state.paused = false;
    },
    startAriaLabel: "音の入力開始",
    resetAriaLabel: "再開",
  });
  elements.modeSelect.addEventListener("change", (event) => {
    state.displayMode = event.target.value;
  });
}
