import { state } from "./state.js";
import { syncUIFromState } from "./init.js";
import { MAX_FORCE, GRAVITY } from "./constants.js";

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

/** 力の大きさスライダーの変更ハンドラ */
export function onMagnitudeChange() {
  if (!state.magnitudeInput) return;
  state.forceMag = parseFloat(state.magnitudeInput.value());
  if (state.magnitudeValue)
    state.magnitudeValue.html(`${state.forceMag.toFixed(0)} N`);
}

/** 力の角度スライダーの変更ハンドラ */
export function onAngleChange() {
  if (!state.angleInput) return;
  state.forceAngle = parseFloat(state.angleInput.value());
  if (state.angleValue)
    state.angleValue.html(`${state.forceAngle.toFixed(0)}°`);
}

/** 斜面角度スライダーの変更ハンドラ */
export function onSlopeAngleChange() {
  if (!state.slopeAngleInput) return;
  state.slopeAngle = parseFloat(state.slopeAngleInput.value());
  if (state.slopeAngleValue)
    state.slopeAngleValue.html(`${state.slopeAngle.toFixed(0)}°`);
}

/** 質量スライダーの変更ハンドラ */
export function onMassChange() {
  if (!state.massInput) return;
  state.mass = parseFloat(state.massInput.value());
  if (state.massValue) state.massValue.html(`${state.mass.toFixed(0)} kg`);
}

/**
 * XY分解モードに切り替える。
 * @param {p5} p p5インスタンス
 */
export function onModeXY(p) {
  state.mode = "xy";
  updateModeButtons();
  showXYControls();
}

/**
 * 斜面分解モードに切り替える。
 * @param {p5} p p5インスタンス
 */
export function onModeSlope(p) {
  state.mode = "slope";
  updateModeButtons();
  showSlopeControls();
}

/** モードボタンのスタイルを更新する。 */
function updateModeButtons() {
  if (state.modeXYButton) {
    state.modeXYButton.elt.classList.toggle("btn-primary", state.mode === "xy");
    state.modeXYButton.elt.classList.toggle(
      "btn-outline-secondary",
      state.mode !== "xy"
    );
  }
  if (state.modeSlopeButton) {
    state.modeSlopeButton.elt.classList.toggle(
      "btn-primary",
      state.mode === "slope"
    );
    state.modeSlopeButton.elt.classList.toggle(
      "btn-outline-secondary",
      state.mode !== "slope"
    );
  }
}

/** XY分解モードの設定項目を表示する。 */
function showXYControls() {
  const xyGroup = document.getElementById("xyControls");
  const slopeGroup = document.getElementById("slopeControls");
  if (xyGroup) xyGroup.style.display = "block";
  if (slopeGroup) slopeGroup.style.display = "none";
}

/** 斜面分解モードの設定項目を表示する。 */
function showSlopeControls() {
  const xyGroup = document.getElementById("xyControls");
  const slopeGroup = document.getElementById("slopeControls");
  if (xyGroup) xyGroup.style.display = "none";
  if (slopeGroup) slopeGroup.style.display = "block";
}
