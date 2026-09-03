// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, resizeImages, layoutGraphs } from "./init.js";
import { drawSimulation } from "./logic.js";

/** ばね画像のURL */
const SPRING_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FspringImg.png?alt=media&token=39da612a-739a-4bc2-bde0-2429d1f4ef7d";
/** おもり画像のURL */
const BALL_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FmetalBallImg.png?alt=media&token=97e75efc-9412-406f-af82-8c6c753a3d2a";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, false, 1.0, 1.0);
  let isFirstDraw = true;

  p.preload = () => {
    state.springImage = p.loadImage(SPRING_IMAGE_URL);
    state.ballImage = p.loadImage(BALL_IMAGE_URL);
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    layoutGraphs(p);
    initValue(p);
  };

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    resizeImages(p);
    layoutGraphs(p);
  };
};

new p5(sketch);
