import { state } from "./state.js";
import {
  onHeightChange,
  onVelocityChange,
  onReset,
  onPlayPause,
} from "./element-function.js";
import { Ball } from "./ball.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export const FPS = 30;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.heightInput = p.select("#heightInput");
  state.velocityInput = p.select("#velocityInput");
  state.heightInput.input(() => onHeightChange());
  state.velocityInput.input(() => onVelocityChange());

  const { toggleButton, resetButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: () => onPlayPause(),
    onReset: () => onReset(),
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
 * キャンバス設定とシミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont(state.font);
  p.textSize(16);

  const initialHeight = parseFloat(state.heightInput.value());
  const initialVelocity = parseFloat(state.velocityInput.value());
  state.ball = new Ball(initialHeight, initialVelocity);
}
