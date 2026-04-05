// logic.js はシミュレーションの描画ロジックと物理計算を管理するファイルです。

import {
  state,
  V_W,
  V_H,
  PANEL_DIVIDER_X,
  G,
  DESK_CENTER_X,
  DESK_TOP_Y,
  DESK_WIDTH,
  DESK_THICKNESS,
  DESK_LEG_WIDTH,
  DESK_LEG_HEIGHT,
  FLOOR_Y,
  BOOK_WIDTH,
  BOOK_HEIGHT,
  MAX_ARROW_LEN,
  MIN_ARROW_LEN,
  GRAVITY_COLOR,
  REACTION_EARTH_COLOR,
  NORMAL_COLOR,
  REACTION_DESK_COLOR,
  FLOOR_NORMAL_COLOR,
} from "./state.js";

// ────────────────────────────────────────────
// 物理計算
// ────────────────────────────────────────────

/**
 * 現在の状態から各力を計算する。
 * @returns {{ W: number, N: number }} W: 重力(N), N: 垂直抗力(N)
 */
function calcForces() {
  const W = state.numBooks * state.bookMass * G;
  const N = W; // 釣り合い条件
  return { W, N };
}

/**
 * 力の大きさに対応する矢印の長さ（px）を返す。
 * @param {number} force 力の大きさ（N）
 * @param {number} maxForce 最大の力（N）
 * @returns {number} 矢印の長さ（px）
 */
function arrowLen(force, maxForce) {
  if (maxForce < 0.001) return MIN_ARROW_LEN;
  const len = (force / maxForce) * MAX_ARROW_LEN;
  return Math.max(MIN_ARROW_LEN, Math.min(MAX_ARROW_LEN, len));
}

// ────────────────────────────────────────────
// 描画ユーティリティ
// ────────────────────────────────────────────

/**
 * 矢印を描画する（軸 + 三角形の矢頭）。
 * @param {*} p p5 インスタンス
 * @param {number} x1 始点 X
 * @param {number} y1 始点 Y
 * @param {number} x2 終点 X
 * @param {number} y2 終点 Y
 * @param {number[]} col [R, G, B]
 * @param {number} sw 線幅（px）
 * @param {number} hs 矢頭サイズ（px）
 */
function drawArrow(p, x1, y1, x2, y2, col, sw = 3, hs = 11) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;

  const ux = dx / len;
  const uy = dy / len;

  p.stroke(col[0], col[1], col[2]);
  p.strokeWeight(sw);
  p.line(x1, y1, x2 - ux * hs, y2 - uy * hs);

  p.fill(col[0], col[1], col[2]);
  p.noStroke();
  p.triangle(
    x2,
    y2,
    x2 - ux * hs - uy * hs * 0.5,
    y2 - uy * hs + ux * hs * 0.5,
    x2 - ux * hs + uy * hs * 0.5,
    y2 - uy * hs - ux * hs * 0.5
  );
}

// ────────────────────────────────────────────
// 左パネル描画（物理シーン）
// ────────────────────────────────────────────

/**
 * 床（ハッチング付き）を描画する。
 * @param {*} p p5 インスタンス
 */
function drawFloor(p) {
  p.fill(150, 140, 120);
  p.noStroke();
  p.rect(0, FLOOR_Y, PANEL_DIVIDER_X, V_H - FLOOR_Y);

  p.stroke(120, 110, 95);
  p.strokeWeight(1.5);
  for (let x = -30; x < PANEL_DIVIDER_X + 30; x += 20) {
    p.line(x, FLOOR_Y, x + 30, FLOOR_Y + 30);
  }

  p.stroke(100, 90, 75);
  p.strokeWeight(2.5);
  p.line(0, FLOOR_Y, PANEL_DIVIDER_X, FLOOR_Y);
}

/**
 * 机（天板 + 脚2本）を描画する。
 * @param {*} p p5 インスタンス
 */
function drawDesk(p) {
  const deskLeft = DESK_CENTER_X - DESK_WIDTH / 2;
  const deskRight = DESK_CENTER_X + DESK_WIDTH / 2;
  const deskBottom = DESK_TOP_Y + DESK_THICKNESS;
  const legBottom = FLOOR_Y;

  // 脚（左）
  const legLX = deskLeft + 10;
  p.fill(140, 100, 60);
  p.stroke(100, 70, 40);
  p.strokeWeight(1.5);
  p.rect(legLX, deskBottom, DESK_LEG_WIDTH, legBottom - deskBottom);

  // 脚（右）
  const legRX = deskRight - 10 - DESK_LEG_WIDTH;
  p.rect(legRX, deskBottom, DESK_LEG_WIDTH, legBottom - deskBottom);

  // 天板
  p.fill(180, 130, 75);
  p.stroke(130, 90, 50);
  p.strokeWeight(1.5);
  p.rect(deskLeft, DESK_TOP_Y, DESK_WIDTH, DESK_THICKNESS, 3);

  // 机のラベル
  p.fill(80, 55, 25);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("机", DESK_CENTER_X, DESK_TOP_Y + DESK_THICKNESS / 2);
}

/**
 * 本のスタックを描画する。
 * @param {*} p p5 インスタンス
 */
function drawBooks(p) {
  const n = state.numBooks;
  if (n === 0) return;

  const bookColors = [
    [180, 80, 80],
    [80, 120, 180],
    [80, 160, 90],
    [180, 140, 60],
    [140, 80, 180],
  ];
  const bookStrokeColors = [
    [130, 50, 50],
    [50, 80, 140],
    [50, 120, 60],
    [130, 100, 30],
    [100, 50, 140],
  ];

  for (let i = 0; i < n; i++) {
    const bookTop = DESK_TOP_Y - (i + 1) * BOOK_HEIGHT;
    const bookLeft = DESK_CENTER_X - BOOK_WIDTH / 2;
    const col = bookColors[i % bookColors.length];
    const scol = bookStrokeColors[i % bookStrokeColors.length];

    p.fill(col[0], col[1], col[2]);
    p.stroke(scol[0], scol[1], scol[2]);
    p.strokeWeight(1.5);
    p.rect(bookLeft, bookTop, BOOK_WIDTH, BOOK_HEIGHT, 2);

    // 本のページ線
    p.stroke(scol[0] + 30, scol[1] + 30, scol[2] + 30);
    p.strokeWeight(0.8);
    p.line(bookLeft + 8, bookTop + 2, bookLeft + 8, bookTop + BOOK_HEIGHT - 2);

    // 本のラベル
    p.fill(255, 255, 255, 200);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("本", DESK_CENTER_X, bookTop + BOOK_HEIGHT / 2);
  }
}

/**
 * 本・机に働く力の矢印を描画する。
 * @param {*} p p5 インスタンス
 * @param {number} W 重力の大きさ（N）
 * @param {number} N 垂直抗力の大きさ（N）
 */
function drawForceArrows(p, W, N) {
  const n = state.numBooks;

  // 本のスタックの幾何
  const stackTop = DESK_TOP_Y - n * BOOK_HEIGHT;
  const stackCenterY = DESK_TOP_Y - n * BOOK_HEIGHT / 2;

  // 最大力（スケール計算用）
  const maxForce = Math.max(W, N, 0.001);
  const wLen = arrowLen(W, maxForce);
  const nLen = arrowLen(N, maxForce);

  // ── 本に働く力 ──────────────────────

  if (n > 0) {
    // 重力（地球→本, 赤, 下向き）
    // 本の右側に表示
    const gx = DESK_CENTER_X + BOOK_WIDTH / 2 + 30;
    const gyStart = stackCenterY;
    const gyEnd = stackCenterY + wLen;
    drawArrow(p, gx, gyStart, gx, gyEnd, GRAVITY_COLOR, 3, 11);

    // 重力ラベル
    p.fill(GRAVITY_COLOR[0], GRAVITY_COLOR[1], GRAVITY_COLOR[2]);
    p.noStroke();
    p.textSize(13);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`重力 W`, gx + 14, gyStart + wLen * 0.4);
    p.textSize(12);
    p.text(`= ${W.toFixed(1)} N`, gx + 14, gyStart + wLen * 0.4 + 16);

    // 垂直抗力（机→本, 青, 上向き）
    // 本の左側に表示
    const nx = DESK_CENTER_X - BOOK_WIDTH / 2 - 30;
    const nyStart = stackCenterY;
    const nyEnd = stackCenterY - nLen;
    drawArrow(p, nx, nyStart, nx, nyEnd, NORMAL_COLOR, 3, 11);

    // 垂直抗力ラベル
    p.fill(NORMAL_COLOR[0], NORMAL_COLOR[1], NORMAL_COLOR[2]);
    p.noStroke();
    p.textSize(13);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`垂直抗力 N`, nx - 14, nyStart - nLen * 0.4);
    p.textSize(12);
    p.text(`= ${N.toFixed(1)} N`, nx - 14, nyStart - nLen * 0.4 + 16);

    // ── 机に働く力（本→机, 紫, 下向き）──────
    const deskFx = DESK_CENTER_X;
    const deskFyStart = DESK_TOP_Y;
    const deskFyEnd = DESK_TOP_Y + wLen * 0.7;
    drawArrow(
      p,
      deskFx,
      deskFyStart,
      deskFx,
      deskFyEnd,
      REACTION_DESK_COLOR,
      3,
      11
    );

    // 本→机 力ラベル
    p.fill(REACTION_DESK_COLOR[0], REACTION_DESK_COLOR[1], REACTION_DESK_COLOR[2]);
    p.noStroke();
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`本→机: ${N.toFixed(1)} N`, deskFx, deskFyEnd + 4);
  }

  // ── 地面→机の力（緑, 上向き）──────
  const groundFx = DESK_CENTER_X - 60;
  const groundFyStart = FLOOR_Y;
  const deskTotalWeight = (state.numBooks * state.bookMass + 5.0) * G;
  const groundFLen = Math.max(MIN_ARROW_LEN * 0.6, Math.min(80, deskTotalWeight * 4));
  const groundFyEnd = FLOOR_Y - groundFLen;
  drawArrow(p, groundFx, groundFyStart, groundFx, groundFyEnd, FLOOR_NORMAL_COLOR, 2.5, 10);

  p.fill(FLOOR_NORMAL_COLOR[0], FLOOR_NORMAL_COLOR[1], FLOOR_NORMAL_COLOR[2]);
  p.noStroke();
  p.textSize(10);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("地面→机", groundFx, groundFyEnd - 2);
}

/**
 * 本が0冊のときのヒントメッセージを表示する。
 * @param {*} p p5 インスタンス
 */
function drawEmptyHint(p) {
  if (state.numBooks > 0) return;

  p.fill(100, 100, 120, 180);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    "「＋ 本を追加」ボタンで本を載せてください",
    PANEL_DIVIDER_X / 2,
    DESK_TOP_Y - 60
  );
}

/**
 * 力の説明ラベル（左上）を描画する。
 * @param {*} p p5 インスタンス
 */
function drawLegend(p) {
  const lx = 12;
  const ly = 16;
  const lineH = 20;

  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.noStroke();

  // 重力
  p.fill(GRAVITY_COLOR[0], GRAVITY_COLOR[1], GRAVITY_COLOR[2]);
  p.text("● 重力（地球→本）", lx, ly);
  // 垂直抗力
  p.fill(NORMAL_COLOR[0], NORMAL_COLOR[1], NORMAL_COLOR[2]);
  p.text("● 垂直抗力（机→本）", lx, ly + lineH);
  // 本→机
  p.fill(REACTION_DESK_COLOR[0], REACTION_DESK_COLOR[1], REACTION_DESK_COLOR[2]);
  p.text("● 本が机に及ぼす力", lx, ly + lineH * 2);
  // 地面→机
  p.fill(FLOOR_NORMAL_COLOR[0], FLOOR_NORMAL_COLOR[1], FLOOR_NORMAL_COLOR[2]);
  p.text("● 地面が机に及ぼす力", lx, ly + lineH * 3);
}

/**
 * 左パネル全体を描画する。
 * @param {*} p p5 インスタンス
 */
function drawPhysicsPanel(p) {
  // 背景
  p.fill(240, 244, 250);
  p.noStroke();
  p.rect(0, 0, PANEL_DIVIDER_X, V_H);

  const { W, N } = calcForces();

  drawFloor(p);
  drawDesk(p);
  drawBooks(p);
  drawForceArrows(p, W, N);
  drawEmptyHint(p);
  drawLegend(p);

  // 本の数表示
  p.fill(50);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(`本の数: ${state.numBooks} 冊`, PANEL_DIVIDER_X / 2, V_H - 8);
}

// ────────────────────────────────────────────
// 右パネル描画（作用・反作用の説明）
// ────────────────────────────────────────────

/**
 * 小さな本のアイコンを描画する。
 * @param {*} p p5 インスタンス
 * @param {number} cx 中心 X
 * @param {number} cy 中心 Y
 * @param {number} w 幅
 * @param {number} h 高さ
 */
function drawBookIcon(p, cx, cy, w = 50, h = 24) {
  p.fill(180, 80, 80);
  p.stroke(130, 50, 50);
  p.strokeWeight(1.5);
  p.rect(cx - w / 2, cy - h / 2, w, h, 2);
  p.fill(255, 255, 255, 200);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("本", cx, cy);
}

/**
 * 小さな机のアイコンを描画する。
 * @param {*} p p5 インスタンス
 * @param {number} cx 中心 X
 * @param {number} cy 上端 Y
 * @param {number} w 幅
 */
function drawDeskIcon(p, cx, cy, w = 70) {
  const th = 12;
  const lw = 8;
  const lh = 22;
  // 天板
  p.fill(180, 130, 75);
  p.stroke(130, 90, 50);
  p.strokeWeight(1);
  p.rect(cx - w / 2, cy, w, th, 2);
  // 脚
  p.rect(cx - w / 2 + 5, cy + th, lw, lh);
  p.rect(cx + w / 2 - 5 - lw, cy + th, lw, lh);
  // ラベル
  p.fill(80, 55, 25);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("机", cx, cy + th / 2);
}

/**
 * 地球のアイコンを描画する。
 * @param {*} p p5 インスタンス
 * @param {number} cx 中心 X
 * @param {number} cy 中心 Y
 * @param {number} r 半径
 */
function drawEarthIcon(p, cx, cy, r = 24) {
  p.fill(40, 130, 220);
  p.stroke(20, 90, 160);
  p.strokeWeight(1.5);
  p.ellipse(cx, cy, r * 2, r * 2);
  p.fill(60, 180, 80);
  p.noStroke();
  // 簡易大陸
  p.ellipse(cx - 5, cy - 4, 14, 10);
  p.ellipse(cx + 6, cy + 5, 10, 8);
  // ラベル
  p.fill(255);
  p.textSize(10);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("地", cx, cy);
}

/**
 * 作用・反作用ペアの図（重力ペア）を描画する。
 * @param {*} p p5 インスタンス
 * @param {number} cx 中心 X
 * @param {number} topY 上端 Y
 * @param {number} W 重力（N）
 */
function drawGravityPair(p, cx, topY, W) {
  const bookY = topY + 28;
  const earthY = topY + 190;
  const gapCenter = (bookY + 24 / 2 + earthY - 24) / 2;
  const arrowSpace = 55; // 矢印の長さ（固定）

  // ヘッダー
  p.fill(60);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.CENTER, p.TOP);
  p.text("重力の 作用・反作用", cx, topY);

  // 本アイコン
  drawBookIcon(p, cx, bookY, 50, 24);

  // 地球アイコン
  drawEarthIcon(p, cx, earthY, 22);

  // 重力矢印（地球→本, 赤, 下向き = 本に向かって下から） 
  // 矢印は本の下から地球に向かう方向 = 下向き
  // 作用: 地球が本に及ぼす重力 → 本の下端から下向き
  const axLeft = cx - 35;
  drawArrow(p, axLeft, bookY + 12, axLeft, bookY + 12 + arrowSpace, GRAVITY_COLOR, 3, 10);

  // 重力ラベル
  p.fill(GRAVITY_COLOR[0], GRAVITY_COLOR[1], GRAVITY_COLOR[2]);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text("地球→本", axLeft - 6, bookY + 12 + arrowSpace * 0.35);
  p.text(`(重力 ${W.toFixed(1)} N)`, axLeft - 6, bookY + 12 + arrowSpace * 0.35 + 14);

  // 反作用矢印（本→地球, オレンジ, 上向き = 地球に向かって上から）
  const axRight = cx + 35;
  drawArrow(p, axRight, earthY - 22, axRight, earthY - 22 - arrowSpace, REACTION_EARTH_COLOR, 3, 10);

  // 反作用ラベル
  p.fill(REACTION_EARTH_COLOR[0], REACTION_EARTH_COLOR[1], REACTION_EARTH_COLOR[2]);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("本→地球", axRight + 6, earthY - 22 - arrowSpace * 0.65);
  p.text(`(${W.toFixed(1)} N)`, axRight + 6, earthY - 22 - arrowSpace * 0.65 + 14);

  // 「作用・反作用」ラベル
  p.fill(80, 80, 80);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("↕ 大きさ等しく逆向き", cx, gapCenter + 10);
}

/**
 * 作用・反作用ペアの図（垂直抗力ペア）を描画する。
 * @param {*} p p5 インスタンス
 * @param {number} cx 中心 X
 * @param {number} topY 上端 Y
 * @param {number} N 垂直抗力（N）
 */
function drawNormalForcePair(p, cx, topY, N) {
  const bookY = topY + 28;
  const deskIconTopY = topY + 145;
  const gapCenter = (bookY + 24 / 2 + deskIconTopY) / 2;
  const arrowSpace = 50;

  // ヘッダー
  p.fill(60);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.CENTER, p.TOP);
  p.text("垂直抗力の 作用・反作用", cx, topY);

  // 本アイコン
  drawBookIcon(p, cx, bookY, 50, 24);

  // 机アイコン
  drawDeskIcon(p, cx, deskIconTopY, 70);

  // 垂直抗力矢印（机→本, 青, 上向き）
  // 本の下端から上向き
  const axLeft = cx - 35;
  drawArrow(p, axLeft, deskIconTopY, axLeft, deskIconTopY - arrowSpace, NORMAL_COLOR, 3, 10);

  // 垂直抗力ラベル
  p.fill(NORMAL_COLOR[0], NORMAL_COLOR[1], NORMAL_COLOR[2]);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text("机→本", axLeft - 6, deskIconTopY - arrowSpace * 0.6);
  p.text(`(垂直抗力 ${N.toFixed(1)} N)`, axLeft - 6, deskIconTopY - arrowSpace * 0.6 + 14);

  // 反作用矢印（本→机, 紫, 下向き）
  const axRight = cx + 35;
  drawArrow(p, axRight, bookY + 12, axRight, bookY + 12 + arrowSpace, REACTION_DESK_COLOR, 3, 10);

  // 反作用ラベル
  p.fill(REACTION_DESK_COLOR[0], REACTION_DESK_COLOR[1], REACTION_DESK_COLOR[2]);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("本→机", axRight + 6, bookY + 12 + arrowSpace * 0.4);
  p.text(`(${N.toFixed(1)} N)`, axRight + 6, bookY + 12 + arrowSpace * 0.4 + 14);

  // 「作用・反作用」ラベル
  p.fill(80, 80, 80);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("↕ 大きさ等しく逆向き", cx, gapCenter + 15);
}

/**
 * 右パネル全体を描画する。
 * @param {*} p p5 インスタンス
 */
function drawForcePanel(p) {
  // 背景
  p.fill(255, 252, 238);
  p.noStroke();
  p.rect(PANEL_DIVIDER_X, 0, V_W - PANEL_DIVIDER_X, V_H);

  const panelW = V_W - PANEL_DIVIDER_X; // 440
  const cx = PANEL_DIVIDER_X + panelW / 2; // 780

  // タイトル
  p.fill(40);
  p.noStroke();
  p.textSize(17);
  p.textAlign(p.CENTER, p.TOP);
  p.text("作用・反作用の法則", cx, 12);

  // 分割線
  p.stroke(200, 195, 170);
  p.strokeWeight(1);
  p.line(PANEL_DIVIDER_X + 20, 36, V_W - 20, 36);

  const { W, N } = calcForces();

  if (state.numBooks === 0) {
    // 本がない場合
    p.fill(120, 120, 130);
    p.noStroke();
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      "本を追加すると\n力の関係が表示されます",
      cx,
      V_H / 2
    );
    return;
  }

  // 力の値サマリー
  p.fill(70);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  p.text(
    `本 ${state.numBooks} 冊 × ${state.bookMass.toFixed(1)} kg × ${G} m/s² = ${W.toFixed(1)} N`,
    cx,
    42
  );

  // 2列レイアウトでペアを表示
  const col1X = PANEL_DIVIDER_X + panelW * 0.27; // 左列中心
  const col2X = PANEL_DIVIDER_X + panelW * 0.73; // 右列中心
  const pairTopY = 72;

  // 縦中央分割線
  p.stroke(210, 205, 185);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([6, 6]);
  p.line(cx, 60, cx, V_H - 30);
  p.drawingContext.setLineDash([]);

  // ペア1（重力）
  drawGravityPair(p, col1X, pairTopY, W);

  // ペア2（垂直抗力）
  drawNormalForcePair(p, col2X, pairTopY, N);

  // 下部まとめ
  p.stroke(200, 195, 170);
  p.strokeWeight(1);
  p.line(PANEL_DIVIDER_X + 20, V_H - 38, V_W - 20, V_H - 38);
  p.fill(60);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(
    "作用と反作用は大きさが等しく、向きが逆で、異なる物体に働く",
    cx,
    V_H - 6
  );
}

// ────────────────────────────────────────────
// 区切り線
// ────────────────────────────────────────────

/**
 * 左右パネルの区切り線を描画する。
 * @param {*} p p5 インスタンス
 */
function drawDivider(p) {
  p.stroke(160);
  p.strokeWeight(1.5);
  p.drawingContext.setLineDash([8, 8]);
  p.line(PANEL_DIVIDER_X, 0, PANEL_DIVIDER_X, V_H);
  p.drawingContext.setLineDash([]);
}

// ────────────────────────────────────────────
// エントリーポイント
// ────────────────────────────────────────────

/**
 * シミュレーション全体を描画する。
 * @param {*} p p5 インスタンス
 */
export function drawSimulation(p) {
  p.background(220);
  p.scale(p.width / V_W);

  if (state.font) p.textFont(state.font);

  drawPhysicsPanel(p);
  drawForcePanel(p);
  drawDivider(p);
}
