import { state } from "./state.js";
import {
  V_W,
  V_H,
  FORCE_SCALE,
  ORIGIN_X,
  ORIGIN_Y,
  GRID_STEP,
} from "./constants.js";

/**
 * 矢印を描画する。
 * @param {p5} p p5インスタンス
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印の色
 * @param {number} weight 線の太さ
 * @param {number} headSize 矢印の頭の大きさ
 */
export function drawArrow(
  p,
  fromX,
  fromY,
  toX,
  toY,
  col,
  weight = 3,
  headSize = 12
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  p.stroke(col);
  p.strokeWeight(weight);
  p.fill(col);
  p.line(fromX, fromY, toX, toY);

  const angle = p.atan2(dy, dx);
  p.push();
  p.translate(toX, toY);
  p.rotate(angle);
  p.noStroke();
  p.triangle(0, 0, -headSize, headSize / 2.5, -headSize, -headSize / 2.5);
  p.pop();
}

/**
 * 矢印とラベルをまとめて描画する。
 * @param {p5} p p5インスタンス
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印とラベルの色
 * @param {string} label 表示するテキスト
 */
export function drawArrowWithLabel(p, fromX, fromY, toX, toY, col, label) {
  drawArrow(p, fromX, fromY, toX, toY, col);

  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  // ラベル位置：矢印の中点から法線方向に少しオフセット
  const mx = (fromX + toX) / 2;
  const my = (fromY + toY) / 2;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = 18;
  const tx = mx + nx * offset;
  const ty = my + ny * offset;

  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);

  // テキスト背景
  const tw = p.textWidth(label);
  const th = 18;
  const pad = 4;

  p.fill(col);
  p.text(label, tx, ty);
}

/**
 * 破線を描画する。
 * @param {p5} p p5インスタンス
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {p5.Color} col 色
 */
export function drawDashedLine(p, x1, y1, x2, y2, col) {
  const dashLen = 10;
  const gapLen = 6;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const total = p.sqrt(dx * dx + dy * dy);
  const ux = dx / total;
  const uy = dy / total;

  p.stroke(col);
  p.strokeWeight(1.5);

  let dist = 0;
  let drawing = true;
  while (dist < total) {
    const segLen = drawing ? dashLen : gapLen;
    const end = p.min(dist + segLen, total);
    if (drawing) {
      p.line(x1 + ux * dist, y1 + uy * dist, x1 + ux * end, y1 + uy * end);
    }
    dist = end;
    drawing = !drawing;
  }
}

/**
 * グリッドを描画する。
 * @param {p5} p p5インスタンス
 */
export function drawGrid(p) {
  p.strokeWeight(1);
  p.stroke(168, 206, 221);

  // 中心(ORIGIN)を起点に外側へグリッド線を引く
  for (let x = ORIGIN_X; x <= V_W; x += GRID_STEP) p.line(x, 0, x, V_H);
  for (let x = ORIGIN_X - GRID_STEP; x >= 0; x -= GRID_STEP)
    p.line(x, 0, x, V_H);
  for (let y = ORIGIN_Y; y <= V_H; y += GRID_STEP) p.line(0, y, V_W, y);
  for (let y = ORIGIN_Y - GRID_STEP; y >= 0; y -= GRID_STEP)
    p.line(0, y, V_W, y);

  // X/Y 軸（黒色矢印、両方向）
  const axisColor = p.color(0);
  const axisWeight = 2;
  const axisHeadSize = 10;
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    V_W - 10,
    ORIGIN_Y,
    axisColor,
    axisWeight,
    axisHeadSize
  );
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    10,
    ORIGIN_Y,
    axisColor,
    axisWeight,
    axisHeadSize
  );
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X,
    10,
    axisColor,
    axisWeight,
    axisHeadSize
  );
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X,
    V_H - 10,
    axisColor,
    axisWeight,
    axisHeadSize
  );

  // 軸ラベル
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("x", V_W - 8, ORIGIN_Y + 20);
  p.text("y", ORIGIN_X - 20, 10);

  // 原点ラベル「O」
  p.textSize(16);
  p.text("O", ORIGIN_X - 14, ORIGIN_Y + 14);
}

/**
 * 情報パネルを描画する。
 * @param {p5} p p5インスタンス
 * @param {number} f1x F₁のX成分
 * @param {number} f1y F₁のY成分
 * @param {number} f2x F₂のX成分
 * @param {number} f2y F₂のY成分
 */
export function drawInfoPanel(p, f1x, f1y, f2x, f2y) {
  const frx = f1x + f2x;
  const fry = f1y + f2y;
  const f1Mag = p.sqrt(f1x * f1x + f1y * f1y) / FORCE_SCALE;
  const f2Mag = p.sqrt(f2x * f2x + f2y * f2y) / FORCE_SCALE;
  const frMag = p.sqrt(frx * frx + fry * fry) / FORCE_SCALE;
  const f1Angle = p.degrees(p.atan2(-f1y, f1x));
  const f2Angle = p.degrees(p.atan2(-f2y, f2x));
  const frAngle = p.degrees(p.atan2(-fry, frx));

  const panelW = 248;
  const panelH = 118;
  const panelX = V_W - panelW - 10;
  const panelY = V_H - panelH - 10;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1.5);
  p.rect(panelX, panelY, panelW, panelH, 8);
  p.noStroke();

  // 列位置
  const colLabel = panelX + 16; // ラベル（LEFT基準）
  const colMag = panelX + panelW - 86; // 大きさ（RIGHT基準）
  const colAngle = panelX + panelW - 14; // 角度（RIGHT基準）

  // 行の中心Y
  const cy1 = panelY + 20; // F1
  const cy2 = panelY + 48; // F2
  const divY = panelY + 66; // 区切り線
  const cy3 = panelY + 92; // 合力

  p.textSize(14);

  // F1
  p.fill(0);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("F1", colLabel, cy1);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${f1Mag.toFixed(1)} N`, colMag, cy1);
  p.text(`${f1Angle.toFixed(1)}°`, colAngle, cy1);

  // F2
  p.fill(0);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("F2", colLabel, cy2);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${f2Mag.toFixed(1)} N`, colMag, cy2);
  p.text(`${f2Angle.toFixed(1)}°`, colAngle, cy2);

  // 区切り線
  p.stroke(0, 60);
  p.strokeWeight(1);
  p.line(colLabel, divY, panelX + panelW - 16, divY);
  p.noStroke();

  // 合力
  p.fill(220, 50, 50);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("合力", colLabel, cy3);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${frMag.toFixed(1)} N`, colMag, cy3);
  p.text(`${frAngle.toFixed(1)}°`, colAngle, cy3);

  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * シーン全体を描画する。
 * @param {p5} p p5インスタンス
 */
export function drawScene(p) {
  p.background(255, 255, 255);
  drawGrid(p);

  const f1x = state.f1TipX;
  const f1y = state.f1TipY;
  const f2x = state.f2TipX;
  const f2y = state.f2TipY;
  const frx = f1x + f2x;
  const fry = f1y + f2y;

  // 平行四辺形の補助線（破線）
  const dashCol = p.color(100, 100, 100, 120);
  drawDashedLine(
    p,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    dashCol
  );
  drawDashedLine(
    p,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    dashCol
  );

  // 合力（赤）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    p.color(220, 50, 50),
    "合力 F"
  );

  // F₁（黒）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    p.color(0),
    "F1"
  );

  // F₂（黒）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    p.color(0),
    "F2"
  );

  // 情報パネル
  drawInfoPanel(p, f1x, f1y, f2x, f2y);
}
