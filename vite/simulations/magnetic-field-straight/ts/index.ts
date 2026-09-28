import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false,
    is3D: true
  });

  /** キャンバスを生成してカメラ位置を設定し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    p.camera(0, -300, 600, 0, 0, 0, 0, 1, 0);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
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

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
