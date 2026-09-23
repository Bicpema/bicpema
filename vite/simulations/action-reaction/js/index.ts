// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";
import { state, V_W } from "./state.js";
import { drawSimulation, updateAnimations } from "./logic.js";
import { startDrag, updateDrag, stopDrag } from "./element-function.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();
  let isFirstDraw = true;

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  p.draw = () => {
    if (state.dragging) {
      const vmx = (p.mouseX / p.width) * V_W;
      const vmy = (p.mouseY / p.width) * V_W;
      updateDrag(vmx, vmy);
    }

    updateAnimations(p);
    drawSimulation(p);

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
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
      const touch = p.touches[0] as { x: number; y: number };
      const vmx = (touch.x / p.width) * V_W;
      const vmy = (touch.y / p.width) * V_W;
      startDrag(vmx, vmy);
    }
    return false;
  };

  p.touchMoved = () => {
    if (p.touches.length > 0 && state.dragging) {
      const touch = p.touches[0] as { x: number; y: number };
      const vmx = (touch.x / p.width) * V_W;
      const vmy = (touch.y / p.width) * V_W;
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
