// init.jsは初期処理専用のファイルです。

import { BicpemaCanvasController } from "./class.js";
import { state } from "./state.js";

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
export const FPS = 30;
export let canvasController;
export function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
// グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。
//   state.graph = select("#graph");
//   state.graphCanvas = select("#graphCanvas");
export function elementSelectInit() {}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
export function elementPositionInit() {}

// valueInit関数
// 初期値を設定するための関数
export function valueInit() {}
