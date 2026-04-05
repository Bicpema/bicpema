import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawScene } from "./logic.js";
import { V_W, ORIGIN_X, ORIGIN_Y, GRID_STEP } from "./constants.js";

const DRAG_THRESHOLD = 20;

function getVirtualPos(clientX, clientY, p) {
  const scale = p.width / V_W;
  return { vx: clientX / scale, vy: clientY / scale };
}

function tryStartDrag(vx, vy, p) {
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

function applyDrag(vx, vy) {
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

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      () => {},
      () => {
        state.font = null;
      }
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
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

  p.mousePressed = () => {
    const { vx, vy } = getVirtualPos(p.mouseX, p.mouseY, p);
    tryStartDrag(vx, vy, p);
  };

  p.mouseDragged = () => {
    const { vx, vy } = getVirtualPos(p.mouseX, p.mouseY, p);
    applyDrag(vx, vy);
    return false;
  };

  p.mouseReleased = () => {
    state.dragging = null;
  };

  p.touchStarted = () => {
    if (p.touches.length === 0) return false;
    const { vx, vy } = getVirtualPos(p.touches[0].x, p.touches[0].y, p);
    tryStartDrag(vx, vy, p);
    return false;
  };

  p.touchMoved = () => {
    if (p.touches.length === 0) return false;
    const { vx, vy } = getVirtualPos(p.touches[0].x, p.touches[0].y, p);
    applyDrag(vx, vy);
    return false;
  };

  p.touchEnded = () => {
    state.dragging = null;
    return false;
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
