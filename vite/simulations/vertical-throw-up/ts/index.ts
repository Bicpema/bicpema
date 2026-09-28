import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { elCreate, initValue, FPS } from "./init.js";
import { CANVAS_VIRTUAL_WIDTH } from "./constants.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** フォントと地面・ボールの画像を読み込む。 */
  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
    state.ballImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FbrownBall.png?alt=media&token=573180c7-0aff-40cd-b31c-51b5e83dda2e"
    );
  };

  /** キャンバスを生成し、DOM要素と初期値を設定する。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  let isFirstDraw = true;

  /** 毎フレーム、ボールの位置を更新して描画する。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.background(255);
    const { ball } = state;
    if (ball) {
      ball.update(1 / FPS);
    }
    p.scale(p.width / CANVAS_VIRTUAL_WIDTH);
    if (ball) {
      ball.display(p, (CANVAS_VIRTUAL_WIDTH * p.height) / p.width);
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスの大きさを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
