// init.ts は初期処理専用のファイルです。

import type p5 from "p5";
import { initModal } from "../../../ts/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";
import { FPS } from "./constants.js";
import {
  onPlayPause,
  onReset,
  onAccelerationInput
} from "./element-function.js";

/**
 * シミュレーションそのものの設定を行います。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5): void {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * 仮想DOMを読み込み、イベントを設定します。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5): void {
  bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset
  });
  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#settingsModal .modal-close"
  });
  p.select("#accelerationInput")?.input(onAccelerationInput);
}
