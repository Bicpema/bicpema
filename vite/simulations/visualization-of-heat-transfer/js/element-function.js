import { state } from "./state.js";

export function onReset() {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
  state.moveIs = false;
  if (state.playPauseButton) state.playPauseButton.html("開始");
}

export function onPlayPause() {
  state.moveIs = !state.moveIs;
  if (state.playPauseButton) {
    state.playPauseButton.html(state.moveIs ? "一時停止" : "再開");
  }
}

export function onToggleModal() {
  if (!state.settingsModal) return;
  const display = state.settingsModal.style("display");
  state.settingsModal.style("display", display === "none" ? "block" : "none");
}

export function onCloseModal() {
  if (state.settingsModal) state.settingsModal.style("display", "none");
}

export function onSettingsChange() {
  if (state.tHot0Input) {
    const val = parseFloat(state.tHot0Input.value());
    if (!isNaN(val) && val > 0) state.Thot0 = val;
  }
  if (state.tCold0Input) {
    const val = parseFloat(state.tCold0Input.value());
    if (!isNaN(val) && val >= 0) state.Tcold0 = val;
  }
  if (state.kInput) {
    const val = parseFloat(state.kInput.value());
    if (!isNaN(val) && val > 0) state.k = val;
  }
  state.Teq =
    (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) /
    (state.C_hot + state.C_cold);
  onReset();
}

export function onContactModeChange() {
  if (!state.contactModeInput) return;
  state.contactMode = state.contactModeInput.value() === "1";
  if (!state.contactMode) onReset();
}
