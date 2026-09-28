import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elementPositionInit, setupControls } from "./init.js";
import { drawWave, drawUIContext, drawFormula } from "./logic.js";

const canvasController = new BicpemaCanvasController();

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  /** キャンバスを生成し、DOM要素の配置と操作パネルの設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elementPositionInit(p);
    setupControls(p);
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    p.background(255);
    if (state.waveLayer) p.image(state.waveLayer, 0, 0);
    drawUIContext(p);
    drawWave(p);
    drawFormula(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
