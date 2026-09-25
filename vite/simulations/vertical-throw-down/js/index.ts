import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { elCreate, initValue, FPS } from "./init.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    panelSelector: "#simPanel"
  });

  p.setup = async () => {
    try {
      [
        state.font,
        state.tallBuildingImage,
        state.groundImage,
        state.ballImage
      ] = await Promise.all([
        p.loadFont(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FtallBuilding.png?alt=media&token=0c3ed88a-8055-46f6-a46d-da8c924446e3"
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
    const { ball, graph } = state;
    if (ball) {
      const wasMoving = ball.isMoving;
      ball.update(1 / FPS);
      p.scale(p.width / 1000);
      ball.display(p, (1000 * p.height) / p.width);

      // 動いているときは毎フレーム更新、停止した瞬間も1回更新
      if (wasMoving && graph) {
        graph.updateGraph();
      }
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
