// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";
import { onMousePressed } from "./element-function.js";

/** 光源回転リモコンの画像URL */
const ROTATE_REMOCON_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Frefraction%2FrotateRemocon.png?alt=media&token=d23133ee-6729-4f07-829f-64cbf5eefec5";
/** 屈折率操作リモコンの画像URL */
const N_REMOCON_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Frefraction%2FnRemocon.png?alt=media&token=5777700a-453e-4416-a110-bad723a98401";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false
  });
  let isFirstDraw = true;

  p.setup = async () => {
    try {
      [state.rotateRemocon, state.nRemocon] = await Promise.all([
        p.loadImage(ROTATE_REMOCON_URL),
        p.loadImage(N_REMOCON_URL)
      ]);
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
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

  p.mousePressed = () => {
    onMousePressed(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
