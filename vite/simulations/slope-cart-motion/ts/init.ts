// init.js - 初期処理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { SlopeCart } from "./slope-cart.js";
import { SLOPE_LENGTH_M } from "./function.js";
import { onReset, onPlayPause, applySettings } from "./element-function.js";
import { initModal } from "../../../ts/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";
import type { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";

/** フレームレート */
export const FPS = 30;

/**
 * シミュレーション設定を行う
 * @param {*} p - p5インスタンス
 * @param {*} canvasController - BicpemaCanvasControllerインスタンス
 */
export function settingInit(p: p5, canvasController: BicpemaCanvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) {
    p.textFont(state.font);
  }
  p.textSize(15);
}

/**
 * DOM要素の初期化（作成 + 参照取得）
 * @param {*} p - p5インスタンス
 */
export function elementSelectInit(p: p5) {
  // ボタン・入力の参照
  state.angleInput = p.select("#angleInput");
  state.intervalInput = p.select("#intervalInput");

  // イベントハンドラーをここで一度だけ登録
  const { toggleButton, resetButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset
  });
  state.playPauseButton = toggleButton;
  state.resetButton = resetButton;

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
    onClose: applySettings
  });
}

/**
 * DOM要素の位置・サイズを設定する（リサイズ時も呼ばれる）
 * @param {*} _p - p5インスタンス
 */
export function elementPositionInit(_p: p5) {
  // グラフは CSS position:absolute で配置するため JS 側の設定不要
}

/**
 * シミュレーション変数を初期化する
 */
export function valueInit() {
  state.cart = new SlopeCart(state.slopeDeg, SLOPE_LENGTH_M);
  state.tapeMarks = [];
}
