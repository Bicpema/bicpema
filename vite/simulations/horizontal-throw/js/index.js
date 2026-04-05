import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { Ball } from "./ball.js";
import { elCreate, initValue, FPS } from "./init.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, true, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    p.background(10, 10, 20);
    state.ball.update(1 / FPS);
    state.ball.display(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
