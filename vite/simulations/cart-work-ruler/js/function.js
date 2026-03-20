// function.jsはシミュレーションの描画処理専用のファイルです。

// ============================================================
// レイアウト定数（仮想座標系: 1000×562）
// ============================================================

/** 仮想キャンバスの幅 */
export const V_W = 1000;
/** 仮想キャンバスの高さ */
export const V_H = 562;
/** 物理座標→ピクセル変換スケール（1m = 400px） */
export const PM = 400;

// 地面
/** 地面のy座標 */
export const GROUND_Y = 490;

// 本
/** 本の左端x座標 */
export const BOOK_LEFT_X = 730;
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
export const RULER_INIT_LEFT = 510;
/** 定規の初期長さ（本の外側部分） */
const RULER_INIT_LENGTH = BOOK_LEFT_X - RULER_INIT_LEFT;
/** 定規の中心y座標 */
const RULER_CENTER_Y = 413;

// 台車
/** 台車ボディの幅 */
export const CART_W = 155;
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
export const CART_CONTACT_X = RULER_INIT_LEFT - CART_W;

// ============================================================
// 描画関数
// ============================================================

/**
 * 地面を描画する
 */
export function drawGround() {
  stroke(90);
  strokeWeight(2);
  line(0, GROUND_Y, V_W, GROUND_Y);

  fill(115);
  noStroke();
  rect(0, GROUND_Y, V_W, V_H - GROUND_Y);
}

/**
 * 台車を描画する
 * @param {number} cartLeftX 台車の左端x座標（仮想座標）
 */
export function drawCart(cartLeftX) {
  // --- 台車ボディ ---
  fill(70);
  stroke(30);
  strokeWeight(2);
  rect(cartLeftX, CART_BODY_TOP, CART_W, CART_H, 5);

  // ハイライト（上辺）
  fill(95);
  noStroke();
  rect(cartLeftX + 4, CART_BODY_TOP + 4, CART_W - 8, 9, 2);

  // --- 車輪 ---
  const wheelY = GROUND_Y - WHEEL_R;
  const wheelX1 = cartLeftX + 28;
  const wheelX2 = cartLeftX + CART_W - 28;

  // 外枠
  fill(35);
  stroke(15);
  strokeWeight(2);
  circle(wheelX1, wheelY, WHEEL_R * 2);
  circle(wheelX2, wheelY, WHEEL_R * 2);

  // 内側リム
  fill(75);
  noStroke();
  circle(wheelX1, wheelY, WHEEL_R);
  circle(wheelX2, wheelY, WHEEL_R);

  // ハブ
  fill(25);
  circle(wheelX1, wheelY, WHEEL_R * 0.4);
  circle(wheelX2, wheelY, WHEEL_R * 0.4);
}

/**
 * 定規を描画する
 * @param {number} leftX 定規の左端x座標（仮想座標）
 */
export function drawRuler(leftX) {
  if (leftX >= BOOK_LEFT_X) return;

  const topY = RULER_CENTER_Y - RULER_THICK / 2;
  const visibleLen = BOOK_LEFT_X - leftX;

  // 定規ボディ
  fill(218, 202, 158);
  stroke(158, 143, 103);
  strokeWeight(1);
  rect(leftX, topY, visibleLen, RULER_THICK, 2);

  // 目盛り
  stroke(120, 110, 75);
  strokeWeight(1);
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
    line(x, topY, x, topY + markH);
  }

  // ラベル
  fill(70);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);
  text("定規", leftX + visibleLen / 2, RULER_CENTER_Y);
}

/**
 * 本を描画する
 */
export function drawBook() {
  if (typeof bookImage !== "undefined" && bookImage && bookImage.width > 0) {
    imageMode(CORNER);
    image(bookImage, BOOK_LEFT_X, BOOK_TOP_Y, BOOK_W, BOOK_H);
  } else {
    fill(165, 115, 55);
    stroke(115, 78, 30);
    strokeWeight(2);
    rect(BOOK_LEFT_X, BOOK_TOP_Y, BOOK_W, BOOK_H, 3);

    fill(245, 225, 185);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text("本", BOOK_LEFT_X + BOOK_W / 2, (BOOK_TOP_Y + GROUND_Y) / 2);
  }
}

/**
 * 速度の矢印を描画する
 * @param {number} cartLeftX 台車の左端x座標
 * @param {number} v 現在の速度 (m/s)
 */
export function drawVelocityArrow(cartLeftX, v) {
  if (v <= 0.005) return;

  const arrowCenterX = cartLeftX + CART_W / 2;
  const arrowY = CART_BODY_TOP - 20;
  const arrowLen = min(v * 38, 130);
  const ax1 = arrowCenterX - arrowLen / 2;
  const ax2 = arrowCenterX + arrowLen / 2;

  stroke(255, 165, 0);
  strokeWeight(3);
  line(ax1, arrowY, ax2, arrowY);

  fill(255, 165, 0);
  noStroke();
  triangle(ax2, arrowY, ax2 - 13, arrowY - 7, ax2 - 13, arrowY + 7);

  textAlign(CENTER, BOTTOM);
  textSize(14);
  fill(255, 165, 0);
  text("v = " + v.toFixed(2) + " m/s", arrowCenterX, arrowY - 4);
}

/**
 * 抵抗力の矢印を描画する（接触中のみ）
 * @param {number} cartLeftX 台車の左端x座標
 */
export function drawForceArrow(cartLeftX, force_N) {
  const arrowY = CART_BODY_TOP + CART_H / 2;
  const arrowEndX = cartLeftX + 8;
  const arrowStartX = arrowEndX + 80;

  stroke(220, 55, 55);
  strokeWeight(3);
  line(arrowStartX, arrowY, arrowEndX, arrowY);

  fill(220, 55, 55);
  noStroke();
  triangle(
    arrowEndX,
    arrowY,
    arrowEndX + 13,
    arrowY - 7,
    arrowEndX + 13,
    arrowY + 7
  );

  textAlign(LEFT, BOTTOM);
  textSize(14);
  fill(220, 55, 55);
  text("F = " + force_N.toFixed(0) + " N", arrowStartX + 6, arrowY - 4);
}

/**
 * めり込み距離のディメンションラインを描画する
 * @param {number} d めり込み距離 (m)
 */
export function drawPenetrationLine(d) {
  if (d < 0.001) return;

  const dPx = d * PM;
  const lineY = CART_BODY_TOP - 45;
  const x1 = RULER_INIT_LEFT;
  const x2 = RULER_INIT_LEFT + dPx;

  stroke(60, 185, 60);
  strokeWeight(2);
  line(x1, lineY, x2, lineY);
  line(x1, lineY - 7, x1, lineY + 7);
  line(x2, lineY - 7, x2, lineY + 7);

  fill(60, 185, 60);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(13);
  text("d = " + d.toFixed(3) + " m", (x1 + x2) / 2, lineY - 5);
}

/**
 * 情報パネルを描画する
 */
export function drawInfoPanel(force_N, penetration_m, mass_kg, velocity_ms, v0_ms, phase) {
  const work = force_N * penetration_m;
  const ke = 0.5 * mass_kg * velocity_ms * velocity_ms;
  const ke0 = 0.5 * mass_kg * v0_ms * v0_ms;
  const stopped = phase === "stopped";

  const panelX = 10;
  const panelY = 10;
  const panelW = 390;
  const panelH = stopped ? 270 : 220;

  fill(0, 0, 0, 185);
  noStroke();
  rect(panelX, panelY, panelW, panelH, 9);

  const x = panelX + 16;
  let y = panelY + 14;
  const lh = 30;

  // パラメータ
  fill(185, 210, 255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text("質量 m = " + mass_kg.toFixed(1) + " kg", x, y);
  y += lh;
  text("初速度 v₀ = " + v0_ms.toFixed(1) + " m/s", x, y);
  y += lh;
  text("抵抗力 F = " + force_N.toFixed(0) + " N", x, y);
  y += 8;

  // 区切り線
  stroke(140, 140, 175);
  strokeWeight(1);
  line(x, y, panelX + panelW - 16, y);
  noStroke();
  y += 10;

  // 物理量
  fill(255);
  textSize(15);
  text("初期 KE = ½mv₀² = " + ke0.toFixed(3) + " J", x, y);
  y += lh;
  text("めり込み d = " + penetration_m.toFixed(3) + " m", x, y);
  y += lh;
  text("仕事 W = F×d = " + work.toFixed(3) + " J", x, y);
  y += lh;

  if (stopped) {
    fill(105, 255, 125);
    textSize(15);
    text("✓  W = ½mv₀² = " + ke0.toFixed(3) + " J", x, y);
    y += lh;
    fill(195, 255, 200);
    textSize(13);
    text("台車が静止 → 仕事 = 初期運動エネルギー", x, y);
    y += 22;
    text("（仕事と運動エネルギーの定理）", x, y);
  } else {
    fill(195, 195, 255);
    textSize(15);
    text("現在 KE = ½mv² = " + ke.toFixed(3) + " J", x, y);
  }
}
