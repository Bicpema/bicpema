import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elementPositionInit } from "./init.js";
import { drawChamber, animateCycle } from "./logic.js";
import "../../../css/tailwind.css";

const canvasController = new BicpemaCanvasController();

const sketch = (p: p5) => {
  p.setup = async () => {
    try {
      [state.img_flame, state.img_weight, state.img_ice] = await Promise.all([
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/weight.png?alt=media&token=89d6b90d-9d1e-4bf1-ae06-cb7a7b1d9b49"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/ice.png?alt=media&token=df309c39-ef41-4c38-8dd4-c1fa27e0541d"
        )
      ]);
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
    canvasController.fullScreen(p);
    elementPositionInit(p);
    p.textFont("sans-serif");
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    p.background(250);
    drawChamber(p);
    animateCycle(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
