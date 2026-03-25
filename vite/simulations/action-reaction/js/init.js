// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { Block, Spring } from "./class.js";
import {
  onMassAChange,
  onMassBChange,
  onStart,
  onReset,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

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
  state.massAInput = p.select("#massAInput");
  state.massBInput = p.select("#massBInput");
  state.startButton = p.select("#startButton");
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
  state.massAInput.input(onMassAChange);
  state.massBInput.input(onMassBChange);
  state.startButton.mousePressed(onStart);
  state.resetButton.mousePressed(onReset);
  state.toggleModal.mousePressed(onToggleModal);
  state.closeModal.mousePressed(onCloseModal);
}

/**
 * 初期値を設定するための関数
 * 物体A・物体Bの初期位置はキャンバス中心を基準に対称に配置する。
 * 初期ばね長: 60px（自然長100pxから40px圧縮）
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  const mA = parseFloat(state.massAInput.value());
  const mB = parseFloat(state.massBInput.value());

  // ばね: 自然長100px, ばね定数40 N/m
  state.spring = new Spring(40, 100);

  // 初期配置: キャンバス中心(500)基準、ブロック幅120px、初期gap=60px
  // xA = 500 - (120 + 60 + 120)/2 + 120/2 = 500 - 150 + 60 = 410
  // xB = 500 + (120 + 60 + 120)/2 - 120/2 = 500 + 150 - 60 = 590
  state.blockA = new Block(410, mA, [200, 70, 70], "A");
  state.blockB = new Block(590, mB, [70, 110, 200], "B");
  state.phase = "ready";
}
