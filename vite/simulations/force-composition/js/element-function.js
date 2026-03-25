import { state } from "./state.js";

/**
 * F₁ の大きさスライダーが変更されたときの処理。
 */
export function onF1MagChange() {
  if (!state.f1MagInput) return;
  const val = parseFloat(state.f1MagInput.value());
  state.f1Mag = val;
  if (state.f1MagValue) state.f1MagValue.html(val.toFixed(0));
}

/**
 * F₁ の向きスライダーが変更されたときの処理。
 */
export function onF1AngleChange() {
  if (!state.f1AngleInput) return;
  const val = parseFloat(state.f1AngleInput.value());
  state.f1Angle = val;
  if (state.f1AngleValue) state.f1AngleValue.html(val.toFixed(0));
}

/**
 * F₂ の大きさスライダーが変更されたときの処理。
 */
export function onF2MagChange() {
  if (!state.f2MagInput) return;
  const val = parseFloat(state.f2MagInput.value());
  state.f2Mag = val;
  if (state.f2MagValue) state.f2MagValue.html(val.toFixed(0));
}

/**
 * F₂ の向きスライダーが変更されたときの処理。
 */
export function onF2AngleChange() {
  if (!state.f2AngleInput) return;
  const val = parseFloat(state.f2AngleInput.value());
  state.f2Angle = val;
  if (state.f2AngleValue) state.f2AngleValue.html(val.toFixed(0));
}

/**
 * リセットボタンが押されたときの処理。
 */
export function onReset() {
  state.f1Mag = 60;
  state.f1Angle = 30;
  state.f2Mag = 40;
  state.f2Angle = 120;

  if (state.f1MagInput) state.f1MagInput.value(60);
  if (state.f1AngleInput) state.f1AngleInput.value(30);
  if (state.f2MagInput) state.f2MagInput.value(40);
  if (state.f2AngleInput) state.f2AngleInput.value(120);

  if (state.f1MagValue) state.f1MagValue.html("60");
  if (state.f1AngleValue) state.f1AngleValue.html("30");
  if (state.f2MagValue) state.f2MagValue.html("40");
  if (state.f2AngleValue) state.f2AngleValue.html("120");
}

/**
 * 設定パネルの表示/非表示を切り替える処理。
 */
export function onToggleModal() {
  if (!state.settingsModal) return;
  const display = state.settingsModal.style("display");
  state.settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定パネルを閉じる処理。
 */
export function onCloseModal() {
  if (!state.settingsModal) return;
  state.settingsModal.style("display", "none");
}
