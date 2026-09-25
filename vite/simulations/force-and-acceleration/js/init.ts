// init.jsは初期処理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { Cart } from "./class.js";
import { onMassChange, onReset, onClearMax } from "./element-function.js";
import { INITIAL_CART_X } from "./constants.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import type { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";

export const FPS = 60;

/**
 * シミュレーションそのものの設定を行う関数
 * @param {*} p p5インスタンス
 * @param {*} canvasController BicpemaCanvasControllerインスタンス
 */
export function settingInit(p: p5, canvasController: BicpemaCanvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

/**
 * 仮想DOMを読み込むための関数
 * @param {*} p p5インスタンス
 */
export function elementSelectInit(p: p5) {
  state.massInput = p.select("#massInput");
  state.resetButton = p.select("#resetButton");
  state.clearMaxButton = p.select("#clearMaxButton");
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 * @param {*} p p5インスタンス
 */
export function elementPositionInit(p: p5) {
  // elementSelectInit()で取得済みのため呼び出し時点でnullになりえない
  state.massInput!.input(onMassChange);
  state.resetButton!.mousePressed(onReset);
  if (state.clearMaxButton) state.clearMaxButton.mousePressed(onClearMax);

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal"
  });
}

/**
 * 初期値を設定するための関数
 * @param {*} p p5インスタンス
 */
export function valueInit(p: p5) {
  const mass = parseFloat(String(state.massInput!.value()));
  state.cart = new Cart(INITIAL_CART_X, mass);
}
