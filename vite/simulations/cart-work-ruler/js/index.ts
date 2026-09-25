// index.jsはメインのメソッドを呼び出すためのファイルです。

import p5 from "p5";
import { loadFontFromUrl } from "../../../js/bicpema-font.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { state } from "./state.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      [state.font, state.bookImage, state.cartImage, state.groundImage] =
        await Promise.all([
          loadFontFromUrl(
            p,
            "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
          ),
          p.loadImage(
            "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/book2.png?alt=media&token=5a1cd40b-af41-424e-90a3-7372fe30957b"
          ),
          p.loadImage(
            "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/realTrolley.png?alt=media&token=dd68620c-22aa-43e7-9963-dc953989662e"
          ),
          p.loadImage(
            "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
          )
        ]);
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
  };
};

new p5(sketch);
