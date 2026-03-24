import { state } from "./state.js";
import {
  onHeightChange,
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";
import { Ball } from "./ball.js";

export const FPS = 30;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.heightInput = p.select("#heightInput");
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

  state.heightInput.input(() => onHeightChange());
  state.resetButton.mousePressed(() => onReset());
  state.playPauseButton.mousePressed(() => onPlayPause());
  state.toggleModal.mousePressed(() => onToggleModal());
  state.closeModal.mousePressed(() => onCloseModal());
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
  state.ball = new Ball(initialHeight, 0);
}
