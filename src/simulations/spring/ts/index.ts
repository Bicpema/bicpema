// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, resizeImages, layoutGraphs } from "./init.js";
import { drawSimulation } from "./logic.js";

/** ばね画像のURL */
const SPRING_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FspringImg.png?alt=media&token=39da612a-739a-4bc2-bde0-2429d1f4ef7d";
/** おもり画像のURL */
const BALL_IMAGE_URL =
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

  /** ばねとおもりの画像を読み込む。 */
  p.preload = () => {
    state.springImage = p.loadImage(SPRING_IMAGE_URL);
    state.ballImage = p.loadImage(BALL_IMAGE_URL);
  };

  /** キャンバスとDOM要素を生成し、グラフの配置と初期値の設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    layoutGraphs(p);
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

  /** ウィンドウサイズの変更に合わせてキャンバス・画像・グラフの配置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    resizeImages(p);
    layoutGraphs(p);
  };
};

new p5(sketch);
