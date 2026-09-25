import p5 from "p5";
import { loadFontFromUrl } from "../../../js/bicpema-font.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { elCreate, initValue, FPS } from "./init.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({ is3D: true });

  p.setup = async () => {
    try {
      state.font = await loadFontFromUrl(
        p,
        "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
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

    p.background(10, 10, 20);
    const { ball } = state;
    if (ball) {
      ball.update(1 / FPS);
      ball.display(p);
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
