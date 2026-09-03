// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import {
  fullScreen,
  resizeScreen,
  buttonCreation,
  materialSet,
  buttonSettings,
  buttonEvents,
  initSettings,
  updateLayout,
} from "./init.js";
import {
  sortButtonAction1,
  sortButtonAction2,
  sortButtonAction3,
  moveButtonAction,
  resetButtonAction,
} from "./element-function.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  let isFirstDraw = true;

  p.setup = () => {
    fullScreen(p);
    buttonCreation(p, {
      sortButtonAction1,
      sortButtonAction2,
      sortButtonAction3,
    });
    initSettings(p);
    materialSet(p);
    buttonSettings(p);
    buttonEvents(p, { moveButtonAction, resetButtonAction });
  };

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    resizeScreen(p);
    updateLayout(p);
    buttonSettings(p);
  };
};

new p5(sketch);
