import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import {
  drawXYScene,
  handlePress,
  handleDrag,
  handleRelease
} from "./logic.js";
import { V_W, MAX_FORCE } from "./constants.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** フォントを読み込む（読み込みに失敗した場合はフォントを使用しない）。 */
  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      () => {},
      () => {
        state.font = null;
      }
    );
  };

  /** キャンバスを生成し、DOM要素と初期値を設定する。 */
  p.setup = () => {
    canvasController.fullScreen(p);
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

    p.scale(p.width / V_W);
    drawXYScene(p);
  };

  /** マウス押下時に、力の矢印の先端をつかんだかを判定する。 */
  p.mousePressed = () => {
    handlePress(p);
  };

  /** マウスドラッグ時に、力の大きさと向きを更新する。 */
  p.mouseDragged = () => {
    handleDrag(p, MAX_FORCE);
  };

  /** マウスを離したときに、ドラッグ状態を解除する。 */
  p.mouseReleased = () => {
    handleRelease();
  };

  /**
   * タッチ開始時に、力の矢印の先端をつかんだかを判定する。
   * @returns ブラウザの既定動作を抑制するため常に `false`
   */
  p.touchStarted = () => {
    handlePress(p);
    return false;
  };

  /**
   * タッチ移動時に、力の大きさと向きを更新する。
   * @returns ブラウザの既定動作を抑制するため常に `false`
   */
  p.touchMoved = () => {
    handleDrag(p, MAX_FORCE);
    return false;
  };

  /**
   * タッチ終了時に、ドラッグ状態を解除する。
   * @returns ブラウザの既定動作を抑制するため常に `false`
   */
  p.touchEnded = () => {
    handleRelease();
    return false;
  };

  /** ウィンドウサイズの変更に合わせてキャンバスの大きさを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
