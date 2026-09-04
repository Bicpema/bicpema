// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);
  let isFirstDraw = true;

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

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
