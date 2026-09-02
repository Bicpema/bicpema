import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elementPositionInit, setupControls } from "./init.js";
import { drawWave, drawUIContext, drawFormula } from "./logic.js";

const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

const sketch = (p) => {
  p.setup = () => {
    canvasController.fullScreen(p);
    elementPositionInit(p);
    setupControls(p);
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(255);
    p.image(state.waveLayer, 0, 0);
    drawUIContext(p);
    drawWave(p);
    drawFormula(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
