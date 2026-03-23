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
    state.img1 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2FTransformer.png?alt=media&token=70310a44-504b-4e40-8180-c0806ca6a925"
    );
    state.img2 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil1.png?alt=media&token=c72113f3-d995-496a-bc88-5b80653b68bd"
    );
    state.img3 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil2.png?alt=media&token=23ef07d6-1a31-4a06-9b3b-aae6f433866a"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    valueInit();
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
