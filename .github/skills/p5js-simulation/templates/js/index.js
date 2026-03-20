// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import { settingInit, elementSelectInit, elementPositionInit, valueInit, canvasController } from "./init.js";
import { state } from "./state.js";
// import { ... } from "./logic.js";
// import { ... } from "./elementFunction.js";

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// p5.js グローバルモード用にライフサイクル関数を window に登録する

// preload 関数が必要な場合は以下のコメントを外してください。
// window.preload = function () {
//   font = loadFont("...");
// };

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
window.setup = function () {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
};

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
window.draw = function () {
  scale(width / 1000);
  background(0);
  // drawGraph();
};

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
window.windowResized = function () {
  canvasController.resizeScreen();
  elementPositionInit();
};
