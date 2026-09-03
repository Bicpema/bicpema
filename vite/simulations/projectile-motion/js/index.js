// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import {
  fullScreen,
  elementSelectInit,
  elementPositionInit,
  updateUsableHeight,
  CANVAS_HEIGHT_RATIO,
} from "./init.js";
import {
  onStartStopButtonClick,
  onResetButtonClick,
} from "./element-function.js";
import { resetSimulationState, updateLayout, drawSimulation } from "./logic.js";

const sketch = (p) => {
  let isFirstDraw = true;

  p.setup = () => {
    fullScreen(p);
    elementSelectInit(p);
    resetSimulationState(p);
    elementPositionInit(p);

    state.startButton.mousePressed(onStartStopButtonClick);
    state.stopButton.mousePressed(onStartStopButtonClick).hide();
    state.resetButton.mousePressed(() => onResetButtonClick(p));
  };

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    updateUsableHeight(p);
    p.resizeCanvas(p.windowWidth, state.usableHeight * CANVAS_HEIGHT_RATIO);
    updateLayout(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
