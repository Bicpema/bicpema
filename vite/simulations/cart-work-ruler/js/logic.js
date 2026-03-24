// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";

// ============================================================
// レイアウト定数（仮想座標系: 1000×562）
// ============================================================

/** 仮想キャンバスの幅 */
export const V_W = 1000;
/** 仮想キャンバスの高さ */
const V_H = 562;
/** 物理座標→ピクセル変換スケール（1m = 400px） */
const PM = 400;

/** フレームレート */
const FPS = 60;

// 地面
/** 地面のy座標 */
const GROUND_Y = 490;

// 本
/** 本の左端x座標 */
const BOOK_LEFT_X = 730;
/** 本の右端x座標 */
const BOOK_RIGHT_X = 820;
/** 本の上端y座標 */
const BOOK_TOP_Y = 315;
/** 本の幅 */
const BOOK_W = BOOK_RIGHT_X - BOOK_LEFT_X;
/** 本の高さ */
const BOOK_H = GROUND_Y - BOOK_TOP_Y;

// 定規
/** 定規の厚さ */
const RULER_THICK = 18;
/** 定規の初期左端x座標（本の外側） */
const RULER_INIT_LEFT = 510;
/** 定規の初期長さ（本の外側部分） */
const RULER_INIT_LENGTH = BOOK_LEFT_X - RULER_INIT_LEFT;
/** 定規の中心y座標 */
const RULER_CENTER_Y = 413;

// 台車
/** 台車ボディの幅 */
const CART_W = 155;
/** 台車ボディの高さ */
const CART_H = 70;
/** 車輪の半径 */
const WHEEL_R = 22;
/** 台車ボディの底辺y座標 */
const CART_BODY_BOTTOM = GROUND_Y - WHEEL_R * 2;
/** 台車ボディの上辺y座標 */
const CART_BODY_TOP = CART_BODY_BOTTOM - CART_H;
/** 台車の初期左端x座標 */
export const CART_START_X = 30;
/** 接触時の台車左端x座標 */
const CART_CONTACT_X = RULER_INIT_LEFT - CART_W;

// ============================================================
// 描画関数
// ============================================================

/**
 * 地面を描画する
 * @param {*} p p5インスタンス
 */
function drawGround(p) {
  p.imageMode(p.CORNER);
  p.image(state.groundImage, 0, GROUND_Y, V_W, V_H - GROUND_Y);
}

/**
 * 台車を描画する
 * @param {*} p p5インスタンス
 * @param {number} cartLeftX 台車の左端x座標（仮想座標）
 */
function drawCart(p, cartLeftX) {
  p.imageMode(p.CORNER);
  p.image(state.cartImage, cartLeftX, GROUND_Y - CART_H + 3, CART_W, CART_H);
}

/**
 * 定規を描画する
 * @param {*} p p5インスタンス
 * @param {number} leftX 定規の左端x座標（仮想座標）
 */
function drawRuler(p, leftX) {
  if (leftX >= BOOK_LEFT_X) return;

  const topY = RULER_CENTER_Y - RULER_THICK / 2 + 30;
  const visibleLen = BOOK_LEFT_X - leftX;

  // 定規ボディ
  p.fill(218, 202, 158);
  p.stroke(158, 143, 103);
  p.strokeWeight(1);
  p.rect(leftX, topY, visibleLen, RULER_THICK, 2);

  // 目盛り
  p.stroke(120, 110, 75);
  p.strokeWeight(1);
  const startMark = Math.ceil(leftX / 10) * 10;
  for (let x = startMark; x < BOOK_LEFT_X; x += 10) {
    let markH;
    if (x % 50 === 0) {
      markH = RULER_THICK * 0.75;
    } else if (x % 20 === 0) {
      markH = RULER_THICK * 0.5;
    } else {
      markH = RULER_THICK * 0.3;
    }
    p.line(x, topY, x, topY + markH);
  }

  // ラベル
  p.fill(70);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(15);
  p.text("定規", leftX + visibleLen / 2, RULER_CENTER_Y);
}

/**
 * 本を描画する
 * @param {*} p p5インスタンス
 */
function drawBook(p) {
  if (state.bookImage?.width > 0) {
    p.imageMode(p.CORNER);
    p.image(state.bookImage, BOOK_LEFT_X, BOOK_TOP_Y, BOOK_W, BOOK_H);
  } else {
    p.fill(165, 115, 55);
    p.stroke(115, 78, 30);
    p.strokeWeight(2);
    p.rect(BOOK_LEFT_X, BOOK_TOP_Y, BOOK_W, BOOK_H, 3);

    p.fill(245, 225, 185);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(20);
    p.text("本", BOOK_LEFT_X + BOOK_W / 2, (BOOK_TOP_Y + GROUND_Y) / 2);
  }
}

/**
 * 速度の矢印を描画する
 * @param {*} p p5インスタンス
 * @param {number} cartLeftX 台車の左端x座標
 * @param {number} v 現在の速度 (m/s)
 */
function drawVelocityArrow(p, cartLeftX, v) {
  if (v <= 0.005) return;

  const arrowCenterX = cartLeftX + CART_W / 2;
  const arrowY = CART_BODY_TOP - 20;
  const arrowLen = p.min(v * 38, 130);
  const ax1 = arrowCenterX - arrowLen / 2;
  const ax2 = arrowCenterX + arrowLen / 2;

  p.stroke(255, 165, 0);
  p.strokeWeight(3);
  p.line(ax1, arrowY, ax2, arrowY);

  p.fill(255, 165, 0);
  p.noStroke();
  p.triangle(ax2, arrowY, ax2 - 13, arrowY - 7, ax2 - 13, arrowY + 7);

  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(14);
  p.fill(255, 165, 0);
  p.text("v = " + v.toFixed(2) + " m/s", arrowCenterX, arrowY - 4);
}

/**
 * 抵抗力の矢印を描画する（接触中のみ）
 * @param {*} p p5インスタンス
 * @param {number} cartLeftX 台車の左端x座標
 */
function drawForceArrow(p, cartLeftX) {
  const arrowY = CART_BODY_TOP + CART_H / 2;
  const arrowEndX = cartLeftX + 8;
  const arrowStartX = arrowEndX + 80;

  p.stroke(220, 55, 55);
  p.strokeWeight(3);
  p.line(arrowStartX, arrowY, arrowEndX, arrowY);

  p.fill(220, 55, 55);
  p.noStroke();
  p.triangle(
    arrowEndX,
    arrowY,
    arrowEndX + 13,
    arrowY - 7,
    arrowEndX + 13,
    arrowY + 7
  );

  p.textAlign(p.LEFT, p.BOTTOM);
  p.textSize(14);
  p.fill(220, 55, 55);
  p.text("F = " + state.force_N.toFixed(0) + " N", arrowStartX + 6, arrowY - 4);
}

/**
 * めり込み距離のディメンションラインを描画する
 * @param {*} p p5インスタンス
 * @param {number} d めり込み距離 (m)
 */
function drawPenetrationLine(p, d) {
  if (d < 0.001) return;

  const dPx = d * PM;
  const lineY = CART_BODY_TOP - 45;
  const x1 = RULER_INIT_LEFT;
  const x2 = RULER_INIT_LEFT + dPx;

  p.stroke(60, 185, 60);
  p.strokeWeight(2);
  p.line(x1, lineY, x2, lineY);
  p.line(x1, lineY - 7, x1, lineY + 7);
  p.line(x2, lineY - 7, x2, lineY + 7);

  p.fill(60, 185, 60);
  p.noStroke();
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(13);
  p.text("d = " + d.toFixed(3) + " m", (x1 + x2) / 2, lineY - 5);
}

/**
 * 情報パネルを描画する
 * @param {*} p p5インスタンス
 */
function drawInfoPanel(p) {
  const work = state.force_N * state.penetration_m;
  const ke = 0.5 * state.mass_kg * state.velocity_ms * state.velocity_ms;
  const ke0 = 0.5 * state.mass_kg * state.v0_ms * state.v0_ms;
  const stopped = state.phase === "stopped";

  const panelX = 10;
  const panelY = 10;
  const panelW = 390;
  const panelH = stopped ? 270 : 220;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(2);
  p.rect(panelX, panelY, panelW, panelH, 9);

  const x = panelX + 16;
  let y = panelY + 14;
  const lh = 30;

  // パラメータ
  p.fill(34);
  p.stroke(0, 0);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(14);
  p.text("質量 m = " + state.mass_kg.toFixed(1) + " kg", x, y);
  y += lh;
  p.text("初速度 v₀ = " + state.v0_ms.toFixed(1) + " m/s", x, y);
  y += lh;
  p.text("抵抗力 F = " + state.force_N.toFixed(0) + " N", x, y);
  y += 8;

  // 区切り線
  p.noStroke();
  y += 10;

  // 物理量
  p.fill(34);
  p.textSize(15);
  p.text("初期 KE = ½mv₀² = " + ke0.toFixed(3) + " J", x, y);
  y += lh;
  p.text("めり込み d = " + state.penetration_m.toFixed(3) + " m", x, y);
  y += lh;
  p.text("仕事 W = F×d = " + work.toFixed(3) + " J", x, y);
  y += lh;

  if (stopped) {
    p.fill(0, 110, 30);
    p.textSize(15);
    p.text("✓  W = ½mv₀² = " + ke0.toFixed(3) + " J", x, y);
    y += lh;
    p.fill(30, 120, 75);
    p.textSize(13);
    p.text("台車が静止 → 仕事 = 初期運動エネルギー", x, y);
    y += 22;
    p.text("（仕事と運動エネルギーの定理）", x, y);
  } else {
    p.fill(40, 40, 120);
    p.textSize(15);
    p.text("現在 KE = ½mv² = " + ke.toFixed(3) + " J", x, y);
  }
}

/**
 * 物理状態を1フレーム分更新する。
 * @param {*} p p5インスタンス
 * @param {number} dt タイムステップ (s)
 */
function update(p, dt) {
  if (state.phase === "approach") {
    state.approachX_px += state.v0_ms * PM * dt;
    if (state.approachX_px + CART_W >= RULER_INIT_LEFT) {
      state.approachX_px = CART_CONTACT_X;
      state.phase = "contact";
    }
  } else if (state.phase === "contact") {
    const decel = state.force_N / state.mass_kg;
    const dv = decel * dt;

    if (state.velocity_ms <= dv) {
      const tRem = state.velocity_ms / decel;
      state.penetration_m += 0.5 * state.velocity_ms * tRem;
      state.velocity_ms = 0;
      state.phase = "stopped";
      state.isRunning = false;
      state.playPauseButton.html("終了");
      state.playPauseButton.attribute("disabled", "");
    } else {
      const vNew = state.velocity_ms - dv;
      state.penetration_m += 0.5 * (state.velocity_ms + vNew) * dt;
      state.velocity_ms = vNew;
    }

    const maxPen = RULER_INIT_LENGTH / PM;
    if (state.penetration_m > maxPen) {
      state.penetration_m = maxPen;
      state.velocity_ms = 0;
      state.phase = "stopped";
      state.isRunning = false;
      state.playPauseButton.html("終了");
      state.playPauseButton.attribute("disabled", "");
    }
  }
}

/**
 * 1フレーム分の描画を行う。
 * @param {*} p p5インスタンス
 */
function drawScene(p) {
  let cartLeftX;
  if (state.phase === "idle") {
    cartLeftX = CART_START_X;
  } else if (state.phase === "approach") {
    cartLeftX = state.approachX_px;
  } else {
    cartLeftX = CART_CONTACT_X + state.penetration_m * PM;
  }

  const rulerLeftX = RULER_INIT_LEFT + state.penetration_m * PM;

  drawGround(p);
  drawBook(p);
  drawRuler(p, rulerLeftX);
  drawCart(p, cartLeftX);

  if (state.phase === "approach" || state.phase === "contact") {
    drawVelocityArrow(p, cartLeftX, state.velocity_ms);
  }

  if (state.phase === "contact") {
    drawForceArrow(p, cartLeftX);
  }

  if (state.phase === "contact" || state.phase === "stopped") {
    drawPenetrationLine(p, state.penetration_m);
  }

  drawInfoPanel(p);
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.scale(p.width / V_W);
  p.background(252);

  if (state.isRunning) {
    update(p, 1 / FPS);
  }

  drawScene(p);
}
