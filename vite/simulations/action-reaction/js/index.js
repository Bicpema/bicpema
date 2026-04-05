// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./class.js";
import { state } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    // Firebase Storage が到達不能でもブロックしないよう setup 内で非同期読み込み
    p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      (f) => {
        state.font = f;
      },
      () => {
        state.font = null;
      }
    );
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
