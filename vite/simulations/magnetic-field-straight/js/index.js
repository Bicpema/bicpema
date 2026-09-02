import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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
  const canvasController = new BicpemaCanvasController(false, true, 1.0, 1.0);

  p.setup = () => {
    canvasController.fullScreen(p);
    p.camera(0, -300, 600, 0, 0, 0, 0, 1, 0);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
