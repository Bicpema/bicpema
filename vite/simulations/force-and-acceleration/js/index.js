import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";

/** キャンバスの論理幅 */
const W = 1000;
/** キャンバスの論理高さ（16:9） */
const H = (W * 9) / 16;
/** 地面のy座標（論理ピクセル） */
const GROUND_Y = H - 50;
/** 1ピクセルあたり何Nの力か（N/px）*/
const FORCE_SCALE = 0.05;
/** 1メートルあたりのピクセル数 */
const PIXELS_PER_METER = 60;

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.groundImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
    state.cartImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/simpleTrolley.png?alt=media&token=f614f2c8-188e-4d34-807c-d48ffd21d95c"
    );
  };

  p.setup = () => {
    settingInit(p, canvasController);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
    // フォントを非同期で読み込む（失敗してもシミュレーションは動作する）
    p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      (f) => {
        state.font = f;
      },
      () => {}
    );
  };

  p.draw = () => {
    p.scale(p.width / W);
    p.background(255);

    // マウス座標を論理座標に変換
    const logMX = p.mouseX * (W / p.width);
    const logMY = p.mouseY * (H / p.height);

    // 台車のバウンディングボックスでマウスオーバーを判定
    const cartH = state.cart.WHEEL_R * 2 + state.cart.BODY_H + state.cart.BOX_H;
    const cartW = state.cart._displayW || state.cart.BODY_W;
    const isHovering =
      logMX >= state.cart.x - cartW / 2 &&
      logMX <= state.cart.x + cartW / 2 &&
      logMY >= GROUND_Y - cartH &&
      logMY <= GROUND_Y;

    // 台車の上からドラッグ中のみ力を加える
    if (state.isDraggingFromCart && p.mouseIsPressed) {
      const drag = p.max(0, logMX - state.cart.displayRightEdge);
      state.cart.force = drag * FORCE_SCALE;
    } else {
      state.cart.force = 0;
    }

    state.cart.update(1 / FPS, PIXELS_PER_METER);

    // 台車が右端を越えたら自動リセット
    if (state.cart.x > W + 200) {
      state.cart.reset();
    }

    // 地面・レールを描画
    drawTrack(p);

    // 台車を描画
    state.cart.display(p, GROUND_Y, state.cartImg);

    // 力の矢印を描画
    const arrowY = GROUND_Y - state.cart.WHEEL_R * 2 - state.cart.BODY_H / 2;
    if (state.cart.force > 0) {
      drawForceArrow(p, state.cart.displayRightEdge, arrowY, logMX);
    } else if (isHovering && !p.mouseIsPressed) {
      drawDragHint(p, state.cart.displayRightEdge, arrowY);
    }

    // 情報パネルを描画
    drawInfoPanel(
      p,
      state.cart.force,
      state.cart.acceleration,
      state.cart.mass,
      state.cart.velocity
    );
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };

  p.mousePressed = () => {
    const logMX = p.mouseX * (W / p.width);
    const logMY = p.mouseY * (H / p.height);
    const cartH = state.cart.WHEEL_R * 2 + state.cart.BODY_H + state.cart.BOX_H;
    const cartW = state.cart._displayW || state.cart.BODY_W;
    state.isDraggingFromCart =
      logMX >= state.cart.x - cartW / 2 &&
      logMX <= state.cart.x + cartW / 2 &&
      logMY >= GROUND_Y - cartH &&
      logMY <= GROUND_Y;
  };

  p.mouseReleased = () => {
    state.isDraggingFromCart = false;
  };
};

/**
 * 地面とレールを描画する。
 * @param {*} p p5インスタンス
 */
function drawTrack(p) {
  p.image(state.groundImg, 0, GROUND_Y, W, H - GROUND_Y);
}

/**
 * 力の矢印を描画する。
 * @param {*} p p5インスタンス
 * @param {number} x1 矢印の始点x
 * @param {number} y  矢印のy座標
 * @param {number} x2 矢印の終点x（マウス位置）
 */
function drawForceArrow(p, x1, y, x2) {
  if (x2 <= x1 + 5) return;

  const arrowSize = 18;

  p.stroke(200, 40, 40);
  p.strokeWeight(5);
  p.line(x1, y, x2 - arrowSize, y);

  p.fill(200, 40, 40);
  p.noStroke();
  p.triangle(
    x2,
    y,
    x2 - arrowSize,
    y - arrowSize / 2,
    x2 - arrowSize,
    y + arrowSize / 2
  );

  p.fill(200, 40, 40);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textSize(22);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("F", (x1 + x2) / 2, y - 8);
}

/**
 * ドラッグ操作のヒントを描画する。
 * @param {*} p p5インスタンス
 * @param {number} x 台車の右端x
 * @param {number} y ヒントのy座標
 */
function drawDragHint(p, x, y) {
  p.stroke(160);
  p.strokeWeight(2);
  p.drawingContext.setLineDash([8, 6]);
  p.line(x + 10, y, x + 160, y);
  p.drawingContext.setLineDash([]);

  p.fill(160);
  p.noStroke();
  const aSize = 14;
  p.triangle(
    x + 170,
    y,
    x + 170 - aSize,
    y - aSize / 2,
    x + 170 - aSize,
    y + aSize / 2
  );

  p.fill(120);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textSize(18);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text("右にドラッグして引っ張る", x + 10, y - 10);
}

/**
 * 情報パネルを描画する。
 * @param {*} p p5インスタンス
 * @param {number} F  現在の力 (N)
 * @param {number} a  現在の加速度 (m/s²)
 * @param {number} m  質量 (kg)
 * @param {number} v  現在の速度 (m/s)
 */
function drawInfoPanel(p, F, a, m, v) {
  p.fill(0, 0, 0, 180);
  p.stroke(255, 255, 255, 60);
  p.strokeWeight(1);
  p.rect(20, 20, 290, 150, 10);

  p.fill(255);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textAlign(p.LEFT, p.TOP);

  p.textSize(26);
  p.text(`F = ${F.toFixed(2)} N`, 38, 34);
  p.text(`a = ${a.toFixed(2)} m/s²`, 38, 74);

  p.textSize(20);
  p.fill(200);
  p.text(`m = ${m.toFixed(1)} kg`, 38, 116);
  p.text(`v = ${v.toFixed(2)} m/s`, 175, 116);
}

new p5(sketch);
