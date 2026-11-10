import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** ガスバーナーの画像を読み込む。 */
  p.preload = () => {
    state.burnerImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/gasBurner.png?alt=media&token=20f7ca3b-dc1d-4459-8bd9-01bd6b5d3b94"
    );
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    settingInit(p, canvasController);
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

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
