// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";

/**
 * 経過フレーム数を更新し、物体の斜面上のy座標を再計算する。
 * @param {*} p p5インスタンス
 */
export function calculate(p) {
  if (state.clickedCount == true) {
    state.count++;
  }
  state.material.materialY =
    state.groundHeight -
    ((5 * p.width) / 6 - state.material.materialX) *
      p.tan(p.radians(state.slopeAngleButton.value()));
}

/**
 * 坂とその角度表示を描画する。
 * @param {*} p p5インスタンス
 */
export function slope(p) {
  p.fill(255);
  p.stroke(0);
  p.triangle(
    state.referencePoint,
    state.groundHeight -
      state.slopeWidth * p.tan(p.radians(state.slopeAngleButton.value())),
    state.referencePoint,
    state.groundHeight,
    state.referencePoint + state.slopeWidth,
    state.groundHeight
  );
  p.fill(0);
  p.strokeWeight(2);
  p.text(
    p.nf(state.slopeAngleButton.value(), 1, 1),
    state.referencePoint + state.slopeWidth - state.slopeWidth / 10,
    state.groundHeight - 5
  );
  p.noFill();
  p.strokeWeight(5);
  p.arc(
    state.referencePoint + state.slopeWidth,
    state.groundHeight,
    state.slopeWidth / 10,
    state.slopeWidth / 10,
    p.PI,
    p.PI + p.radians(state.slopeAngleButton.value())
  );
  p.line(
    state.referencePoint + state.slopeWidth,
    state.groundHeight,
    state.referencePoint +
      state.slopeWidth +
      2 *
        state.materialHeight *
        p.sin(p.radians(state.slopeAngleButton.value())),
    state.groundHeight -
      2 *
        state.materialHeight *
        p.cos(p.radians(state.slopeAngleButton.value()))
  );
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);
  slope(p);
  calculate(p);
  state.material.materialWeight = state.weightButton.value();
  state.material._draw(p);
}
