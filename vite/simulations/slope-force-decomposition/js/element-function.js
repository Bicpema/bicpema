import { state } from "./state.js";

/** 斜面角度スライダーの変更ハンドラー */
export function onSlopeAngleChange() {
  if (!state.slopeAngleInput) return;
  state.slopeAngle = parseFloat(state.slopeAngleInput.value());
  if (state.slopeAngleValue)
    state.slopeAngleValue.html(`${state.slopeAngle.toFixed(0)}°`);
}

/** 質量スライダーの変更ハンドラー */
export function onMassChange() {
  if (!state.massInput) return;
  state.mass = parseFloat(state.massInput.value());
  if (state.massValue) state.massValue.html(`${state.mass.toFixed(0)} kg`);
}
