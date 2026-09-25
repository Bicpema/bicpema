import p5 from "p5";
import { loadFontFromUrl } from "../../../ts/bicpema-font.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import {
  drawXYScene,
  handlePress,
  handleDrag,
  handleRelease
} from "./logic.js";
import { V_W, MAX_FORCE } from "./constants.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    state.font = await loadFontFromUrl(
      p,
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    )
      // 失敗時もcatchでnullに解決し、setup本体の実行を妨げないようにする。
      .catch(() => null);
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

    p.scale(p.width / V_W);
    drawXYScene(p);
  };

  p.mousePressed = () => {
    handlePress(p);
  };

  p.mouseDragged = () => {
    handleDrag(p, MAX_FORCE);
  };

  p.mouseReleased = () => {
    handleRelease();
  };

  // p5.js v2ではタッチ操作もmousePressed/mouseDragged/mouseReleasedに
  // 統合されたため、専用のtouchStarted/touchMoved/touchEndedは不要。

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
