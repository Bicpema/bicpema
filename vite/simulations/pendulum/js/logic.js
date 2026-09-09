// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";
import {
  GRID_STEP,
  MAJOR_GRID_INTERVAL,
  GRID_STROKE_WEIGHT_MAJOR,
  GRID_STROKE_WEIGHT_MINOR,
  BACKGROUND_STROKE_ALPHA,
  PANEL_BORDER_STROKE_WEIGHT,
  AFTERIMAGE_ALPHA
} from "./constants.js";

/**
 * 3分割された画面の枠線とグリッド線を描画する。
 * @param {*} p p5インスタンス
 */
function drawBackground(p) {
  for (let i = 0; i < 3; i++) {
    p.stroke(0, BACKGROUND_STROKE_ALPHA);
    if (state.gridIs) {
      for (let f = -p.width / 6; f < p.width / 6; f += GRID_STEP) {
        p.strokeWeight(
          f % MAJOR_GRID_INTERVAL === 0
            ? GRID_STROKE_WEIGHT_MAJOR
            : GRID_STROKE_WEIGHT_MINOR
        );
        p.line(
          f + (p.width / 3) * i + p.width / 6,
          0,
          f + (p.width / 3) * i + p.width / 6,
          p.height
        );
      }
      for (let f = 0; f < p.height; f += GRID_STEP) {
        p.strokeWeight(
          f % MAJOR_GRID_INTERVAL === 0
            ? GRID_STROKE_WEIGHT_MAJOR
            : GRID_STROKE_WEIGHT_MINOR
        );
        p.line((p.width / 3) * i, f, (p.width / 3) * i + p.width / 3, f);
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
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);
  if (state.clickedCount) state.count += 1;
  drawBackground(p);

  state.leftPendulum.calculate(p, 0);
  state.rightPendulum.calculate(p, p.width / 3);
  state.leftPendulum.display(p, 0);
  state.rightPendulum.display(p, p.width / 3);

  state.leftPendulum.calculate(p, (2 * p.width) / 3);
  state.rightPendulum.calculate(p, (2 * p.width) / 3);
  p.tint(255, AFTERIMAGE_ALPHA);
  p.stroke(0, AFTERIMAGE_ALPHA);
  state.leftPendulum.display(p, (2 * p.width) / 3);
  state.rightPendulum.display(p, (2 * p.width) / 3);
  p.tint(255);
}
