import { state } from "./state.js";

export function onPlayPause() {
  state.isPlaying = !state.isPlaying;
  updatePlayPauseButton();
}

function updatePlayPauseButton() {
  const btn = document.getElementById("playPauseButton");
  if (!btn) return;
  if (state.isPlaying) {
    btn.textContent = "⏸ 一時停止";
    btn.className = "btn btn-warning";
  } else {
    btn.textContent = "▶ 再開";
    btn.className = "btn btn-success";
  }
}

export function onReset() {
  state.stage = 0;
  state.weightOn = true;
  state.t = 0;
  state.pistonY = 160;
  state.isPlaying = true;
  updatePlayPauseButton();
}
