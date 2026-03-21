import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue, FPS } from "./init.js";
import { drawSimulation, handleMousePressed, handleMouseReleased } from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.frameRate(FPS);
    p.textAlign(p.CENTER, p.CENTER);
    p.noLoop();
    p.redraw();
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.mousePressed = () => {
    handleMousePressed(p);
  };

  p.mouseReleased = () => {
    handleMouseReleased(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
