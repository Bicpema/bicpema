// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./class.js";
import { state, V_W } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { startDrag, updateDrag, stopDrag } from "./element-function.js";

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
    if (state.dragging) {
      const vmx = (p.mouseX / p.width) * V_W;
      const vmy = (p.mouseY / p.width) * V_W;
      updateDrag(vmx, vmy);
    }
    drawSimulation(p);
  };

  p.mousePressed = () => {
    const vmx = (p.mouseX / p.width) * V_W;
    const vmy = (p.mouseY / p.width) * V_W;
    startDrag(vmx, vmy);
  };

  p.mouseReleased = () => {
    stopDrag();
  };

  p.touchStarted = () => {
    if (p.touches.length > 0) {
      const vmx = (p.touches[0].x / p.width) * V_W;
      const vmy = (p.touches[0].y / p.width) * V_W;
      startDrag(vmx, vmy);
    }
    return false;
  };

  p.touchMoved = () => {
    if (p.touches.length > 0 && state.dragging) {
      const vmx = (p.touches[0].x / p.width) * V_W;
      const vmy = (p.touches[0].y / p.width) * V_W;
      updateDrag(vmx, vmy);
    }
    return false;
  };

  p.touchEnded = () => {
    stopDrag();
    return false;
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
