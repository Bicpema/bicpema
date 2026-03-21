import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { elCreate } from "./init.js";
import { initValue } from "./init.js";
import { backgroundSetting } from "./graph.js";
import { drawSimulation } from "./logic.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    p.stroke(0);
    p.strokeWeight(1);
    backgroundSetting(p);
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.fullScreen(p);
    initValue(p);
  };
};

new p5(sketch);
