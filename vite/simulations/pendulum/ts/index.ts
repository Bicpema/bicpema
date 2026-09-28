// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { BALL_RADIUS_DIVISOR } from "./constants.js";

/** おもりの画像URL */
const WEIGHT_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FmetalBallImg.png?alt=media&token=97e75efc-9412-406f-af82-8c6c753a3d2a";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false
  });
  let isFirstDraw = true;

  /** おもりの画像を読み込む。 */
  p.preload = () => {
    state.weightImage = p.loadImage(WEIGHT_IMAGE_URL);
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとおもりの半径を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    state.radi = p.width / BALL_RADIUS_DIVISOR;
  };
};

new p5(sketch);
