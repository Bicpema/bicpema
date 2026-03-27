import { state } from "./state.js";
import { V_W, V_H, FORCE_SCALE, ORIGIN_X, ORIGIN_Y } from "./constants.js";

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
  p.fill(0, 0, 0, 175);
  p.rect(tx - tw / 2 - pad, ty - th / 2 - pad / 2, tw + pad * 2, th + pad, 3);

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
  const gridStep = 50;
  p.strokeWeight(0.5);
  p.stroke(255, 255, 255, 30);
  for (let x = 0; x <= V_W; x += gridStep) {
    p.line(x, 0, x, V_H);
  }
  for (let y = 0; y <= V_H; y += gridStep) {
    p.line(0, y, V_W, y);
  }
  // 中心軸は少し明るく
  p.stroke(255, 255, 255, 60);
  p.strokeWeight(1);
  p.line(ORIGIN_X, 0, ORIGIN_X, V_H);
  p.line(0, ORIGIN_Y, V_W, ORIGIN_Y);
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
  const frMag = p.sqrt(frx * frx + fry * fry);
  const frAngle = p.degrees(p.atan2(-fry, frx));

  const panelX = V_W - 230;
  const panelY = V_H - 170;
  const panelW = 220;
  const panelH = 155;

  p.fill(0, 0, 0, 180);
  p.noStroke();
  p.rect(panelX, panelY, panelW, panelH, 8);

  p.textAlign(p.LEFT, p.TOP);
  p.noStroke();

  const lineH = 28;
  let ty = panelY + 12;
  const tx = panelX + 12;

  p.textSize(13);

  // F₁
  p.fill(255, 80, 80);
  const f1Angle = p.degrees(p.atan2(-f1y, f1x));
  p.text(
    `F1: ${state.f1Mag.toFixed(0)} N  ${f1Angle.toFixed(1)}\u00B0`,
    tx,
    ty
  );
  ty += lineH;

  // F₂
  p.fill(80, 150, 255);
  const f2Angle = p.degrees(p.atan2(-f2y, f2x));
  p.text(
    `F2: ${state.f2Mag.toFixed(0)} N  ${f2Angle.toFixed(1)}\u00B0`,
    tx,
    ty
  );
  ty += lineH;

  // 区切り線
  p.stroke(255, 255, 255, 60);
  p.strokeWeight(1);
  p.line(tx, ty - 4, panelX + panelW - 12, ty - 4);
  p.noStroke();
  ty += 4;

  // 合力
  p.fill(80, 220, 120);
  p.textSize(14);
  p.text(`合力: ${frMag.toFixed(1)} N`, tx, ty);
  ty += lineH;
  p.textSize(13);
  p.text(`向き: ${frAngle.toFixed(1)}\u00B0`, tx, ty);

  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * シーン全体を描画する。
 * @param {p5} p p5インスタンス
 */
export function drawScene(p) {
  p.background(20, 25, 40);
  drawGrid(p);

  // 角度をラジアンに変換（p5はy軸が下向きなので符号反転）
  const f1Rad = p.radians(-state.f1Angle);
  const f2Rad = p.radians(-state.f2Angle);

  const f1x = p.cos(f1Rad) * state.f1Mag * FORCE_SCALE;
  const f1y = p.sin(f1Rad) * state.f1Mag * FORCE_SCALE;
  const f2x = p.cos(f2Rad) * state.f2Mag * FORCE_SCALE;
  const f2y = p.sin(f2Rad) * state.f2Mag * FORCE_SCALE;
  const frx = f1x + f2x;
  const fry = f1y + f2y;

  // 平行四辺形の補助線（破線）
  const f1Col = p.color(255, 80, 80, 120);
  const f2Col = p.color(80, 150, 255, 120);
  drawDashedLine(
    p,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    f1Col
  );
  drawDashedLine(
    p,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    f2Col
  );

  // 合力
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    p.color(80, 220, 120),
    "合力 F"
  );

  // F₁
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    p.color(255, 80, 80),
    "F1"
  );

  // F₂
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    p.color(80, 150, 255),
    "F2"
  );

  // 原点の丸
  p.fill(255);
  p.noStroke();
  p.circle(ORIGIN_X, ORIGIN_Y, 10);

  // 情報パネル
  drawInfoPanel(p, f1x, f1y, f2x, f2y);
}
