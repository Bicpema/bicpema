import { state } from "./state.js";
import { FPS } from "./constants.js";
import {
  onToggleModal,
  onCloseModal,
  onSlopeAngleChange,
  onMassChange,
  onModeXY,
  onModeSlope,
} from "./element-function.js";

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する。
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.settingsModal = p.select("#settingsModal");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.slopeAngleInput = p.select("#slopeAngleInput");
  state.slopeAngleValue = p.select("#slopeAngleValue");
  state.massInput = p.select("#massInput");
  state.massValue = p.select("#massValue");
  state.modeXYButton = p.select("#modeXYButton");
  state.modeSlopeButton = p.select("#modeSlopeButton");

  if (state.toggleModal) state.toggleModal.mousePressed(() => onToggleModal());
  if (state.closeModal) state.closeModal.mousePressed(() => onCloseModal());
  if (state.slopeAngleInput)
    state.slopeAngleInput.input(() => onSlopeAngleChange());
  if (state.massInput) state.massInput.input(() => onMassChange());
  if (state.modeXYButton) state.modeXYButton.mousePressed(() => onModeXY(p));
  if (state.modeSlopeButton)
    state.modeSlopeButton.mousePressed(() => onModeSlope(p));
}

/**
 * キャンバス設定と初期値を設定する。
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) {
    p.textFont(state.font);
  }
  p.textSize(16);
  syncUIFromState();
}

/**
 * state の値を UI スライダーに反映する。
 */
export function syncUIFromState() {
  if (state.slopeAngleInput) state.slopeAngleInput.value(state.slopeAngle);
  if (state.slopeAngleValue)
    state.slopeAngleValue.html(`${state.slopeAngle.toFixed(0)}°`);
  if (state.massInput) state.massInput.value(state.mass);
  if (state.massValue) state.massValue.html(`${state.mass.toFixed(0)} kg`);
}
