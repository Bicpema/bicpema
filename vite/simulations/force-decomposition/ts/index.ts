import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
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
