// index.ts はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, elementSelectInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false
  });

  /** ストッパーとボタンの画像を読み込む。 */
  p.preload = () => {
    state.stopper = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fstopper.png?alt=media&token=c0470026-cb1a-42c5-b814-539ea0961917"
    );
    state.button = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FredButton.png?alt=media&token=519d5552-ac04-4fc2-8863-b8bc5e2fd174"
    );
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
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

  /** ウィンドウサイズの変更に合わせてキャンバスと初期値を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    valueInit(p);
  };
};

new p5(sketch);
