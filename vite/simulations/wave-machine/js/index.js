// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, elementSelectInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, false, 1.0, 1.0);

  p.preload = () => {
    state.stopper = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fstopper.png?alt=media&token=c0470026-cb1a-42c5-b814-539ea0961917"
    );
    state.button = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FredButton.png?alt=media&token=519d5552-ac04-4fc2-8863-b8bc5e2fd174"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    valueInit(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    valueInit(p);
  };
};

new p5(sketch);
