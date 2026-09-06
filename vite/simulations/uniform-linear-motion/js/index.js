import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { elCreate, elSetting, imgInit, initValue } from "./init.js";
import { drawScale, graphDraw } from "./logic.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FRAME_RATE,
  ROAD_AREA_HEIGHT,
  ROAD_HEIGHT,
  TICK_LABEL_FONT_SIZE,
} from "./constants.js";

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
    p.textSize(TICK_LABEL_FONT_SIZE);
    p.textAlign(p.CENTER);
    p.frameRate(FRAME_RATE);
    state.graphData = true;
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / CANVAS_WIDTH);
    p.background(0);

    p.fill(30);
    p.noStroke();
    p.rect(0, CANVAS_HEIGHT / 2 - ROAD_AREA_HEIGHT, CANVAS_WIDTH, ROAD_HEIGHT);
    p.rect(0, CANVAS_HEIGHT - ROAD_AREA_HEIGHT, CANVAS_WIDTH, ROAD_HEIGHT);

    const SCALE_CHECK_BOX = p.select("#scaleCheckBox");
    if (SCALE_CHECK_BOX && SCALE_CHECK_BOX.checked()) {
      drawScale(p, 0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, ROAD_AREA_HEIGHT);
      drawScale(p, 0, CANVAS_HEIGHT, CANVAS_WIDTH, ROAD_AREA_HEIGHT);
    }

    if (state.isPlaying) {
      state.RED_CAR.update();
      state.YELLOW_CAR.update();
    }
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
