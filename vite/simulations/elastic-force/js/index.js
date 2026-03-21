// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state, V_W, V_H } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

const FONT_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.loadFont(FONT_URL, (f) => {
      p.textFont(f);
    });
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.mousePressed = () => {
    const vmx = (p.mouseX / p.width) * V_W;
    const vmy = (p.mouseY / p.width) * V_H;
    for (const spring of state.springs) {
      if (spring.isOverHandle(vmx, vmy)) {
        spring.startDrag(vmx);
        break;
      }
    }
  };

  p.mouseReleased = () => {
    for (const spring of state.springs) {
      spring.stopDrag();
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
