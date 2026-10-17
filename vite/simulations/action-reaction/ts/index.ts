// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { V_W } from "./constants.js";
import { elementSelectInit, settingInit, valueInit } from "./init.js";
import {
  endDrag,
  moveDrag,
  startDrag,
  updateHover
} from "./element-function.js";
import { drawSimulation } from "./logic.js";
import { state } from "./state.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();
  let isFirstDraw = true;

  /**
   * ポインターの位置を仮想座標へ変換する。
   * @param x - キャンバス上のX座標
   * @param y - キャンバス上のY座標
   * @returns 仮想座標
   */
  const toVirtual = (x: number, y: number) => ({
    x: (x / p.width) * V_W,
    y: (y / p.width) * V_W
  });

  /**
   * イベントの発生元がキャンバスかを判定する。
   * 設定パネルやボタン上の操作でドラッグが始まったり、既定動作が抑止されたりしないようにする。
   * @param event - ブラウザのイベント
   * @returns キャンバス上のイベントなら true
   */
  const isOnCanvas = (event?: Event) =>
    event?.target === (p as unknown as { canvas: HTMLCanvasElement }).canvas;

  /**
   * 最初のタッチ位置を仮想座標で返す。
   * @returns 仮想座標（タッチがなければ null）
   */
  const firstTouch = () => {
    // @types/p5ではtouches[]の要素はobject型のため、ドキュメント通りx/yプロパティを持つ座標として扱う
    const touch = p.touches[0] as { x: number; y: number } | undefined;
    return touch ? toVirtual(touch.x, touch.y) : null;
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    valueInit(p);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    drawSimulation(p);
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  /**
   * マウス押下位置でドラッグを開始する。
   * @param event - ブラウザのイベント
   */
  p.mousePressed = (event?: Event) => {
    if (!isOnCanvas(event)) return;
    const v = toVirtual(p.mouseX, p.mouseY);
    startDrag(v.x, v.y);
    moveDrag(v.x, v.y);
    updateHover(p, v.x, v.y);
  };

  /** マウス移動に合わせて矢印の強調表示とカーソルを更新する。 */
  p.mouseMoved = () => {
    const v = toVirtual(p.mouseX, p.mouseY);
    updateHover(p, v.x, v.y);
  };

  /** マウスのドラッグ中の本の位置を更新する。 */
  p.mouseDragged = () => {
    if (!state.drag) return;
    const v = toVirtual(p.mouseX, p.mouseY);
    moveDrag(v.x, v.y);
  };

  /** マウスボタンが離されたときにドロップを確定する。 */
  p.mouseReleased = () => {
    if (!state.drag) return;
    endDrag();
    const v = toVirtual(p.mouseX, p.mouseY);
    updateHover(p, v.x, v.y);
  };

  /**
   * タッチ開始位置でドラッグを開始する。
   * @param event - ブラウザのイベント
   * @returns キャンバス上ではブラウザ既定のタッチ動作を抑止するため `false`
   */
  p.touchStarted = (event?: Event) => {
    if (!isOnCanvas(event)) return true;
    const v = firstTouch();
    if (v) {
      startDrag(v.x, v.y);
      moveDrag(v.x, v.y);
    }
    return false;
  };

  /**
   * タッチ位置に合わせてドラッグ中の本を動かす。
   * @param event - ブラウザのイベント
   * @returns ドラッグ中はスクロールを抑止するため `false`
   */
  p.touchMoved = (event?: Event) => {
    if (!isOnCanvas(event) && !state.drag) return true;
    const v = firstTouch();
    if (v && state.drag) moveDrag(v.x, v.y);
    return false;
  };

  /**
   * タッチ終了時にドロップを確定する。
   * @param event - ブラウザのイベント
   * @returns キャンバス上ではブラウザ既定の動作を抑止するため `false`
   */
  p.touchEnded = (event?: Event) => {
    if (!isOnCanvas(event) && !state.drag) return true;
    endDrag();
    return false;
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定し、再描画を要求する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    state.dirty = true;
  };
};

new p5(sketch);
