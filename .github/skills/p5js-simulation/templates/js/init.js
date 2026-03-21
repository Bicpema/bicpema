// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
export const FPS = 30;
export function settingInit(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
// グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。
//   state.graph = p.select("#graph");
//   state.graphCanvas = p.select("#graphCanvas");
export function elementSelectInit(p) {}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
export function elementPositionInit(p) {}

// valueInit関数
// 初期値を設定するための関数
export function valueInit(p) {}
