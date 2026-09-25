import p5 from "p5";
import { loadFontFromUrl } from "../../../ts/bicpema-font.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { elCreate, initValue, FPS } from "./init.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      [state.font, state.groundImage, state.ballImage] = await Promise.all([
        loadFontFromUrl(
          p,
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FbrownBall.png?alt=media&token=573180c7-0aff-40cd-b31c-51b5e83dda2e"
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

    p.background(255);
    const ball = state.ball;
    if (!ball) return;
    ball.update(1 / FPS);
    p.scale(p.width / 1000);
    ball.display(p, (1000 * p.height) / p.width, {
      ballImage: state.ballImage,
      groundImage: state.groundImage
    });

    if (ball.isMoving && state.graphVisible) {
      state.graph?.updateGraph();
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
