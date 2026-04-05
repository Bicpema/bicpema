// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./class.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";
// import { ... } from "./logic.js";
// import { ... } from "./elementFunction.js";

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  // preload 関数が必要な場合は以下のコメントを外してください。
  // p.preload = () => {
  //   font = p.loadFont("...");
  // };

  // setup関数
  // シミュレーションを実行する際に１度だけ呼び出される。
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  // draw関数
  // シミュレーションを実行した後、繰り返し呼び出され続ける
  p.draw = () => {
    p.background(0);
    // drawGraph(p);
  };

  // windowResized関数
  // シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
