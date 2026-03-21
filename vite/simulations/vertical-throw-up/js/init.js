import { state } from "./state.js";
import { onVelocityChange, onReset, onPlayPause, onToggleModal, onCloseModal } from "./element-function.js";
import { Ball } from "./ball.js";

export const FPS = 30;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.velocityInput = p.select("#velocityInput");
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

  state.velocityInput.input(() => onVelocityChange(p));
  state.resetButton.mousePressed(() => onReset(p));
  state.playPauseButton.mousePressed(() => onPlayPause(p));
  state.toggleModal.mousePressed(() => onToggleModal());
  state.closeModal.mousePressed(() => onCloseModal());
}

/**
 * キャンバス設定とシミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textFont(state.font);
  p.textSize(16);

  const initialVelocity = parseFloat(state.velocityInput.value());
  state.ball = new Ball(initialVelocity);
}
