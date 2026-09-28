// index.ts はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { settingInit, elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({ heightRatio: 0.9 });

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elCreate(p);
    initValue(p);
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスと初期値を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    initValue(p);
  };
};

new p5(sketch);
