// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();
  let isFirstDraw = true;

  p.setup = async () => {
    // 画像・フォント等の非同期読み込みが必要な場合はここでawaitする。
    // フォントは ../../../ts/bicpema-font.js の loadFontFromUrl() で読み込む。
    // const font = await loadFontFromUrl(p, "...");
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(0);
    // drawGraph(p);

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
