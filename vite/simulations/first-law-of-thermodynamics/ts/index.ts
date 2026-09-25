// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { initValue, elCreate } from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      state.img_flame = await p.loadImage(
        "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6"
      );
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    initValue(p);
  };
};

new p5(sketch);
