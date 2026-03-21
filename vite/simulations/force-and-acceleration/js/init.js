// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Cart } from "./class.js";
import { onMassChange, onReset, onToggleModal, onCloseModal } from "./element-function.js";

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
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 * @param {*} p p5インスタンス
 */
export function elementPositionInit(p) {
  state.massInput.input(onMassChange);
  state.resetButton.mousePressed(onReset);
  state.toggleModal.mousePressed(onToggleModal);
  state.closeModal.mousePressed(onCloseModal);
}

/**
 * 初期値を設定するための関数
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  const mass = parseFloat(state.massInput.value());
  state.cart = new Cart(250, mass);
}

