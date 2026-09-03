import p5 from "p5";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elementPositionInit } from "./init.js";
import { drawChamber, animateCycle } from "./logic.js";
import "../../../css/tailwind.css";

const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

const sketch = (p) => {
  p.preload = () => {
    state.img_flame = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6"
    );
    state.img_weight = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/weight.png?alt=media&token=89d6b90d-9d1e-4bf1-ae06-cb7a7b1d9b49"
    );
    state.img_ice = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/ice.png?alt=media&token=df309c39-ef41-4c38-8dd4-c1fa27e0541d"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elementPositionInit(p);
    p.textFont("sans-serif");
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(250);
    drawChamber(p);
    animateCycle(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
