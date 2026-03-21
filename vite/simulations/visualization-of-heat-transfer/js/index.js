import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    p.background(30);
    p.scale(p.width / 1000);
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
