import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { initModal } from "../../../lib/simulation/bicpema-modal-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawScene } from "./logic.js";
import { V_W, ORIGIN_X, ORIGIN_Y, GRID_STEP } from "./constants.js";

const DRAG_THRESHOLD = 20;

/**
 * 画面上の座標を仮想座標系の座標に変換する。
 * @param clientX - 画面上のx座標
 * @param clientY - 画面上のy座標
 * @param p - p5インスタンス
 * @returns 仮想座標系の座標（`vx`, `vy`）
 */
function getVirtualPos(clientX: number, clientY: number, p: p5) {
  const scale = p.width / V_W;
  return { vx: clientX / scale, vy: clientY / scale };
}

/**
 * 指定した座標が力F1・F2の矢印の先端に近い場合、その矢印のドラッグを開始する。
 * @param vx - 仮想座標系のx座標
 * @param vy - 仮想座標系のy座標
 * @param p - p5インスタンス
 */
function tryStartDrag(vx: number, vy: number, p: p5) {
  const f1AbsX = ORIGIN_X + state.f1TipX;
  const f1AbsY = ORIGIN_Y + state.f1TipY;
  const f2AbsX = ORIGIN_X + state.f2TipX;
  const f2AbsY = ORIGIN_Y + state.f2TipY;
  if (p.dist(vx, vy, f1AbsX, f1AbsY) < DRAG_THRESHOLD) {
    state.dragging = "f1";
  } else if (p.dist(vx, vy, f2AbsX, f2AbsY) < DRAG_THRESHOLD) {
    state.dragging = "f2";
  }
}

/**
 * ドラッグ中の矢印の先端を、グリッドにスナップした座標へ移動する（原点には移動しない）。
 * @param vx - 仮想座標系のx座標
 * @param vy - 仮想座標系のy座標
 */
function applyDrag(vx: number, vy: number) {
  if (state.dragging === "f1") {
    const rx = Math.round((vx - ORIGIN_X) / GRID_STEP) * GRID_STEP;
    const ry = Math.round((vy - ORIGIN_Y) / GRID_STEP) * GRID_STEP;
    if (rx !== 0 || ry !== 0) {
      state.f1TipX = rx;
      state.f1TipY = ry;
    }
  } else if (state.dragging === "f2") {
    const rx = Math.round((vx - ORIGIN_X) / GRID_STEP) * GRID_STEP;
    const ry = Math.round((vy - ORIGIN_Y) / GRID_STEP) * GRID_STEP;
    if (rx !== 0 || ry !== 0) {
      state.f2TipX = rx;
      state.f2TipY = ry;
    }
  }
}

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** フォントを読み込む。 */
  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      () => {},
      () => {
        state.font = null;
      }
    );
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    initModal({
      openSelectors: "#forceSettingsButton",
      modalSelector: "#forceSettingsModal",
      closeSelectors: ".modal-close"
    });
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行い、矢印の先端付近ではカーソルを手の形にする。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / V_W);
    drawScene(p);

    // 先端付近でカーソルをハンドルに変更
    const { vx, vy } = getVirtualPos(p.mouseX, p.mouseY, p);
    const f1AbsX = ORIGIN_X + state.f1TipX;
    const f1AbsY = ORIGIN_Y + state.f1TipY;
    const f2AbsX = ORIGIN_X + state.f2TipX;
    const f2AbsY = ORIGIN_Y + state.f2TipY;
    if (
      p.dist(vx, vy, f1AbsX, f1AbsY) < DRAG_THRESHOLD ||
      p.dist(vx, vy, f2AbsX, f2AbsY) < DRAG_THRESHOLD
    ) {
      p.cursor(p.HAND);
    } else {
      p.cursor(p.ARROW);
    }
  };

  /** マウスを押した位置が矢印の先端付近であれば、その矢印のドラッグを開始する。 */
  p.mousePressed = () => {
    const { vx, vy } = getVirtualPos(p.mouseX, p.mouseY, p);
    tryStartDrag(vx, vy, p);
  };

  /**
   * ドラッグ中の矢印の先端をマウス位置に合わせて移動する。
   * @returns ブラウザの既定の動作を抑止するため `false`
   */
  p.mouseDragged = () => {
    const { vx, vy } = getVirtualPos(p.mouseX, p.mouseY, p);
    applyDrag(vx, vy);
    return false;
  };

  /** マウスを離したときにドラッグを終了する。 */
  p.mouseReleased = () => {
    state.dragging = null;
  };

  /**
   * タッチした位置が矢印の先端付近であれば、その矢印のドラッグを開始する。
   * @returns ブラウザの既定の動作を抑止するため `false`
   */
  p.touchStarted = () => {
    if (p.touches.length === 0) return false;
    // @types/p5ではtouches[]の要素はobject型のため、ドキュメント通りx/yプロパティを持つ座標として扱う
    const touch = p.touches[0] as { x: number; y: number };
    const { vx, vy } = getVirtualPos(touch.x, touch.y, p);
    tryStartDrag(vx, vy, p);
    return false;
  };

  /**
   * ドラッグ中の矢印の先端をタッチ位置に合わせて移動する。
   * @returns ブラウザの既定の動作を抑止するため `false`
   */
  p.touchMoved = () => {
    if (p.touches.length === 0) return false;
    // @types/p5ではtouches[]の要素はobject型のため、ドキュメント通りx/yプロパティを持つ座標として扱う
    const touch = p.touches[0] as { x: number; y: number };
    const { vx, vy } = getVirtualPos(touch.x, touch.y, p);
    applyDrag(vx, vy);
    return false;
  };

  /**
   * タッチを離したときにドラッグを終了する。
   * @returns ブラウザの既定の動作を抑止するため `false`
   */
  p.touchEnded = () => {
    state.dragging = null;
    return false;
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
