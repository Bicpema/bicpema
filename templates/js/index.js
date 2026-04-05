// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  // p.preload = () => {
  //   font = p.loadFont("...");
  // };

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(0);
    // drawGraph(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
