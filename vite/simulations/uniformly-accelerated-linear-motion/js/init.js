import { state } from "./state.js";
import { Car } from "./car.js";
import { MotionGraph } from "./graph.js";
import { FPS, DEFAULT_TEXT_SIZE } from "./constants.js";
import { onReset, onPlayPause } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/**
 * DOM要素をstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.initialVelocityInput = p.select("#initialVelocityInput");
  state.accelerationInput = p.select("#accelerationInput");
  state.showMarkersCheckBox = p.select("#showMarkersCheckBox");

  const { toggleButton, resetButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset,
  });
  state.playPauseButton = toggleButton;
  state.resetButton = resetButton;

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
}

/**
 * シミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) p.textFont(state.font);
  p.textSize(DEFAULT_TEXT_SIZE);

  const v0 = parseFloat(state.initialVelocityInput.value());
  const a = parseFloat(state.accelerationInput.value());
  state.car = new Car(v0, a);
  state.graph = new MotionGraph();
}
