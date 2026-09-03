import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.boxImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/stirringVessel.png?alt=media&token=665a56ef-4ff2-487c-bc9d-3089b1609699"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.background(255);
    const s = Math.min(p.width / 1600, p.height / 800);
    const offsetX = (p.width - 1600 * s) / 2;
    const offsetY = (p.height - 800 * s) / 2;
    p.push();
    p.translate(offsetX, offsetY);
    p.scale(s);
    drawSimulation(p);
    p.pop();
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
