// init.js は初期処理専用のファイルです。

import { state, SPRING_Y, ATTACH_X, NATURAL_LENGTH } from "./state.js";
import { Spring } from "./class.js";
import { onSpringConstantChange, onReset } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";

const FPS = 30;

/**
 * 要素の選択とイベントハンドラーの設定、基本設定を行う。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.springConstantInput = p.select("#springConstantInput");
  state.springConstantDisplay = p.select("#springConstantDisplay");

  state.springConstantInput.input(() => onSpringConstantChange());
  p.select("#resetButton").mousePressed(() => onReset());

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal"
  });

  p.frameRate(FPS);
}

/**
 * シミュレーションの初期値を設定する。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  const k = parseInt(state.springConstantInput.value());
  state.springs = [new Spring(ATTACH_X, SPRING_Y, NATURAL_LENGTH, k)];
}
