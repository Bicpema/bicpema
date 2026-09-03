// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";

/** おもりの画像URL */
const WEIGHT_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FmetalBallImg.png?alt=media&token=97e75efc-9412-406f-af82-8c6c753a3d2a";
/** 振り子の長さデータCSVのURL */
const PENDULUM_DATA_URL =
  "https://dl.dropboxusercontent.com/s/a4mwnazwmgqmn87/pendulumData.csv";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, false, 1.0, 1.0);
  let isFirstDraw = true;

  p.preload = () => {
    state.weightImage = p.loadImage(WEIGHT_IMAGE_URL);
    state.pendulumData = p.loadTable(PENDULUM_DATA_URL, "header");
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    valueInit(p);
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
  };
};

new p5(sketch);
