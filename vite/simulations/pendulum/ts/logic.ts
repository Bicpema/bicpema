// logic.tsはシミュレーションの描画処理と物理更新専用のファイルです。

import p5 from "p5";
import { state } from "./state.js";
import {
  GRID_STEP,
  MAJOR_GRID_INTERVAL,
  GRID_STROKE_WEIGHT_MAJOR,
  GRID_STROKE_WEIGHT_MINOR,
  BACKGROUND_STROKE_ALPHA,
  PANEL_BORDER_STROKE_WEIGHT,
  AFTERIMAGE_ALPHA,
  PIVOT_Y_RATIO,
  CONTROLS_BOTTOM_MARGIN
} from "./constants.js";
import { computeDisplayScale } from "./physics.js";

/**
 * 支点の位置と表示倍率を現在のキャンバスサイズ・振り子の設定に合わせて更新する。
 * @param p - p5インスタンス
 */
function updateDisplayScale(p: p5) {
  state.pivotY = p.height * PIVOT_Y_RATIO;
  state.displayScale = computeDisplayScale({
    canvasHeight: p.height,
    pivotY: state.pivotY,
    halfPanelWidth: p.width / 6,
    ballRadius: state.radi,
    bottomMargin: CONTROLS_BOTTOM_MARGIN,
    pendulums: [state.leftPendulum!, state.rightPendulum!]
  });
}

/**
 * 3分割された画面の枠線とグリッド線を描画する。
 * グリッド線は表示倍率に合わせて間隔を変え、支点を基準に配置する。
 * @param p - p5インスタンス
 */
function drawBackground(p: p5) {
  const step = GRID_STEP * state.displayScale;
  const majorEvery = MAJOR_GRID_INTERVAL / GRID_STEP;
  const halfCount = Math.floor(p.width / 6 / step);
  const topIndex = -Math.floor(state.pivotY / step);
  const bottomIndex = Math.floor((p.height - state.pivotY) / step);
  for (let i = 0; i < 3; i++) {
    p.stroke(0, BACKGROUND_STROKE_ALPHA);
    if (state.gridIs && step > 0) {
      const centerX = (p.width / 3) * i + p.width / 6;
      for (let k = -halfCount; k <= halfCount; k++) {
        p.strokeWeight(
          k % majorEvery === 0
            ? GRID_STROKE_WEIGHT_MAJOR
            : GRID_STROKE_WEIGHT_MINOR
        );
        p.line(centerX + k * step, 0, centerX + k * step, p.height);
      }
      for (let k = topIndex; k <= bottomIndex; k++) {
        const y = state.pivotY + k * step;
        p.strokeWeight(
          k % majorEvery === 0
            ? GRID_STROKE_WEIGHT_MAJOR
            : GRID_STROKE_WEIGHT_MINOR
        );
        p.line((p.width / 3) * i, y, (p.width / 3) * i + p.width / 3, y);
      }
    }
    p.noFill();
    p.stroke(0);
    p.strokeWeight(PANEL_BORDER_STROKE_WEIGHT);
    p.rect((p.width / 3) * i, 0, p.width / 3, p.height);
  }
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param p - p5インスタンス
 */
export function drawSimulation(p: p5) {
  p.background(255);
  if (state.clickedCount) state.count += 1;
  updateDisplayScale(p);
  drawBackground(p);

  state.leftPendulum!.calculate(p, 0);
  state.rightPendulum!.calculate(p, p.width / 3);
  state.leftPendulum!.display(p, 0);
  state.rightPendulum!.display(p, p.width / 3);

  state.leftPendulum!.calculate(p, (2 * p.width) / 3);
  state.rightPendulum!.calculate(p, (2 * p.width) / 3);
  p.tint(255, AFTERIMAGE_ALPHA);
  p.stroke(0, AFTERIMAGE_ALPHA);
  state.leftPendulum!.display(p, (2 * p.width) / 3);
  state.rightPendulum!.display(p, (2 * p.width) / 3);
  p.tint(255);
}
