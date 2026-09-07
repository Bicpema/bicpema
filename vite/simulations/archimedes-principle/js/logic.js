import { state } from "./state.js";
import { BASE_W, BASE_H, TANK_BOTTOM_Y, CYL_H } from "./init.js";

/** シミュレーション内で使用する水面Y座標（基準座標系） */
const WATER_SURFACE_Y = 175;

/** 矢印の先端（矢頭）の大きさ */
const ARROW_HEAD_SIZE = 14;
/** 矢印の線の太さ */
const ARROW_STROKE_WEIGHT = 3;
/** 矢印ラベルのフォントサイズ */
const ARROW_LABEL_FONT_SIZE = 18;
/** 力の矢印の円柱中心からの水平オフセット */
const ARROW_OFFSET_X = 15;
/** 矢印ラベルの水平方向の追加オフセット */
const ARROW_LABEL_OFFSET_X = 6;
/** 矢印ラベルの垂直方向の追加オフセット */
const ARROW_LABEL_OFFSET_Y = 2;
/** 矢印長スケール: 密度1.0・完全水没のとき長さがこのpx値になる */
const FORCE_SCALE = 80;
/** ドラッグ時に円柱を移動できる水槽底面からの余白 */
const DRAG_BOTTOM_MARGIN = 50;

/**
 * 情報テキストをDOM要素に反映する。
 * @param {import("./cylinder.js").Cylinder} cylinder 円柱オブジェクト
 * @param {number} waterSurfaceY 水面のY座標
 */
function drawInfoText(cylinder, waterSurfaceY) {
  const subFrac = cylinder.getSubmergedFraction(waterSurfaceY);
  const pct = Math.round(subFrac * 100);
  const label = document.getElementById("submergedRatioLabel");
  if (label) {
    label.textContent = `水中体積比: ${pct}%`;
  }
}

/**
 * 矢印を描画するヘルパー関数。
 * @param {*} p p5インスタンス
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X（矢印の先端）
 * @param {number} y2 終点Y（矢印の先端）
 * @param {number[]} col RGB色配列 [r, g, b]
 * @param {string} label ラベルテキスト
 * @param {number} lx ラベルX座標
 * @param {number} ly ラベルY座標
 * @param {string} lAlignH 水平アライメント（p.LEFT / p.CENTER / p.RIGHT）
 */
function drawArrow(p, x1, y1, x2, y2, col, label, lx, ly, lAlignH) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);

  p.push();
  p.stroke(col[0], col[1], col[2]);
  p.fill(col[0], col[1], col[2]);
  p.strokeWeight(ARROW_STROKE_WEIGHT);
  p.line(x1, y1, x2, y2);

  // 矢頭
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.noStroke();
  p.triangle(
    0,
    0,
    -ARROW_HEAD_SIZE,
    -ARROW_HEAD_SIZE * 0.4,
    -ARROW_HEAD_SIZE,
    ARROW_HEAD_SIZE * 0.4
  );
  p.pop();

  // ラベル
  if (label) {
    p.noStroke();
    p.textFont("sans-serif");
    p.textSize(ARROW_LABEL_FONT_SIZE);
    p.textAlign(lAlignH ?? p.CENTER, p.CENTER);
    p.text(label, lx ?? (x1 + x2) / 2, ly ?? (y1 + y2) / 2);
  }
  p.pop();
}

/**
 * 円柱にかかる力の矢印を描画する。
 *  1. 重力（↓, 赤）: 密度に比例
 *  2. 浮力（↑, 緑）: 水中体積比に比例
 * @param {*} p p5インスタンス
 */
function drawForceArrows(p) {
  const cylinder = state.cylinder;
  if (!cylinder) return;

  const subFrac = cylinder.getSubmergedFraction(WATER_SURFACE_Y);

  const { cx, cy, h } = cylinder;
  const centerY = cy - h / 2;

  const colGravity = [229, 57, 53]; // 重力: 赤  (#E53935)
  const colBuoyancy = [56, 142, 60]; // 浮力: 緑  (#388E3C)

  // ----- 1. 重力（↓, 円柱中心から下向き） -----
  const gravityLen = cylinder.density * FORCE_SCALE;
  drawArrow(
    p,
    cx - ARROW_OFFSET_X,
    centerY,
    cx - ARROW_OFFSET_X,
    centerY + gravityLen,
    colGravity,
    "重力",
    cx - ARROW_OFFSET_X - ARROW_LABEL_OFFSET_X,
    centerY + gravityLen + ARROW_LABEL_OFFSET_Y,
    p.RIGHT
  );

  // ----- 2. 浮力（↑, 円柱中心から上向き） -----
  if (subFrac > 0) {
    const buoyancyLen = subFrac * FORCE_SCALE;
    drawArrow(
      p,
      cx + ARROW_OFFSET_X,
      centerY,
      cx + ARROW_OFFSET_X,
      centerY - buoyancyLen,
      colBuoyancy,
      "浮力",
      cx + ARROW_OFFSET_X + ARROW_LABEL_OFFSET_X,
      centerY - buoyancyLen - ARROW_LABEL_OFFSET_Y,
      p.LEFT
    );
  }
}

/**
 * シミュレーション全体の描画と物理更新を行う関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  p.scale(p.width / BASE_W);

  p.background(255);

  if (state.tank) {
    state.tank.draw(p);
  }
  if (state.cylinder) {
    state.cylinder.draw(p);
  }
  if (state.tank) {
    // 水面の手前の線を円柱より前面に再描画し、沈み込みを表現する
    state.tank.drawWaterSurfaceLine(p);
  }

  drawForceArrows(p);

  drawInfoText(state.cylinder, WATER_SURFACE_Y);

  state.cylinder.update(WATER_SURFACE_Y, TANK_BOTTOM_Y);

  if (state.cylinder.dragging) {
    state.cylinder.cy =
      p.mouseY / (p.height / BASE_H) + state.cylinder.dragOffsetY;
    state.cylinder.cy = p.constrain(
      state.cylinder.cy,
      WATER_SURFACE_Y,
      TANK_BOTTOM_Y - DRAG_BOTTOM_MARGIN
    );
  }
}

/**
 * マウス押下時の処理。
 * @param {*} p p5インスタンス。
 */
export function handleMousePressed(p) {
  const scaleX = BASE_W / p.width;
  const scaleY = BASE_H / p.height;
  const mx = p.mouseX * scaleX;
  const my = p.mouseY * scaleY;

  if (state.cylinder && state.cylinder.isOver(mx, my)) {
    state.cylinder.dragging = true;
    state.cylinder.dragOffsetY = state.cylinder.cy - my;
    state.cylinder.vy = 0;
  }
}

/**
 * マウスリリース時の処理。
 * @param {*} p p5インスタンス。
 */
export function handleMouseReleased(p) {
  if (state.cylinder && state.cylinder.dragging) {
    state.cylinder.dragging = false;
    state.cylinder.vy = 0;
    p.loop();
  }
}
