// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";

/**
 * 経過フレーム数を更新し、物体の斜面上のy座標を再計算する。
 * @param {*} p p5インスタンス
 */
export function calculate(p: p5) {
  if (state.clickedCount === true) {
    state.count++;
  }
  // buttonCreation()/materialSet()で生成済みのため呼び出し時点でnullになりえない
  state.material!.materialY =
    state.groundHeight -
    ((5 * p.width) / 6 - state.material!.materialX) *
      p.tan(p.radians(Number(state.slopeAngleButton!.value())));
}

/**
 * 坂とその角度表示を描画する。
 * @param {*} p p5インスタンス
 */
export function slope(p: p5) {
  p.fill(255);
  p.stroke(0);
  // buttonCreation()で生成済みのため呼び出し時点でnullになりえない
  p.triangle(
    state.referencePoint,
    state.groundHeight -
      state.slopeWidth *
        p.tan(p.radians(Number(state.slopeAngleButton!.value()))),
    state.referencePoint,
    state.groundHeight,
    state.referencePoint + state.slopeWidth,
    state.groundHeight
  );
  p.fill(0);
  p.strokeWeight(2);
  p.text(
    p.nf(Number(state.slopeAngleButton!.value()), 1, 1),
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
    p.PI + p.radians(Number(state.slopeAngleButton!.value()))
  );
  p.line(
    state.referencePoint + state.slopeWidth,
    state.groundHeight,
    state.referencePoint +
      state.slopeWidth +
      2 *
        state.materialHeight *
        p.sin(p.radians(Number(state.slopeAngleButton!.value()))),
    state.groundHeight -
      2 *
        state.materialHeight *
        p.cos(p.radians(Number(state.slopeAngleButton!.value())))
  );
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p: p5) {
  p.background(255);
  slope(p);
  calculate(p);
  state.material!.materialWeight = Number(state.weightButton!.value());
  state.material!._draw(p);
}
