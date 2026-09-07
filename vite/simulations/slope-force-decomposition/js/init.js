import { state } from "./state.js";
import { FPS, LABEL_FONT_SIZE } from "./constants.js";
import { onSlopeAngleChange, onMassChange } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する。
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.slopeAngleInput = p.select("#slopeAngleInput");
  state.slopeAngleValue = p.select("#slopeAngleValue");
  state.massInput = p.select("#massInput");
  state.massValue = p.select("#massValue");

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
  if (state.slopeAngleInput)
    state.slopeAngleInput.input(() => onSlopeAngleChange());
  if (state.massInput) state.massInput.input(() => onMassChange());
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
  p.textSize(LABEL_FONT_SIZE);
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
