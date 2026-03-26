import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import {
  drawXYScene,
  drawSlopeScene,
  handlePress,
  handleDrag,
  handleRelease,
} from "./logic.js";
import { V_W, MAX_FORCE } from "./constants.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      () => {},
      () => {
        state.font = null;
      }
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    p.scale(p.width / V_W);
    if (state.mode === "xy") {
      drawXYScene(p);
    } else {
      drawSlopeScene(p);
    }
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

  p.touchStarted = () => {
    handlePress(p);
    return false;
  };

  p.touchMoved = () => {
    handleDrag(p, MAX_FORCE);
    return false;
  };

  p.touchEnded = () => {
    handleRelease();
    return false;
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
