import { state } from "./state.js";
import {
  V_W,
  V_H,
  FORCE_SCALE,
  GRID_STEP,
  ORIGIN_X,
  ORIGIN_Y,
} from "./constants.js";

// ── 共通ユーティリティ ──────────────────────────────────────────────

/**
 * 矢印を描画する。
 * @param {p5} p
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {p5.Color} col 色
 * @param {number} [sw=3] strokeWeight
 */
export function drawArrow(p, x1, y1, x2, y2, col, sw = 3) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  const headSize = 12;
  const angle = p.atan2(dy, dx);

  p.stroke(col);
  p.strokeWeight(sw);
  p.fill(col);
  p.line(x1, y1, x2, y2);
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.noStroke();
  p.triangle(0, 0, -headSize, headSize / 2.2, -headSize, -headSize / 2.2);
  p.pop();
}

/**
 * 点線を描画する。
 * @param {p5} p
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {p5.Color} col
 */
function drawDashed(p, x1, y1, x2, y2, col) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 1) return;
  const dashLen = 8;
  const gapLen = 6;
  const ux = dx / len;
  const uy = dy / len;
  let d = 0;
  let drawing = true;
  p.stroke(col);
  p.strokeWeight(1.5);
  while (d < len) {
    const segLen = p.min(drawing ? dashLen : gapLen, len - d);
    if (drawing) {
      p.line(
        x1 + ux * d,
        y1 + uy * d,
        x1 + ux * (d + segLen),
        y1 + uy * (d + segLen)
      );
    }
    d += segLen;
    drawing = !drawing;
  }
}

/**
 * ラベル付きテキストを半透明背景で描画する。
 * @param {p5} p
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {p5.Color} col テキスト色
 * @param {number} [sz=16] フォントサイズ
 */
function drawLabel(p, text, x, y, col, sz = 16) {
  p.textSize(sz);
  p.noStroke();
  p.fill(col);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, x, y);
}

// ── XY分解モード ────────────────────────────────────────────────────

/**
 * XY分解モードのシーンを描画する。
 * @param {p5} p
 */
export function drawXYScene(p) {
  p.background(255, 255, 255);
  drawGrid(p);
  drawAxes(p, ORIGIN_X, ORIGIN_Y);

  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * FORCE_SCALE;
  const Fx = F * Math.cos(θ);
  const Fy = -F * Math.sin(θ); // y軸反転（下が正）

  const tipX = ORIGIN_X + Fx;
  const tipY = ORIGIN_Y + Fy;

  // 補助破線（平行四辺形の辺）
  drawDashed(
    p,
    ORIGIN_X,
    ORIGIN_Y + Fy,
    tipX,
    tipY,
    p.color(100, 100, 100, 120)
  );
  drawDashed(
    p,
    ORIGIN_X + Fx,
    ORIGIN_Y,
    tipX,
    tipY,
    p.color(100, 100, 100, 120)
  );

  // 水平成分 Fx（赤）
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + Fx,
    ORIGIN_Y,
    p.color(220, 50, 50)
  );
  // 垂直成分 Fy（青）
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X,
    ORIGIN_Y + Fy,
    p.color(50, 100, 220)
  );
  // 力 F（黒）
  drawArrow(p, ORIGIN_X, ORIGIN_Y, tipX, tipY, p.color(0), 4);

  // 角度弧
  drawAngleArc(p, ORIGIN_X, ORIGIN_Y, θ, 50);

  // ラベル
  drawXYLabels(p, Fx, Fy, tipX, tipY, θ);
  drawXYInfoPanel(p, Fx, Fy);
  drawInteractionHint(p, tipX, tipY);
}

/**
 * グリッドを描画する。
 * @param {p5} p
 */
function drawGrid(p) {
  p.strokeWeight(1);
  p.stroke(168, 206, 221);
  for (let x = ORIGIN_X; x <= V_W; x += GRID_STEP) p.line(x, 0, x, V_H);
  for (let x = ORIGIN_X - GRID_STEP; x >= 0; x -= GRID_STEP)
    p.line(x, 0, x, V_H);
  for (let y = ORIGIN_Y; y <= V_H; y += GRID_STEP) p.line(0, y, V_W, y);
  for (let y = ORIGIN_Y - GRID_STEP; y >= 0; y -= GRID_STEP)
    p.line(0, y, V_W, y);
}

/**
 * X・Y軸を描画する。
 * @param {p5} p
 * @param {number} ox 原点X
 * @param {number} oy 原点Y
 */
function drawAxes(p, ox, oy) {
  const axisColor = p.color(0);
  const axisWeight = 2;
  const axisHeadSize = 10;
  drawArrow(p, ox, oy, V_W - 10, oy, axisColor, axisWeight);
  drawArrow(p, ox, oy, 10, oy, axisColor, axisWeight);
  drawArrow(p, ox, oy, ox, 10, axisColor, axisWeight);
  drawArrow(p, ox, oy, ox, V_H - 10, axisColor, axisWeight);

  // 軸ラベル
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("x", V_W - 8, oy + 20);
  p.text("y", ox - 20, 10);

  // 原点ラベル『O』
  p.textSize(16);
  p.text("O", ox - 14, oy + 14);
}

/**
 * 角度弧を描画する。
 * @param {p5} p
 * @param {number} ox
 * @param {number} oy
 * @param {number} θ ラジアン
 * @param {number} r 半径
 */
function drawAngleArc(p, ox, oy, θ, r) {
  if (Math.abs(θ) < 0.02) return;
  p.noFill();
  p.stroke(80, 80, 80, 200);
  p.strokeWeight(1.5);
  // p5の arc は時計回り正。物理角（反時計回り正）→ p5では -θ
  p.arc(ox, oy, r * 2, r * 2, -θ, 0);

  // θラベル
  const midAngle = -θ / 2;
  const lx = ox + (r + 14) * Math.cos(midAngle);
  const ly = oy + (r + 14) * Math.sin(midAngle);
  drawLabel(p, "θ", lx, ly, p.color(60, 60, 60), 14);
}

/**
 * 各ベクトルのラベルを描画する。
 * @param {p5} p
 * @param {number} Fx 水平成分（仮想px）
 * @param {number} Fy 垂直成分（仮想px, 下正）
 * @param {number} tipX 合力先端X
 * @param {number} tipY 合力先端Y
 * @param {number} θ ラジアン
 */
function drawXYLabels(p, Fx, Fy, tipX, tipY, θ) {
  // F ラベル（力の中点より少し外側）
  const midX = ORIGIN_X + Fx / 2 + 16 * Math.sin(θ);
  const midY = ORIGIN_Y + Fy / 2 - 16 * Math.cos(θ);
  drawLabel(p, "F", midX, midY, p.color(0), 18);

  // Fx ラベル
  if (Math.abs(Fx) > 8) {
    drawLabel(
      p,
      "Fx",
      ORIGIN_X + Fx / 2,
      ORIGIN_Y + (Fy >= 0 ? 18 : -18),
      p.color(220, 50, 50),
      15
    );
  }

  // Fy ラベル
  if (Math.abs(Fy) > 8) {
    drawLabel(
      p,
      "Fy",
      ORIGIN_X + (Fx >= 0 ? -22 : 22),
      ORIGIN_Y + Fy / 2,
      p.color(50, 100, 220),
      15
    );
  }
}

/**
 * 右下に数値パネルを描画する。
 * @param {p5} p
 * @param {number} Fx 仮想px
 * @param {number} Fy 仮想px（下正）
 */
function drawXYInfoPanel(p, Fx, Fy) {
  const fxN = Fx / FORCE_SCALE;
  const fyN = -Fy / FORCE_SCALE; // 物理のy（上正）
  const fN = state.forceMag;
  const θStr = `${state.forceAngle.toFixed(1)}°`;

  const panelW = 248;
  const panelH = 118;
  const panelX = V_W - panelW - 10;
  const panelY = V_H - panelH - 10;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1.5);
  p.rect(panelX, panelY, panelW, panelH, 8);

  const colLabel = panelX + 16;
  const colMag = panelX + panelW - 86;
  const colAngle = panelX + panelW - 14;
  const cy1 = panelY + 24; // F
  const divY = panelY + 44; // 区切り線（F と Fx の間）
  const cy2 = panelY + 68; // Fx
  const cy3 = panelY + 96; // Fy

  // 区切り線（F と Fx の間）— テキストより先に描いて文字が前面に
  p.stroke(0, 60);
  p.strokeWeight(1);
  p.line(colLabel, divY, panelX + panelW - 16, divY);
  p.noStroke();

  p.textSize(14);

  // F
  p.fill(0);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("F", colLabel, cy1);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fN.toFixed(1)} N`, colMag, cy1);
  p.text(θStr, colAngle, cy1);

  // Fx
  p.fill(220, 50, 50);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("Fx", colLabel, cy2);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fxN.toFixed(1)} N`, colMag, cy2);

  // Fy
  p.fill(50, 100, 220);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("Fy", colLabel, cy3);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fyN.toFixed(1)} N`, colMag, cy3);

  p.textAlign(p.CENTER, p.CENTER);
}

function drawInteractionHint(p, tipX, tipY) {
  // 先端の円
  p.noFill();
  p.stroke(0, 0, 0, state.isDragging ? 180 : 80);
  p.strokeWeight(2);
  p.circle(tipX, tipY, 20);
}

// ── ドラッグ操作 ────────────────────────────────────────────────────

/**
 * マウス/タッチ押下時の処理。
 * @param {p5} p
 */
export function handlePress(p) {
  const vx = (p.mouseX * V_W) / p.width;
  const vy = (p.mouseY * V_W) / p.width;
  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * FORCE_SCALE;
  const tipX = ORIGIN_X + F * Math.cos(θ);
  const tipY = ORIGIN_Y - F * Math.sin(θ);
  const dist = Math.hypot(vx - tipX, vy - tipY);
  if (dist < 28) {
    state.isDragging = true;
  }
}

/**
 * マウス/タッチドラッグ時の処理。
 * @param {p5} p
 * @param {number} MAX_FORCE 力の最大値（N）
 */
export function handleDrag(p, MAX_FORCE) {
  if (!state.isDragging) return;
  const vx = (p.mouseX * V_W) / p.width;
  const vy = (p.mouseY * V_W) / p.width;
  const dx = vx - ORIGIN_X;
  const dy = vy - ORIGIN_Y;
  // グリッドスナップ
  const sdx = Math.round(dx / GRID_STEP) * GRID_STEP;
  const sdy = Math.round(dy / GRID_STEP) * GRID_STEP;
  const len = Math.hypot(sdx, sdy);
  if (len < 1) return;
  // 物理角度（x右向き正、y上向き正）
  const angleRad = Math.atan2(-sdy, sdx);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  state.forceAngle = angleDeg;
  state.forceMag = len / FORCE_SCALE;

  // UIスライダー更新
  if (state.magnitudeInput) state.magnitudeInput.value(state.forceMag);
  if (state.magnitudeValue)
    state.magnitudeValue.html(`${state.forceMag.toFixed(1)} N`);
  if (state.angleInput) state.angleInput.value(state.forceAngle);
  if (state.angleValue)
    state.angleValue.html(`${state.forceAngle.toFixed(0)}°`);
}

/**
 * マウス/タッチ離し時の処理。
 */
export function handleRelease() {
  state.isDragging = false;
}
