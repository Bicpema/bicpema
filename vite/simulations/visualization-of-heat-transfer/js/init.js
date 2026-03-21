import { state } from "./state.js";
import {
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
  onSettingsChange,
  onContactModeChange,
} from "./element-function.js";

export const FPS = 20;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.contactModeInput = p.select("#contactModeInput");
  state.tHot0Input = p.select("#tHot0Input");
  state.tCold0Input = p.select("#tCold0Input");
  state.kInput = p.select("#kInput");
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

  if (state.resetButton) state.resetButton.mousePressed(onReset);
  if (state.playPauseButton) state.playPauseButton.mousePressed(onPlayPause);
  if (state.toggleModal) state.toggleModal.mousePressed(onToggleModal);
  if (state.closeModal) state.closeModal.mousePressed(onCloseModal);
  if (state.tHot0Input) state.tHot0Input.input(onSettingsChange);
  if (state.tCold0Input) state.tCold0Input.input(onSettingsChange);
  if (state.kInput) state.kInput.input(onSettingsChange);
  if (state.contactModeInput) state.contactModeInput.changed(onContactModeChange);
}

/**
 * シミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);

  state.Teq =
    (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) /
    (state.C_hot + state.C_cold);
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
  state.moveIs = false;
  state.contactMode = false;
}
