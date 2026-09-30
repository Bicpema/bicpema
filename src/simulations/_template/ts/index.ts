// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();
  let isFirstDraw = true;

  // /** フォントなどの素材を読み込む。 */
  // p.preload = () => {
  //   font = p.loadFont("...");
  // };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(0);
    // drawGraph(p);

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
