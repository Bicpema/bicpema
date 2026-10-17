import {
  drawInfoPanel as drawInfoPanelComponent,
  INFO_PANEL_STYLE
} from "../../../ts/components/info-panel.js";
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

  drawInfoPanelComponent(
    p,
    [
      {
        label: "F1",
        value: f1Mag.toFixed(1),
        unit: "N",
        secondValue: f1Angle.toFixed(1),
        secondUnit: "°"
      },
      {
        label: "F2",
        value: f2Mag.toFixed(1),
        unit: "N",
        secondValue: f2Angle.toFixed(1),
        secondUnit: "°"
      },
      {
        label: "合力",
        value: frMag.toFixed(1),
        unit: "N",
        secondValue: frAngle.toFixed(1),
        secondUnit: "°",
        color: "rgb(220, 50, 50)",
        dividerAbove: true
      }
    ],
    {
      x: V_W - INFO_PANEL_STYLE.margin,
      y: V_H - INFO_PANEL_STYLE.margin,
      anchorX: "right",
      anchorY: "bottom",
      labelWidth: 50
    }
  );
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
