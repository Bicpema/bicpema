// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";

/** おもりの画像URL */
const WEIGHT_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FmetalBallImg.png?alt=media&token=97e75efc-9412-406f-af82-8c6c753a3d2a";
/** 振り子の長さデータCSVのURL */
const PENDULUM_DATA_URL =
  "https://dl.dropboxusercontent.com/s/a4mwnazwmgqmn87/pendulumData.csv";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false
  });
  let isFirstDraw = true;

  p.preload = () => {
    state.weightImage = p.loadImage(WEIGHT_IMAGE_URL);
    // p5.jsの型定義上、loadTable()の戻り値は`object`型となっているため、
    // 実際の戻り値であるp5.Tableへ明示的にキャストする。
    state.pendulumData = p.loadTable(PENDULUM_DATA_URL, "header") as p5.Table;
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
