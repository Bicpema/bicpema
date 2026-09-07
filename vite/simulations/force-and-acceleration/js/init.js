// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Cart } from "./class.js";
import { onMassChange, onReset, onClearMax } from "./element-function.js";
import { INITIAL_CART_X } from "./constants.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";

export const FPS = 60;

/**
 * シミュレーションそのものの設定を行う関数
 * @param {*} p p5インスタンス
 * @param {*} canvasController BicpemaCanvasControllerインスタンス
 */
export function settingInit(p, canvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

/**
 * 仮想DOMを読み込むための関数
 * @param {*} p p5インスタンス
 */
export function elementSelectInit(p) {
  state.massInput = p.select("#massInput");
  state.resetButton = p.select("#resetButton");
  state.clearMaxButton = p.select("#clearMaxButton");
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 * @param {*} p p5インスタンス
 */
export function elementPositionInit(p) {
  state.massInput.input(onMassChange);
  state.resetButton.mousePressed(onReset);
  if (state.clearMaxButton) state.clearMaxButton.mousePressed(onClearMax);

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
}

/**
 * 初期値を設定するための関数
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  const mass = parseFloat(state.massInput.value());
  state.cart = new Cart(INITIAL_CART_X, mass);
}
