// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state, V_W } from "./state.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { startDrag, updateDrag, stopDrag } from "./element-function.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** キャンバスとDOM要素を生成して初期値を設定し、フォントを非同期で読み込む。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    // Firebase Storage が到達不能でもブロックしないよう setup 内で非同期読み込み
    p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      (f: p5.Font) => {
        state.font = f;
      },
      () => {
        state.font = null;
      }
    );
  };

  let isFirstDraw = true;

  /** 毎フレーム、ドラッグ中の力を更新してシミュレーションを描画する。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    if (state.dragging) {
      const vmx = (p.mouseX / p.width) * V_W;
      const vmy = (p.mouseY / p.width) * V_W;
      updateDrag(vmx, vmy);
    }
    drawSimulation(p);
  };

  /** マウス押下位置を仮想座標に変換してドラッグを開始する。 */
  p.mousePressed = () => {
    const vmx = (p.mouseX / p.width) * V_W;
    const vmy = (p.mouseY / p.width) * V_W;
    startDrag(vmx, vmy);
  };

  /** マウスボタンが離されたときにドラッグを終了する。 */
  p.mouseReleased = () => {
    stopDrag();
  };

  /**
   * タッチ開始位置を仮想座標に変換してドラッグを開始する。
   * @returns ブラウザ既定のタッチ動作を抑止するため常に `false`
   */
  p.touchStarted = () => {
    if (p.touches.length > 0) {
      // @types/p5ではtouches[]の要素はobject型のため、ドキュメント通りx/yプロパティを持つ座標として扱う
      const touch = p.touches[0] as { x: number; y: number };
      const vmx = (touch.x / p.width) * V_W;
      const vmy = (touch.y / p.width) * V_W;
      startDrag(vmx, vmy);
    }
    return false;
  };

  /**
   * ドラッグ中であればタッチ位置に合わせてドラッグを更新する。
   * @returns ブラウザ既定のタッチ動作を抑止するため常に `false`
   */
  p.touchMoved = () => {
    if (p.touches.length > 0 && state.dragging) {
      // @types/p5ではtouches[]の要素はobject型のため、ドキュメント通りx/yプロパティを持つ座標として扱う
      const touch = p.touches[0] as { x: number; y: number };
      const vmx = (touch.x / p.width) * V_W;
      const vmy = (touch.y / p.width) * V_W;
      updateDrag(vmx, vmy);
    }
    return false;
  };

  /**
   * タッチ終了時にドラッグを終了する。
   * @returns ブラウザ既定のタッチ動作を抑止するため常に `false`
   */
  p.touchEnded = () => {
    stopDrag();
    return false;
  };

  /** ウィンドウサイズの変更に合わせてキャンバスサイズを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
