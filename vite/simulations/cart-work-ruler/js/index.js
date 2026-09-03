// index.jsはメインのメソッドを呼び出すためのファイルです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { state } from "./state.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.bookImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/book2.png?alt=media&token=5a1cd40b-af41-424e-90a3-7372fe30957b"
    );
    state.cartImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/realTrolley.png?alt=media&token=dd68620c-22aa-43e7-9963-dc953989662e"
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
  };

  p.setup = () => {
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
  };
};

new p5(sketch);
