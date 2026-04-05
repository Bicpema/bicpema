import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, elSetting, imgInit, initValue } from "./init.js";
import { drawScale, graphDraw } from "./logic.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController();

  p.preload = () => {
    state.YELLOW_CAR_IMG = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FyCar.png?alt=media&token=fa3ee043-5471-41d7-bb7f-93ac1eca46f1"
    );
    state.RED_CAR_IMAGE = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FrCar.png?alt=media&token=7caf11af-6f62-4437-89b8-d5787c7accb8"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    elSetting(p);
    imgInit();
    initValue(p);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.frameRate(60);
    state.graphData = true;
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(0);

    p.fill(30);
    p.noStroke();
    p.rect(0, CANVAS_HEIGHT / 2 - 50, 1000, 25);
    p.rect(0, CANVAS_HEIGHT - 50, 1000, 25);

    const SCALE_CHECK_BOX = p.select("#scaleCheckBox");
    if (SCALE_CHECK_BOX && SCALE_CHECK_BOX.checked()) {
      drawScale(p, 0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, 50);
      drawScale(p, 0, CANVAS_HEIGHT, CANVAS_WIDTH, 50);
    }

    state.RED_CAR.update();
    state.YELLOW_CAR.update();
    state.RED_CAR.drawTrajectory(p);
    state.YELLOW_CAR.drawTrajectory(p);
    state.RED_CAR.drawCar(p);
    state.YELLOW_CAR.drawCar(p);

    graphDraw(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elSetting(p);
    initValue(p);
  };
};

new p5(sketch);
