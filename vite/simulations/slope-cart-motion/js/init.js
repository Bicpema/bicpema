// init.js - 初期処理専用のファイルです。

import { state } from "./state.js";
import { SlopeCart } from "./class.js";
import { SLOPE_LENGTH_M } from "./function.js";
import {
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
  onToggleGraph,
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

  // グラフトグルボタン
  const graphToggleParent = p
    .createDiv()
    .id("graphToggleParent")
    .parent(p.select("#p5Container"));

  p.createButton("v-tグラフを表示")
    .id("graphToggleButton")
    .parent(graphToggleParent)
    .class("btn btn-secondary mt-2")
    .mousePressed(onToggleGraph);

  // グラフ用 div
  p.createDiv('<canvas id="graphCanvas"></canvas>')
    .id("graph")
    .parent(p.select("#p5Container"))
    .class("rounded border border-1")
    .style("display", "none")
    .style("background-color", "white");
}

/**
 * DOM要素の位置・サイズを設定する（リサイズ時も呼ばれる）
 * @param {*} p - p5インスタンス
 */
export function elementPositionInit(p) {
  const graphToggleParent = p.select("#graphToggleParent");
  const graphDiv = p.select("#graph");

  // グラフをキャンバス幅に合わせて配置
  const gx = (p.windowWidth - p.width) / 2;
  const gy = p.height + 10;

  if (p.width <= 992) {
    graphToggleParent.position(gx, gy);
    graphDiv.position(gx, gy + 46).size(p.width, p.width * 0.6);
  } else {
    graphToggleParent.position(p.windowWidth / 2 - p.width / 4, gy);
    graphDiv
      .position(p.windowWidth / 2 - p.width / 4, gy + 46)
      .size(p.width / 2, p.width * 0.3);
  }
}

/**
 * シミュレーション変数を初期化する
 * @param {*} p - p5インスタンス
 */
export function valueInit() {
  state.cart = new SlopeCart(state.slopeDeg, SLOPE_LENGTH_M);
  state.tapeMarks = [];
  state.vtData = [];
}

