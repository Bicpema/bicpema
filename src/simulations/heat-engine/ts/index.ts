import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elementPositionInit } from "./init.js";
import { drawChamber, animateCycle } from "./logic.js";

const canvasController = new BicpemaCanvasController();

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  /** 炎・おもり・氷の画像を読み込む。 */
  p.preload = () => {
    state.img_flame = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6"
    );
    state.img_weight = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/weight.png?alt=media&token=89d6b90d-9d1e-4bf1-ae06-cb7a7b1d9b49"
    );
    state.img_ice = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/ice.png?alt=media&token=df309c39-ef41-4c38-8dd4-c1fa27e0541d"
    );
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elementPositionInit(p);
    p.textFont("sans-serif");
  };

  let isFirstDraw = true;

  /** 毎フレーム、シリンダーを描画して熱機関のサイクルを進める。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    p.background(250);
    drawChamber(p);
    animateCycle(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
