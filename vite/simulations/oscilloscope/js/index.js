import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/style.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import {
  elementPositionInit,
  elementSelectInit,
  settingInit,
  setupControls,
  valueInit,
} from "./init.js";
import { drawOscilloscope, updateAudioData } from "./logic.js";

const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

const sketch = (p) => {
  let elements;

  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elements = elementSelectInit();
    elementPositionInit(p);
    valueInit();
    setupControls(p, elements);
  };

  p.draw = () => {
    updateAudioData();
    drawOscilloscope(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

async function startSimulation() {
  window.p5 = p5;
  await import("p5/lib/addons/p5.sound.js");
  new p5(sketch);
}

startSimulation();
