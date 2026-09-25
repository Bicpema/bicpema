import p5 from "p5";
import { loadFontFromUrl } from "../../../js/bicpema-font.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  FORCE_SCALE,
  PIXELS_PER_METER,
  CART_RESET_MARGIN,
  MIN_ARROW_DRAG_DISTANCE,
  FORCE_ARROW_COLOR,
  DRAG_HINT_COLOR,
  INFO_PANEL_MUTED_TEXT_COLOR
} from "./constants.js";

/** キャンバスの論理幅 */
const W = CANVAS_WIDTH;
/** キャンバスの論理高さ（16:9） */
const H = CANVAS_HEIGHT;
/** 地面のy座標（論理ピクセル） */
const GROUND_Y = H - GROUND_HEIGHT;

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      [state.groundImg, state.cartImg] = await Promise.all([
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
        ),
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/simpleTrolley.png?alt=media&token=f614f2c8-188e-4d34-807c-d48ffd21d95c"
        )
      ]);
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
    settingInit(p, canvasController);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
    // フォントを非同期で読み込む（失敗してもシミュレーションは動作する）
    loadFontFromUrl(
      p,
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    )
      .then((f: p5.Font) => {
        state.font = f;
      })
      .catch(() => {});
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / W);
    p.background(255);

    // valueInit()で生成済みのためnullになりえない
    const cart = state.cart!;

    // マウス座標を論理座標に変換
    const logMX = p.mouseX * (W / p.width);
    const logMY = p.mouseY * (H / p.height);

    // 台車のバウンディングボックスでマウスオーバーを判定
    const cartH = cart.WHEEL_R * 2 + cart.BODY_H + cart.BOX_H;
    const cartW = cart._displayW || cart.BODY_W;
    const isHovering =
      logMX >= cart.x - cartW / 2 &&
      logMX <= cart.x + cartW / 2 &&
      logMY >= GROUND_Y - cartH &&
      logMY <= GROUND_Y;

    // 台車の上からドラッグ中のみ力を加える
    if (state.isDraggingFromCart && p.mouseIsPressed) {
      const drag = p.max(0, logMX - cart.displayRightEdge);
      cart.force = drag * FORCE_SCALE;
    } else {
      cart.force = 0;
    }

    cart.update(1 / FPS, PIXELS_PER_METER);

    // 台車が右端を越えたら自動リセット
    if (cart.x > W + CART_RESET_MARGIN) {
      cart.reset();
    }

    // 地面・レールを描画
    drawTrack(p);

    // 台車を描画
    cart.display(p, GROUND_Y, state.cartImg!);

    // 力の矢印を描画
    const arrowY = GROUND_Y - cart.WHEEL_R * 2 - cart.BODY_H / 2;
    if (cart.force > 0) {
      drawForceArrow(p, cart.displayRightEdge, arrowY, logMX);
    } else if (isHovering && !p.mouseIsPressed) {
      drawDragHint(p, cart.displayRightEdge, arrowY);
    }

    // 情報パネルを描画
    drawInfoPanel(
      p,
      cart.force,
      cart.acceleration,
      cart.mass,
      cart.velocity,
      cart.maxForce,
      cart.maxAcceleration,
      cart.massAtMaxAcceleration
    );
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };

  p.mousePressed = () => {
    // valueInit()で生成済みのためnullになりえない
    const cart = state.cart!;
    const logMX = p.mouseX * (W / p.width);
    const logMY = p.mouseY * (H / p.height);
    const cartH = cart.WHEEL_R * 2 + cart.BODY_H + cart.BOX_H;
    const cartW = cart._displayW || cart.BODY_W;
    state.isDraggingFromCart =
      logMX >= cart.x - cartW / 2 &&
      logMX <= cart.x + cartW / 2 &&
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
function drawTrack(p: p5) {
  p.image(state.groundImg!, 0, GROUND_Y, W, H - GROUND_Y);
}

/**
 * 力の矢印を描画する。
 * @param {*} p p5インスタンス
 * @param {number} x1 矢印の始点x
 * @param {number} y  矢印のy座標
 * @param {number} x2 矢印の終点x（マウス位置）
 */
function drawForceArrow(p: p5, x1: number, y: number, x2: number) {
  if (x2 <= x1 + MIN_ARROW_DRAG_DISTANCE) return;

  const arrowSize = 18;

  p.stroke(...FORCE_ARROW_COLOR);
  p.strokeWeight(5);
  p.line(x1, y, x2 - arrowSize, y);

  p.fill(...FORCE_ARROW_COLOR);
  p.noStroke();
  p.triangle(
    x2,
    y,
    x2 - arrowSize,
    y - arrowSize / 2,
    x2 - arrowSize,
    y + arrowSize / 2
  );

  p.fill(...FORCE_ARROW_COLOR);
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
function drawDragHint(p: p5, x: number, y: number) {
  p.stroke(DRAG_HINT_COLOR);
  p.strokeWeight(2);
  (p.drawingContext as CanvasRenderingContext2D).setLineDash([8, 6]);
  p.line(x + 10, y, x + 160, y);
  (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

  p.fill(DRAG_HINT_COLOR);
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
function drawInfoPanel(
  p: p5,
  F: number,
  a: number,
  m: number,
  v: number,
  maxF: number,
  maxA: number,
  massAtMaxA: number
) {
  p.fill(0, 0, 0, 180);
  p.stroke(255, 255, 255, 60);
  p.strokeWeight(1);
  const panelX = 20;
  const panelY = 20;
  const panelW = 330;
  const panelH = 150;
  p.rect(panelX, panelY, panelW, panelH, 10);

  p.fill(255);
  p.noStroke();
  if (state.font) p.textFont(state.font);

  const leftX = panelX + 18;
  const maxX = panelX + panelW - 18;

  p.textAlign(p.LEFT, p.TOP);
  p.textSize(26);
  p.text(`F = ${F.toFixed(2)} N`, leftX, panelY + 14);
  p.text(`a = ${a.toFixed(2)} m/s²`, leftX, panelY + 54);

  // 最大値を右側に表示
  p.textSize(18);
  p.fill(230);
  p.textAlign(p.RIGHT, p.TOP);
  p.text(`${maxF.toFixed(2)} N (max)`, maxX, panelY + 14);
  p.text(`${maxA.toFixed(2)} m/s² (max)`, maxX, panelY + 54);

  // F = m * a を示す補助表示（最大加速度に対する力）
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(14);
  p.fill(INFO_PANEL_MUTED_TEXT_COLOR);
  const fFromAMax = massAtMaxA && maxA ? massAtMaxA * maxA : 0;
  p.text(`m × a_max = ${fFromAMax.toFixed(2)} N`, leftX, panelY + 94);

  p.textSize(20);
  p.fill(INFO_PANEL_MUTED_TEXT_COLOR);
  p.text(`m = ${m.toFixed(1)} kg`, leftX, panelY + 116);
  p.text(`v = ${v.toFixed(2)} m/s`, leftX + 137, panelY + 116);
}

new p5(sketch);
