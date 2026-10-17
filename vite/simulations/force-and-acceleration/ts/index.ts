import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
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
  INFO_PANEL_MUTED_TEXT_COLOR,
  INFO_PANEL_PRIMARY_TEXT_COLOR,
  INFO_PANEL_BORDER_COLOR
} from "./constants.js";

/** キャンバスの論理幅 */
const W = CANVAS_WIDTH;
/** キャンバスの論理高さ（16:9） */
const H = CANVAS_HEIGHT;
/** 地面のy座標（論理ピクセル） */
const GROUND_Y = H - GROUND_HEIGHT;

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** 地面と台車の画像を読み込む。 */
  p.preload = () => {
    state.groundImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
    state.cartImg = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/simpleTrolley.png?alt=media&token=f614f2c8-188e-4d34-807c-d48ffd21d95c"
    );
  };

  /** キャンバスを生成して初期設定を行う。 */
  p.setup = () => {
    settingInit(p, canvasController);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  let isFirstDraw = true;

  /** 毎フレーム、ドラッグ量に応じた力で台車の運動を更新し、地面・台車・力の矢印・情報パネルを描画する。 */
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

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };

  /** マウスを押した位置が台車の上かどうかを判定し、台車からのドラッグ状態を記録する。 */
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

  /** マウスを離したときに台車からのドラッグ状態を解除する。 */
  p.mouseReleased = () => {
    state.isDraggingFromCart = false;
  };
};

/**
 * 地面とレールを描画する。
 * @param p - p5インスタンス
 */
function drawTrack(p: p5) {
  p.image(state.groundImg!, 0, GROUND_Y, W, H - GROUND_Y);
}

/**
 * 力の矢印を描画する。
 * @param p - p5インスタンス
 * @param x1 - 矢印の始点x
 * @param y - 矢印のy座標
 * @param x2 - 矢印の終点x（マウス位置）
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
  p.textSize(22);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("F", (x1 + x2) / 2, y - 8);
}

/**
 * ドラッグ操作のヒントを描画する。
 * @param p - p5インスタンス
 * @param x - 台車の右端x
 * @param y - ヒントのy座標
 */
function drawDragHint(p: p5, x: number, y: number) {
  p.stroke(DRAG_HINT_COLOR);
  p.strokeWeight(2);
  p.drawingContext.setLineDash([8, 6]);
  p.line(x + 10, y, x + 160, y);
  p.drawingContext.setLineDash([]);

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
  p.textSize(18);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text("右にドラッグして引っ張る", x + 10, y - 10);
}

/**
 * 情報パネルを描画する。
 * 主要値（F・a）を大きく、最大値・質量・速度を補助値として小さく表示する。
 * @param p - p5インスタンス
 * @param F - 現在の力 (N)
 * @param a - 現在の加速度 (m/s²)
 * @param m - 質量 (kg)
 * @param v - 現在の速度 (m/s)
 * @param maxF - 力の最大値 (N)
 * @param maxA - 加速度の最大値 (m/s²)
 * @param massAtMaxA - 最大加速度を記録したときの質量 (kg)
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
  const panelX = 20;
  const panelY = 20;
  const panelW = 340;
  const panelH = 158;
  const padding = 20;
  const leftX = panelX + padding;
  const rightX = panelX + panelW - padding;

  // カード背景（白地・淡い罫線）と左端のアクセントバー
  p.fill(255, 255, 255, 235);
  p.stroke(INFO_PANEL_BORDER_COLOR);
  p.strokeWeight(1);
  p.rect(panelX, panelY, panelW, panelH, 12);
  p.noStroke();
  p.fill(...FORCE_ARROW_COLOR);
  p.rect(panelX, panelY + 12, 5, panelH - 24, 3);

  // 主要値（F・a）と、その最大値
  const rows = [
    { label: "力 F", value: F, unit: "N", max: maxF },
    { label: "加速度 a", value: a, unit: "m/s²", max: maxA }
  ];
  rows.forEach((row, i) => {
    const top = panelY + 14 + i * 46;
    p.textAlign(p.LEFT, p.TOP);
    p.fill(INFO_PANEL_MUTED_TEXT_COLOR);
    p.textSize(13);
    p.text(row.label, leftX, top);
    p.fill(INFO_PANEL_PRIMARY_TEXT_COLOR);
    p.textSize(28);
    p.text(`${row.value.toFixed(2)} ${row.unit}`, leftX, top + 14);

    p.textAlign(p.RIGHT, p.TOP);
    p.fill(INFO_PANEL_MUTED_TEXT_COLOR);
    p.textSize(13);
    p.text("最大", rightX, top);
    p.textSize(17);
    p.text(`${row.max.toFixed(2)} ${row.unit}`, rightX, top + 18);
  });

  // 区切り線
  const dividerY = panelY + 112;
  p.stroke(INFO_PANEL_BORDER_COLOR);
  p.line(leftX, dividerY, rightX, dividerY);
  p.noStroke();

  // 補助値（m・v・最大加速度に対する m × a_max）
  const fFromAMax = massAtMaxA && maxA ? massAtMaxA * maxA : 0;
  p.textAlign(p.LEFT, p.TOP);
  p.fill(INFO_PANEL_MUTED_TEXT_COLOR);
  p.textSize(17);
  p.text(`m = ${m.toFixed(1)} kg`, leftX, dividerY + 10);
  p.text(`v = ${v.toFixed(2)} m/s`, leftX + 130, dividerY + 10);
  p.textSize(13);
  p.text(`m × a_max = ${fFromAMax.toFixed(2)} N`, leftX, dividerY + 32);
}

new p5(sketch);
