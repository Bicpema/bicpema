import { state } from "./state.js";
import { PISTON_Y_TOP } from "./constants.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

function onPlayPause() {
  state.isPlaying = !state.isPlaying;
  state.playButton.html(state.isPlaying ? "一時停止" : "再開");
}

function onReset() {
  state.stage = 0;
  state.t = 0;
  state.pistonY = PISTON_Y_TOP;
  state.weightOn = true;
  state.isPlaying = true;
  state.playButton.html("一時停止");
}

export function elementPositionInit(p) {
  state.pistonY = PISTON_Y_TOP;

  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#playButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset
  });
  state.playButton = toggleButton;
}
