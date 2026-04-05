import { state } from "./state.js";

/** 設定モーダルの表示切り替え */
export function onToggleModal() {
  if (!state.settingsModal) return;
  const el = state.settingsModal.elt;
  el.style.display = el.style.display === "none" ? "block" : "none";
}

/** 設定モーダルを閉じる */
export function onCloseModal() {
  if (!state.settingsModal) return;
  state.settingsModal.elt.style.display = "none";
}

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
