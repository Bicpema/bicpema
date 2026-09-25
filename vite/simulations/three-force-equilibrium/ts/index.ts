// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { loadFontFromUrl } from "../../../ts/bicpema-font.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state, V_W } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { startDrag, updateDrag, stopDrag } from "./element-function.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    // Firebase Storage が到達不能でもブロックしないよう setup 内で非同期読み込み
    loadFontFromUrl(
      p,
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    )
      .then((f: p5.Font) => {
        state.font = f;
      })
      .catch(() => {
        state.font = null;
      });
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

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

  // p5.js v2ではタッチ操作もmousePressed/mouseReleasedとmouseX/mouseYに
  // 統合されたため、専用のtouchStarted/touchMoved/touchEndedは不要。

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
