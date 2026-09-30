// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, valueInit } from "./init.js";
import { drawSimulation } from "./logic.js";
import { onMousePressed } from "./element-function.js";

/** 光源回転リモコンの画像URL */
const ROTATE_REMOCON_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Frefraction%2FrotateRemocon.png?alt=media&token=d23133ee-6729-4f07-829f-64cbf5eefec5";
/** 屈折率操作リモコンの画像URL */
const N_REMOCON_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Frefraction%2FnRemocon.png?alt=media&token=5777700a-453e-4416-a110-bad723a98401";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false
  });
  let isFirstDraw = true;

  /** 光源回転リモコンと屈折率操作リモコンの画像を読み込む。 */
  p.preload = () => {
    state.rotateRemocon = p.loadImage(ROTATE_REMOCON_URL);
    state.nRemocon = p.loadImage(N_REMOCON_URL);
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    valueInit(p);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** マウス押下時に、リモコンや表示モードタブの操作を処理する。 */
  p.mousePressed = () => {
    onMousePressed(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスの大きさを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
