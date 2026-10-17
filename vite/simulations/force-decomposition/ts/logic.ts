import { drawArrow } from "../../../ts/components/arrow.js";
import { drawAxes } from "../../../ts/components/axes.js";
import { CoordinateSystem } from "../../../ts/components/coordinate-system.js";
import { drawGrid } from "../../../ts/components/grid.js";
import { drawDashedLine } from "../../../ts/components/dashed-line.js";
import { state } from "./state.js";
import {
  V_W,
  V_H,
  FORCE_SCALE,
  GRID_STEP,
  ORIGIN_X,
  ORIGIN_Y,
  DRAG_RADIUS,
  LABEL_FONT_SIZE,
  AXIS_LABEL_FONT_SIZE
} from "./constants.js";
import { decomposeForce } from "./physics.js";

/** 軸の原点を表す座標系 */
const COORDINATE_SYSTEM = new CoordinateSystem({
  originX: ORIGIN_X,
  originY: ORIGIN_Y
});

// ── 共通ユーティリティ ──────────────────────────────────────────────

/**
 * ラベル付きテキストを半透明背景で描画する。
 * @param p -
 * @param text -
 * @param x -
 * @param y -
 * @param col - テキスト色
 * @param sz - フォントサイズ（省略時: 16）
 */
function drawLabel(
  p: p5,
  text: string,
  x: number,
  y: number,
  col: p5.Color,
  sz = LABEL_FONT_SIZE
) {
  p.textSize(sz);
  p.noStroke();
  p.fill(col);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, x, y);
}

// ── XY分解モード ────────────────────────────────────────────────────

/**
 * XY分解モードのシーンを描画する。
 * @param p -
 */
export function drawXYScene(p: p5) {
  p.background(255, 255, 255);
  // 原点を通るグリッド線
  drawGrid(p, COORDINATE_SYSTEM, {
    stepX: GRID_STEP,
    stepY: GRID_STEP,
    bounds: { left: 0, top: 0, right: V_W, bottom: V_H }
  });
  drawAxes(p, COORDINATE_SYSTEM, {
    xLabel: "x",
    yLabel: "y",
    originLabel: "O",
    bothDirections: true,
    extent: { left: 10, right: V_W - 10, top: 10, bottom: V_H - 10 },
    labelFontSize: AXIS_LABEL_FONT_SIZE,
    originLabelFontSize: LABEL_FONT_SIZE,
    headSize: 12,
    headWidthDivisor: 2.2
  });

  const F = state.forceMag * FORCE_SCALE;
  const { x: Fx, y: Fy } = decomposeForce(F, state.forceAngle); // y軸反転（下が正）

  const tipX = ORIGIN_X + Fx;
  const tipY = ORIGIN_Y + Fy;

  // 補助破線（平行四辺形の辺）
  drawDashedLine(
    p,
    ORIGIN_X,
    ORIGIN_Y + Fy,
    tipX,
    tipY,
    p.color(100, 100, 100, 120)
  );
  drawDashedLine(
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
  drawArrow(p, ORIGIN_X, ORIGIN_Y, tipX, tipY, p.color(0), { weight: 4 });

  // 角度弧
  drawAngleArc(p, ORIGIN_X, ORIGIN_Y, (state.forceAngle * Math.PI) / 180, 50);

  // ラベル
  drawXYLabels(p, Fx, Fy, tipX, tipY, (state.forceAngle * Math.PI) / 180);
  drawXYInfoPanel(p, Fx, Fy);
  drawInteractionHint(p, tipX, tipY);
}

/**
 * 角度弧を描画する。
 * @param p -
 * @param ox -
 * @param oy -
 * @param theta - ラジアン
 * @param r - 半径
 */
function drawAngleArc(p: p5, ox: number, oy: number, theta: number, r: number) {
  if (Math.abs(theta) < 0.02) return;
  p.noFill();
  p.stroke(80, 80, 80, 200);
  p.strokeWeight(1.5);
  // p5の arc は時計回り正。物理角（反時計回り正）→ p5では -θ
  p.arc(ox, oy, r * 2, r * 2, -theta, 0);

  // θラベル
  const midAngle = -theta / 2;
  const lx = ox + (r + 14) * Math.cos(midAngle);
  const ly = oy + (r + 14) * Math.sin(midAngle);
  drawLabel(p, "θ", lx, ly, p.color(60, 60, 60), 14);
}

/**
 * 各ベクトルのラベルを描画する。
 * @param p -
 * @param Fx - 水平成分（仮想px）
 * @param Fy - 垂直成分（仮想px, 下正）
 * @param tipX - 合力先端X
 * @param tipY - 合力先端Y
 * @param theta - ラジアン
 */
function drawXYLabels(
  p: p5,
  Fx: number,
  Fy: number,
  tipX: number,
  tipY: number,
  theta: number
) {
  // F ラベル（力の中点より少し外側）
  const midX = ORIGIN_X + Fx / 2 + 16 * Math.sin(theta);
  const midY = ORIGIN_Y + Fy / 2 - 16 * Math.cos(theta);
  drawLabel(p, "F", midX, midY, p.color(0), AXIS_LABEL_FONT_SIZE);

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
 * @param p -
 * @param Fx - 仮想px
 * @param Fy - 仮想px（下正）
 */
function drawXYInfoPanel(p: p5, Fx: number, Fy: number) {
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

/**
 * 力の矢印の先端にドラッグ操作用の円を描画します。
 * @param p - p5インスタンス
 * @param tipX - 矢印先端のX座標
 * @param tipY - 矢印先端のY座標
 */
function drawInteractionHint(p: p5, tipX: number, tipY: number) {
  // 先端の円
  p.noFill();
  p.stroke(0, 0, 0, state.isDragging ? 180 : 80);
  p.strokeWeight(2);
  p.circle(tipX, tipY, 20);
}

// ── ドラッグ操作 ────────────────────────────────────────────────────

/**
 * マウス/タッチ押下時の処理。
 * @param p -
 */
export function handlePress(p: p5) {
  const vx = (p.mouseX * V_W) / p.width;
  const vy = (p.mouseY * V_W) / p.width;
  const F = state.forceMag * FORCE_SCALE;
  const { x: fx, y: fy } = decomposeForce(F, state.forceAngle);
  const tipX = ORIGIN_X + fx;
  const tipY = ORIGIN_Y + fy;
  const dist = Math.hypot(vx - tipX, vy - tipY);
  if (dist < DRAG_RADIUS) {
    state.isDragging = true;
  }
}

/**
 * マウス/タッチドラッグ時の処理。
 * @param p -
 * @param MAX_FORCE - 力の最大値（N）
 */
export function handleDrag(p: p5, MAX_FORCE: number) {
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
  if (state.magnitudeValue) {
    state.magnitudeValue.html(`${state.forceMag.toFixed(1)} N`);
  }
  if (state.angleInput) state.angleInput.value(state.forceAngle);
  if (state.angleValue) {
    state.angleValue.html(`${state.forceAngle.toFixed(0)}°`);
  }
}

/**
 * マウス/タッチ離し時の処理。
 */
export function handleRelease() {
  state.isDragging = false;
}
