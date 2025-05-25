// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

import p5 from "https://cdn.jsdelivr.net/npm/p5@1.11.7/+esm";
import { elementPositionInit, elementSelectInit, settingInit, valueInit } from "./init.js";
import { BicpemaCanvasController } from "./class.js";
const sketch = (p) => {
  let font;
  p.preload = function () {
    font = p.loadFont("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580");
  };

  let canvasController;
  p.setup = function () {
    canvasController = new BicpemaCanvasController(p);
    canvasController.fullScreen();
    settingInit(p, font);
    elementSelectInit();
    elementPositionInit();
    valueInit();
  };

  p.draw = function () {
    p.scale(p.width / 1000);
    p.background(0);
    // drawGraph();
  };

  p.windowResized = function () {
    canvasController.resizeScreen();
    elementPositionInit();
  };
};

// スケッチのインスタンスを生成
new p5(sketch);
