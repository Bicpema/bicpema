import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { initCollapse } from "../../../js/bicpema-modal-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, FPS } from "./init.js";
import {
  drawSimulation,
  handleMousePressed,
  handleMouseReleased,
} from "./logic.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false);

  p.preload = () => {
    state.tankImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/waterTank.png?alt=media&token=54c843b3-9823-47b0-9a66-0ad3f947afd3"
    );
    state.cylinderImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/buoyantObject.png?alt=media&token=102dab30-459c-4e10-a002-748b7d3598ce"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.frameRate(FPS);
    p.textAlign(p.CENTER, p.CENTER);
    p.loop();
    initCollapse({
      toggleSelectors: "#settingsButton",
      targetSelector: "#settingsPanel",
    });
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

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
