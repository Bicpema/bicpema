// logic.js はシミュレーションの描画ロジックと物理計算を管理するファイルです。

import {
  state,
  V_W,
  V_H,
  PANEL_DIVIDER_X,
  CEILING_Y,
  ANCHOR_RADIUS,
  RING_RADIUS,
  WEIGHT_SIZE,
  WEIGHT_HANG_LENGTH,
  ARROW_SCALE,
  T1_COLOR,
  T2_COLOR,
  W_COLOR,
  RING_COLOR,
} from "./state.js";

// ────────────────────────────────────────────
// 物理計算
// ────────────────────────────────────────────

/**
 * 3力の釣り合い条件から糸1・糸2の張力を計算する。
 *
 * リング位置を固定し、アンカーA・Bへの方向ベクトルと重力から
 * T1・T2 を連立方程式で解く。
 *
 * 釣り合い条件: T1*u1 + T2*u2 + W*(0,1) = 0  （スクリーン座標: y下向き）
 *
 * | u1x  u2x | |T1|   | 0  |
 * | u1y  u2y | |T2| = |-W  |
 */
export function calcEquilibrium() {
  const { ring, anchorA, anchorB, weight: W } = state;

  const d1 = Math.hypot(anchorA.x - ring.x, anchorA.y - ring.y);
  const d2 = Math.hypot(anchorB.x - ring.x, anchorB.y - ring.y);

  if (d1 < 5 || d2 < 5) {
    state.isEquilibrium = false;
    return;
  }

  const u1x = (anchorA.x - ring.x) / d1;
  const u1y = (anchorA.y - ring.y) / d1;
  const u2x = (anchorB.x - ring.x) / d2;
  const u2y = (anchorB.y - ring.y) / d2;

  // クラーメルの公式
  const det = u1x * u2y - u2x * u1y;
  if (Math.abs(det) < 0.01) {
    state.isEquilibrium = false;
    return;
  }

  const T1 = (W * u2x) / det;
  const T2 = -(W * u1x) / det;

  if (T1 <= 0 || T2 <= 0) {
    state.isEquilibrium = false;
    return;
  }

  state.T1 = T1;
  state.T2 = T2;
  state.isEquilibrium = true;
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

  // 軸（矢頭の手前まで）
  p.stroke(col[0], col[1], col[2]);
  p.strokeWeight(sw);
  p.line(x1, y1, x2 - ux * hs, y2 - uy * hs);

  // 矢頭
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
// 左パネル描画
// ────────────────────────────────────────────

/**
 * 天井（斜めハッチングつき）を描画する。
 */
function drawCeiling(p) {
  p.fill(85, 85, 95);
  p.noStroke();
  p.rect(0, 0, PANEL_DIVIDER_X, CEILING_Y);

  // ハッチング（斜め線）
  p.stroke(70, 70, 80);
  p.strokeWeight(1.5);
  for (let x = -CEILING_Y * 2; x < PANEL_DIVIDER_X + CEILING_Y; x += 18) {
    p.line(x, 0, x + CEILING_Y, CEILING_Y);
  }

  // 下端ライン
  p.stroke(50, 50, 60);
  p.strokeWeight(3);
  p.line(0, CEILING_Y, PANEL_DIVIDER_X, CEILING_Y);
}

/**
 * アンカーポイント（天井固定点）を描画する。
 * @param {*} p p5 インスタンス
 * @param {number} x 座標 X
 * @param {number} y 座標 Y
 * @param {number[]} col [R, G, B]
 * @param {string} label ラベル文字（"A" or "B"）
 */
function drawAnchor(p, x, y, col, label) {
  // 天井からのロッド
  p.stroke(col[0], col[1], col[2]);
  p.strokeWeight(3);
  p.line(x, CEILING_Y, x, y - ANCHOR_RADIUS + 2);

  // アンカー円
  p.fill(col[0], col[1], col[2]);
  p.stroke(255, 255, 255, 180);
  p.strokeWeight(2);
  p.ellipse(x, y, ANCHOR_RADIUS * 2, ANCHOR_RADIUS * 2);

  // ラベル
  p.fill(255);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(label, x, y);
}

/**
 * 重りを描画する（四角形＋W表示＋N値ラベル）。
 */
function drawWeight(p) {
  const { ring, weight: W } = state;
  const wCX = ring.x;
  const wTop = ring.y + WEIGHT_HANG_LENGTH;
  const wLeft = wCX - WEIGHT_SIZE / 2;

  p.fill(100, 100, 110);
  p.stroke(65, 65, 75);
  p.strokeWeight(2);
  p.rect(wLeft, wTop, WEIGHT_SIZE, WEIGHT_SIZE, 5);

  // "W" 文字
  p.fill(255);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  p.text("W", wCX, wTop + WEIGHT_SIZE / 2);

  // 重さラベル
  p.fill(W_COLOR[0], W_COLOR[1], W_COLOR[2]);
  p.textSize(14);
  p.textAlign(p.CENTER, p.TOP);
  p.text(`${W} N`, wCX, wTop + WEIGHT_SIZE + 6);
}

/**
 * リング（中心結合点）を描画する。
 */
function drawRing(p) {
  const { ring } = state;
  p.fill(RING_COLOR[0], RING_COLOR[1], RING_COLOR[2]);
  p.stroke(170, 110, 15);
  p.strokeWeight(2.5);
  p.ellipse(ring.x, ring.y, RING_RADIUS * 2, RING_RADIUS * 2);
}

/**
 * 力の矢印と数値ラベルを描画する（釣り合い成立時のみ）。
 */
function drawForceArrows(p) {
  const { ring, anchorA, anchorB, T1, T2, weight: W } = state;

  const d1 = Math.hypot(anchorA.x - ring.x, anchorA.y - ring.y);
  const d2 = Math.hypot(anchorB.x - ring.x, anchorB.y - ring.y);
  const u1x = (anchorA.x - ring.x) / d1;
  const u1y = (anchorA.y - ring.y) / d1;
  const u2x = (anchorB.x - ring.x) / d2;
  const u2y = (anchorB.y - ring.y) / d2;

  // 矢印の長さを 150px 以内に制限するスケール
  const maxF = Math.max(T1, T2, W);
  const fScale = Math.min(ARROW_SCALE, 150 / maxF);

  const t1EndX = ring.x + u1x * T1 * fScale;
  const t1EndY = ring.y + u1y * T1 * fScale;
  const t2EndX = ring.x + u2x * T2 * fScale;
  const t2EndY = ring.y + u2y * T2 * fScale;
  const wEndX = ring.x;
  const wEndY = ring.y + W * fScale;

  drawArrow(p, ring.x, ring.y, t1EndX, t1EndY, T1_COLOR, 3, 11);
  drawArrow(p, ring.x, ring.y, t2EndX, t2EndY, T2_COLOR, 3, 11);
  drawArrow(p, ring.x, ring.y, wEndX, wEndY, W_COLOR, 3, 11);

  // T1 ラベル（矢印の中点から法線方向にオフセット）
  const t1MX = (ring.x + t1EndX) / 2;
  const t1MY = (ring.y + t1EndY) / 2;
  p.fill(T1_COLOR[0], T1_COLOR[1], T1_COLOR[2]);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  // 法線（左手系）方向へオフセット
  const offX1 = -u1y * 22;
  const offY1 = u1x * 22;
  p.text(`T\u2081 = ${T1.toFixed(1)} N`, t1MX + offX1, t1MY + offY1);

  // T2 ラベル
  const t2MX = (ring.x + t2EndX) / 2;
  const t2MY = (ring.y + t2EndY) / 2;
  p.fill(T2_COLOR[0], T2_COLOR[1], T2_COLOR[2]);
  const offX2 = u2y * 22;
  const offY2 = -u2x * 22;
  p.text(`T\u2082 = ${T2.toFixed(1)} N`, t2MX + offX2, t2MY + offY2);
}

/**
 * 角度情報ラベルを左パネル下部に表示する。
 */
function drawAngleLabels(p) {
  const { ring, anchorA, anchorB } = state;

  // 各糸の鉛直からの傾き角（°）
  const theta1 =
    (Math.atan2(Math.abs(anchorA.x - ring.x), ring.y - anchorA.y) * 180) /
    Math.PI;
  const theta2 =
    (Math.atan2(Math.abs(anchorB.x - ring.x), ring.y - anchorB.y) * 180) /
    Math.PI;

  p.fill(60);
  p.noStroke();
  p.textSize(13);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(
    `\u03B8\u2081 = ${theta1.toFixed(1)}\u00B0`,
    16,
    V_H - 38
  );
  p.text(
    `\u03B8\u2082 = ${theta2.toFixed(1)}\u00B0`,
    16,
    V_H - 20
  );
}

/**
 * 左パネル全体を描画する。
 */
function drawPhysicsPanel(p) {
  const { ring, anchorA, anchorB, isEquilibrium } = state;

  // 背景
  p.fill(240, 244, 252);
  p.noStroke();
  p.rect(0, CEILING_Y, PANEL_DIVIDER_X, V_H - CEILING_Y);

  drawCeiling(p);

  // 糸1（青）
  p.stroke(T1_COLOR[0], T1_COLOR[1], T1_COLOR[2]);
  p.strokeWeight(2.5);
  p.line(anchorA.x, anchorA.y, ring.x, ring.y);

  // 糸2（赤）
  p.stroke(T2_COLOR[0], T2_COLOR[1], T2_COLOR[2]);
  p.strokeWeight(2.5);
  p.line(anchorB.x, anchorB.y, ring.x, ring.y);

  // 糸3（緑、重りへ）
  p.stroke(W_COLOR[0], W_COLOR[1], W_COLOR[2]);
  p.strokeWeight(2.5);
  p.line(ring.x, ring.y, ring.x, ring.y + WEIGHT_HANG_LENGTH);

  drawWeight(p);

  if (isEquilibrium) {
    drawForceArrows(p);
  }

  // アンカーポイント（糸と矢印の上に重ねる）
  drawAnchor(p, anchorA.x, anchorA.y, T1_COLOR, "A");
  drawAnchor(p, anchorB.x, anchorB.y, T2_COLOR, "B");

  // リング（最前面）
  drawRing(p);

  if (isEquilibrium) {
    drawAngleLabels(p);
  } else {
    // 釣り合い不成立の警告
    p.fill(200, 0, 0, 210);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    p.text(
      "\u26A0 この配置では釣り合いが成立しません",
      PANEL_DIVIDER_X / 2,
      V_H / 2 + 60
    );
  }

  // ドラッグヒント
  p.fill(130);
  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(
    "● をドラッグして動かせます",
    PANEL_DIVIDER_X / 2,
    V_H - 3
  );
}

// ────────────────────────────────────────────
// 右パネル描画（力のベクトル図）
// ────────────────────────────────────────────

/**
 * 右パネルに力のベクトル図（閉じた三角形）を描画する。
 */
function drawForceTrianglePanel(p) {
  const { ring, anchorA, anchorB, T1, T2, weight: W, isEquilibrium } = state;

  // 背景
  p.fill(255, 253, 242);
  p.noStroke();
  p.rect(PANEL_DIVIDER_X, 0, V_W - PANEL_DIVIDER_X, V_H);

  // パネルタイトル
  p.fill(50);
  p.noStroke();
  p.textSize(18);
  p.textAlign(p.CENTER, p.TOP);
  p.text(
    "\u529B\u306E\u30D9\u30AF\u30C8\u30EB\u56F3", // 力のベクトル図
    (PANEL_DIVIDER_X + V_W) / 2,
    14
  );

  // 凡例
  const lgX = PANEL_DIVIDER_X + 16;
  const lgY = 50;
  p.textSize(13);
  p.textAlign(p.LEFT, p.CENTER);

  drawArrow(p, lgX, lgY, lgX + 32, lgY, T1_COLOR, 2, 8);
  p.fill(T1_COLOR[0], T1_COLOR[1], T1_COLOR[2]);
  p.noStroke();
  p.text("T\u2081\uFF08\u7CF8\u0031\u306E\u5F35\u529B\uFF09", lgX + 42, lgY);

  drawArrow(p, lgX, lgY + 22, lgX + 32, lgY + 22, T2_COLOR, 2, 8);
  p.fill(T2_COLOR[0], T2_COLOR[1], T2_COLOR[2]);
  p.noStroke();
  p.text("T\u2082\uFF08\u7CF8\u0032\u306E\u5F35\u529B\uFF09", lgX + 42, lgY + 22);

  drawArrow(p, lgX, lgY + 44, lgX + 32, lgY + 44, W_COLOR, 2, 8);
  p.fill(W_COLOR[0], W_COLOR[1], W_COLOR[2]);
  p.noStroke();
  p.text("W\uFF08\u91CD\u529B\uFF09", lgX + 42, lgY + 44); // W（重力）

  if (!isEquilibrium) {
    p.fill(200, 0, 0);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(
      "\u91E3\u308A\u5408\u3044\u306E\u72B6\u614B\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
      (PANEL_DIVIDER_X + V_W) / 2,
      V_H / 2
    );
    return;
  }

  // ────────────────────────────────────────
  // 力の三角形を描画
  // ────────────────────────────────────────

  const d1 = Math.hypot(anchorA.x - ring.x, anchorA.y - ring.y);
  const d2 = Math.hypot(anchorB.x - ring.x, anchorB.y - ring.y);
  const u1x = (anchorA.x - ring.x) / d1;
  const u1y = (anchorA.y - ring.y) / d1;

  // 三角形スケール: 最長辺を 160px に収める
  const maxF = Math.max(T1, T2, W);
  const scale = Math.min(4.5, 160 / maxF);

  // P0 を仮に (0,0) として三角形の頂点を計算
  //   P0 → P1: W 下向き
  //   P1 → P2: T1 方向
  //   P2 → P0: T2 方向（自動的に閉じる）
  const P1raw = { x: 0, y: W * scale };
  const P2raw = {
    x: T1 * u1x * scale,
    y: W * scale + T1 * u1y * scale,
  };

  // 重心を右パネル中央に配置
  const panelCx = (PANEL_DIVIDER_X + V_W) / 2;
  const panelCy = V_H / 2 + 20;
  const cx = (0 + P1raw.x + P2raw.x) / 3;
  const cy = (0 + P1raw.y + P2raw.y) / 3;
  const ox = panelCx - cx;
  const oy = panelCy - cy;

  const P0 = { x: ox, y: oy };
  const P1 = { x: P1raw.x + ox, y: P1raw.y + oy };
  const P2 = { x: P2raw.x + ox, y: P2raw.y + oy };

  // 三角形の塗り（半透明）
  p.fill(210, 235, 210, 90);
  p.stroke(160);
  p.strokeWeight(1);
  p.triangle(P0.x, P0.y, P1.x, P1.y, P2.x, P2.y);

  // 各辺を色付き矢印で描画
  //   W:  P0 → P1（緑、下向き）
  //   T1: P1 → P2（青）
  //   T2: P2 → P0（赤）
  drawArrow(p, P0.x, P0.y, P1.x, P1.y, W_COLOR, 3.5, 12);
  drawArrow(p, P1.x, P1.y, P2.x, P2.y, T1_COLOR, 3.5, 12);
  drawArrow(p, P2.x, P2.y, P0.x, P0.y, T2_COLOR, 3.5, 12);

  // ────────────── ラベル ──────────────

  // W ラベル（P0→P1 の左側）
  p.fill(W_COLOR[0], W_COLOR[1], W_COLOR[2]);
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(
    `W = ${W} N`,
    (P0.x + P1.x) / 2 - 12,
    (P0.y + P1.y) / 2
  );

  // T1 ラベル（P1→P2 の法線方向）
  const t1dx = P2.x - P1.x;
  const t1dy = P2.y - P1.y;
  const t1len = Math.hypot(t1dx, t1dy);
  const t1nx = -t1dy / t1len; // 左手法線
  const t1ny = t1dx / t1len;
  p.fill(T1_COLOR[0], T1_COLOR[1], T1_COLOR[2]);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    `T\u2081 = ${T1.toFixed(1)} N`,
    (P1.x + P2.x) / 2 + t1nx * 22,
    (P1.y + P2.y) / 2 + t1ny * 22
  );

  // T2 ラベル（P2→P0 の法線方向）
  const t2dx = P0.x - P2.x;
  const t2dy = P0.y - P2.y;
  const t2len = Math.hypot(t2dx, t2dy);
  const t2nx = t2dy / t2len; // 右手法線
  const t2ny = -t2dx / t2len;
  p.fill(T2_COLOR[0], T2_COLOR[1], T2_COLOR[2]);
  p.text(
    `T\u2082 = ${T2.toFixed(1)} N`,
    (P2.x + P0.x) / 2 + t2nx * 22,
    (P2.y + P0.y) / 2 + t2ny * 22
  );

  // ΣF = 0 ラベル
  p.fill(60);
  p.textSize(15);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(
    "\u03A3F = 0 \uFF08\u529B\u306E\u91E3\u308A\u5408\u3044\uFF09", // ΣF = 0（力の釣り合い）
    (PANEL_DIVIDER_X + V_W) / 2,
    V_H - 8
  );
}

// ────────────────────────────────────────────
// 区切り線
// ────────────────────────────────────────────

/**
 * 左右パネルの区切り線を描画する。
 */
function drawDivider(p) {
  p.stroke(180);
  p.strokeWeight(1.5);
  p.drawingContext.setLineDash([8, 8]);
  p.line(PANEL_DIVIDER_X, 0, PANEL_DIVIDER_X, V_H);
  p.drawingContext.setLineDash([]);
}

// ────────────────────────────────────────────
// カーソル
// ────────────────────────────────────────────

/**
 * マウスが操作可能な要素の上にあるときカーソルを変える。
 * @param {*} p p5 インスタンス
 * @param {number} vmx 仮想 X
 * @param {number} vmy 仮想 Y
 */
function updateCursor(p, vmx, vmy) {
  const { anchorA, anchorB, ring } = state;
  const isOverAnchorA =
    Math.hypot(vmx - anchorA.x, vmy - anchorA.y) <= ANCHOR_RADIUS + 6;
  const isOverAnchorB =
    Math.hypot(vmx - anchorB.x, vmy - anchorB.y) <= ANCHOR_RADIUS + 6;
  const isOverRing =
    Math.hypot(vmx - ring.x, vmy - ring.y) <= RING_RADIUS + 6;

  if (state.dragging || isOverAnchorA || isOverAnchorB || isOverRing) {
    p.cursor("grab");
  } else {
    p.cursor("default");
  }
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

  calcEquilibrium();
  drawPhysicsPanel(p);
  drawForceTrianglePanel(p);
  drawDivider(p);

  const vmx = (p.mouseX / p.width) * V_W;
  const vmy = (p.mouseY / p.width) * V_W;
  updateCursor(p, vmx, vmy);
}
