import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { initModal } from "../../../lib/simulation/bicpema-modal-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, FPS } from "./init.js";
import {
  drawSimulation,
  handleMousePressed,
  handleMouseReleased
} from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** 水槽と物体の画像を読み込む。 */
  p.preload = () => {
    state.tankImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/waterTank.png?alt=media&token=54c843b3-9823-47b0-9a66-0ad3f947afd3"
    );
    state.cylinderImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/buoyantObject.png?alt=media&token=102dab30-459c-4e10-a002-748b7d3598ce"
    );
  };

  /** キャンバスとDOM要素を生成し、フレームレートや設定モーダルなどの初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.frameRate(FPS);
    p.textAlign(p.CENTER, p.CENTER);
    p.loop();
    initModal({
      openSelectors: "#settingsButton",
      modalSelector: "#simulationSettingModal",
      closeSelectors: "#simulationSettingModal .modal-close"
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

  /** マウスが物体上で押されたとき、物体のドラッグを開始する。 */
  p.mousePressed = () => {
    handleMousePressed(p);
  };

  /** マウスボタンが離されたとき、物体のドラッグを終了する。 */
  p.mouseReleased = () => {
    handleMouseReleased(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスサイズを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
