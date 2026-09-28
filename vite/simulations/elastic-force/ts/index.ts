// index.ts はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state, V_W } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

const FONT_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580";
const GROUND_IMG_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** 壁（地面）の画像を読み込む。 */
  p.preload = () => {
    state.wallImg = p.loadImage(GROUND_IMG_URL);
  };

  /** キャンバスを生成し、初期設定を行う。フォントは非同期で読み込んで適用する。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.loadFont(FONT_URL, (f: p5.Font) => {
      p.textFont(f);
    });
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

  /** マウス位置にあるばねの取っ手を探し、見つかればドラッグを開始する。 */
  p.mousePressed = () => {
    const vmx = (p.mouseX / p.width) * V_W;
    const vmy = (p.mouseY / p.width) * V_W;
    for (const spring of state.springs) {
      if (spring.isOverHandle(vmx, vmy)) {
        spring.startDrag(vmx);
        break;
      }
    }
  };

  /** すべてのばねのドラッグを終了する。 */
  p.mouseReleased = () => {
    for (const spring of state.springs) {
      spring.stopDrag();
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
