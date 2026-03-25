import { state } from "./state.js";
import { FPS } from "./constants.js";
import {
  onF1MagChange,
  onF1AngleChange,
  onF2MagChange,
  onF2AngleChange,
  onReset,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する。
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.f1MagInput = p.select("#f1MagInput");
  state.f1AngleInput = p.select("#f1AngleInput");
  state.f2MagInput = p.select("#f2MagInput");
  state.f2AngleInput = p.select("#f2AngleInput");
  state.f1MagValue = p.select("#f1MagValue");
  state.f1AngleValue = p.select("#f1AngleValue");
  state.f2MagValue = p.select("#f2MagValue");
  state.f2AngleValue = p.select("#f2AngleValue");
  state.resetButton = p.select("#resetButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

  if (state.f1MagInput) state.f1MagInput.input(() => onF1MagChange());
  if (state.f1AngleInput) state.f1AngleInput.input(() => onF1AngleChange());
  if (state.f2MagInput) state.f2MagInput.input(() => onF2MagChange());
  if (state.f2AngleInput) state.f2AngleInput.input(() => onF2AngleChange());
  if (state.resetButton) state.resetButton.mousePressed(() => onReset());
  if (state.toggleModal) state.toggleModal.mousePressed(() => onToggleModal());
  if (state.closeModal) state.closeModal.mousePressed(() => onCloseModal());
}

/**
 * キャンバス設定とシミュレーションの初期値を設定する。
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) {
    p.textFont(state.font);
  }
  p.textSize(16);
}
