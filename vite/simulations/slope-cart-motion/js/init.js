// init.js - 初期処理専用のファイルです。

import { state } from "./state.js";
import { SlopeCart } from "./slope-cart.js";
import { SLOPE_LENGTH_M } from "./function.js";
import {
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

/** フレームレート */
export const FPS = 30;

/**
 * シミュレーション設定を行う
 * @param {*} p - p5インスタンス
 * @param {*} canvasController - BicpemaCanvasControllerインスタンス
 */
export function settingInit(p, canvasController) {
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
export function elementSelectInit(p) {
  // ボタン・入力の参照
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");
  state.angleInput = p.select("#angleInput");
  state.intervalInput = p.select("#intervalInput");

  // イベントハンドラーをここで一度だけ登録
  state.resetButton.mousePressed(onReset);
  state.playPauseButton.mousePressed(onPlayPause);
  state.toggleModal.mousePressed(onToggleModal);
  state.closeModal.mousePressed(onCloseModal);
}

/**
 * DOM要素の位置・サイズを設定する（リサイズ時も呼ばれる）
 * @param {*} p - p5インスタンス
 */
export function elementPositionInit(_p) {
  // グラフは CSS position:absolute で配置するため JS 側の設定不要
}

/**
 * シミュレーション変数を初期化する
 * @param {*} p - p5インスタンス
 */
export function valueInit() {
  state.cart = new SlopeCart(state.slopeDeg, SLOPE_LENGTH_M);
  state.tapeMarks = [];
}
