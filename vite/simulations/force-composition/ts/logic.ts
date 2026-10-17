import { drawDashedLine } from "../../../ts/components/dashed-line.js";
import { drawArrowWithLabel } from "../../../ts/components/arrow.js";
import { drawAxes } from "../../../ts/components/axes.js";
import { drawGrid } from "../../../ts/components/grid.js";
import { CoordinateSystem } from "../../../ts/components/coordinate-system.js";
import { state } from "./state.js";
import {
  V_W,
  V_H,
  FORCE_SCALE,
  ORIGIN_X,
  ORIGIN_Y,
  GRID_STEP,
  LABEL_FONT_SIZE,
  AXIS_LABEL_FONT_SIZE
} from "./constants.js";
import {
  composeForces,
  computeForceMagnitude,
  computeForceAngleDeg
} from "./physics.js";

/** 軸の原点を表す座標系 */
const COORDINATE_SYSTEM = new CoordinateSystem({
  originX: ORIGIN_X,
  originY: ORIGIN_Y
});

/** 矢印（ラベル付き）の見た目 */
const ARROW_STYLE = {
  headWidthDivisor: 2.5,
  labelFontSize: LABEL_FONT_SIZE
};

/** 補助線（破線）の見た目 */
const DASHED_STYLE = { dashLength: 10 };

/**
 * グリッドと座標軸を描画する。
 * @param p - p5インスタンス
 */
export function drawGridAndAxes(p: p5) {
  // 中心(ORIGIN)を起点に外側へグリッド線を引く
  drawGrid(p, COORDINATE_SYSTEM, {
    stepX: GRID_STEP,
    stepY: GRID_STEP,
    bounds: { left: 0, top: 0, right: V_W, bottom: V_H }
  });

  // X/Y 軸（黒色矢印、両方向）と原点ラベル
  drawAxes(p, COORDINATE_SYSTEM, {
    xLabel: "x",
    yLabel: "y",
    originLabel: "O",
    bothDirections: true,
    extent: { left: 10, right: V_W - 10, top: 10, bottom: V_H - 10 },
    labelFontSize: AXIS_LABEL_FONT_SIZE,
    originLabelFontSize: LABEL_FONT_SIZE,
    headWidthDivisor: 2.5
  });
}

/**
 * 情報パネルを描画する。
 * @param p - p5インスタンス
 * @param f1x - F₁のX成分
 * @param f1y - F₁のY成分
 * @param f2x - F₂のX成分
 * @param f2y - F₂のY成分
 */
export function drawInfoPanel(
  p: p5,
  f1x: number,
  f1y: number,
  f2x: number,
  f2y: number
) {
  const { x: frx, y: fry } = composeForces(f1x, f1y, f2x, f2y);
  const f1Mag = computeForceMagnitude(f1x, f1y, FORCE_SCALE);
  const f2Mag = computeForceMagnitude(f2x, f2y, FORCE_SCALE);
  const frMag = computeForceMagnitude(frx, fry, FORCE_SCALE);
  const f1Angle = computeForceAngleDeg(f1x, f1y);
  const f2Angle = computeForceAngleDeg(f2x, f2y);
  const frAngle = computeForceAngleDeg(frx, fry);

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
 * @param p - p5インスタンス
 */
export function drawScene(p: p5) {
  p.background(255, 255, 255);
  drawGridAndAxes(p);

  const f1x = state.f1TipX;
  const f1y = state.f1TipY;
  const f2x = state.f2TipX;
  const f2y = state.f2TipY;
  const { x: frx, y: fry } = composeForces(f1x, f1y, f2x, f2y);

  // 平行四辺形の補助線（破線）
  const dashCol = p.color(100, 100, 100, 120);
  drawDashedLine(
    p,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    dashCol,
    DASHED_STYLE
  );
  drawDashedLine(
    p,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    dashCol,
    DASHED_STYLE
  );

  // 合力（赤）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + frx,
    ORIGIN_Y + fry,
    p.color(220, 50, 50),
    "合力 F",
    ARROW_STYLE
  );

  // F₁（黒）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f1x,
    ORIGIN_Y + f1y,
    p.color(0),
    "F1",
    ARROW_STYLE
  );

  // F₂（黒）
  drawArrowWithLabel(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + f2x,
    ORIGIN_Y + f2y,
    p.color(0),
    "F2",
    ARROW_STYLE
  );

  // 情報パネル
  drawInfoPanel(p, f1x, f1y, f2x, f2y);
}
