// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import "../../../css/tailwind.css";
import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import {
  elCreate,
  elInit,
  initValue,
  uiInit,
  loadJapaneseFont,
} from "./init.js";
import { drawSimulation } from "./logic.js";
import {
  submit,
  loadLayers,
  placeRefreshFunction,
  firstPlaceSelectFunction,
  secondPlaceSelectFunction,
  thirdPlaceSelectFunction,
} from "./element-function.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, true, 1.0, 1.0);

  // 子ウィンドウ（setWindow.html）からwindow.opener経由で呼び出されるための公開。
  // 別ドキュメントのため、ESモジュールのimport/exportでは参照できない。
  window.submit = submit;
  window.loadLayers = loadLayers;
  window.placeRefreshFunction = () => placeRefreshFunction(p);
  window.firstPlaceSelectFunction = () => firstPlaceSelectFunction(p);
  window.secondPlaceSelectFunction = () => secondPlaceSelectFunction(p);
  window.thirdPlaceSelectFunction = () => thirdPlaceSelectFunction(p);

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    elInit(p);
    initValue(p);
    uiInit();
    loadJapaneseFont(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
