// class.js はMaterialクラス管理専用のファイルです。

import { state } from "./state.js";
import { computeSlideDisplacement } from "./physics.js";

/**
 * 矢印の先端の三角形を描画する。
 * @param {*} p p5インスタンス
 * @param {number} a 矢印先端のx座標
 * @param {number} b 矢印先端のy座標
 * @param {string} n 矢印の向き（"gravity" | "vertical" | "holizonal" | "normal"）
 */
function arrow(p, a, b, n) {
  if (n == "gravity") {
    p.triangle(
      a,
      b,
      a - state.minimumUnit / 2,
      b - state.minimumUnit / 2,
      a + state.minimumUnit / 2,
      b - state.minimumUnit / 2
    );
  } else if (n == "vertical") {
    p.triangle(
      a,
      b,
      a +
        (state.minimumUnit / 2) *
          (p.sin(p.radians(state.slopeAngleButton.value())) -
            p.cos(p.radians(state.slopeAngleButton.value()))),
      b -
        (state.minimumUnit / 2) *
          (p.cos(p.radians(state.slopeAngleButton.value())) +
            p.sin(p.radians(state.slopeAngleButton.value()))),
      a +
        (state.minimumUnit / 2) *
          (p.sin(p.radians(state.slopeAngleButton.value())) +
            p.cos(p.radians(state.slopeAngleButton.value()))),
      b +
        (state.minimumUnit / 2) *
          (-p.cos(p.radians(state.slopeAngleButton.value())) +
            p.sin(p.radians(state.slopeAngleButton.value())))
    );
  } else if (n == "holizonal") {
    p.triangle(
      a,
      b,
      a -
        (state.minimumUnit / 2) *
          (p.sin(p.radians(state.slopeAngleButton.value())) +
            p.cos(p.radians(state.slopeAngleButton.value()))),
      b +
        (state.minimumUnit / 2) *
          (p.cos(p.radians(state.slopeAngleButton.value())) -
            p.sin(p.radians(state.slopeAngleButton.value()))),
      a -
        (state.minimumUnit / 2) *
          (-p.sin(p.radians(state.slopeAngleButton.value())) +
            p.cos(p.radians(state.slopeAngleButton.value()))),
      b -
        (state.minimumUnit / 2) *
          (p.cos(p.radians(state.slopeAngleButton.value())) +
            p.sin(p.radians(state.slopeAngleButton.value())))
    );
  } else if (n == "normal") {
    p.triangle(
      a,
      b,
      a -
        (state.minimumUnit / 2) *
          (p.sin(p.radians(state.slopeAngleButton.value())) +
            p.cos(p.radians(state.slopeAngleButton.value()))),
      b +
        (state.minimumUnit / 2) *
          (p.cos(p.radians(state.slopeAngleButton.value())) -
            p.sin(p.radians(state.slopeAngleButton.value()))),
      a +
        (state.minimumUnit / 2) *
          (p.cos(p.radians(state.slopeAngleButton.value())) -
            p.sin(p.radians(state.slopeAngleButton.value()))),
      b +
        (state.minimumUnit / 2) *
          (p.sin(p.radians(state.slopeAngleButton.value())) +
            p.cos(p.radians(state.slopeAngleButton.value())))
    );
  }
}

/**
 * 破線を描画する。
 * @param {*} p p5インスタンス
 * @param {number} aX 始点のx座標
 * @param {number} aY 始点のy座標
 * @param {number} bX 終点のx座標
 * @param {number} bY 終点のy座標
 * @param {number} w 線の太さ
 */
function dashedLine(p, aX, aY, bX, bY, w) {
  p.stroke(0);
  p.strokeWeight(w);
  p.drawingContext.setLineDash([10, 5, 2, 5]);
  p.line(aX, aY, bX, bY);
  p.drawingContext.setLineDash([]);
  p.strokeWeight(5);
}

/**
 * 坂の上の物体と、力の矢印（表示パターンに応じて）を描画する。
 * @param {*} p p5インスタンス
 * @param {number} a 物体左上頂点のx座標
 * @param {number} b 物体左上頂点のy座標
 * @param {number} sort 表示パターン（1〜3）
 * @param {number} w 質量
 */
function rectMaterial(p, a, b, sort, w) {
  p.stroke(0);
  p.fill(255);
  p.quad(
    a,
    b,
    a + state.materialHeight * p.sin(p.radians(state.slopeAngleButton.value())),
    b - state.materialHeight * p.cos(p.radians(state.slopeAngleButton.value())),
    a +
      state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value())) +
      state.materialHeight * p.sin(p.radians(state.slopeAngleButton.value())),
    b +
      state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value())) -
      state.materialHeight * p.cos(p.radians(state.slopeAngleButton.value())),
    a + state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value())),
    b + state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value()))
  );
  p.fill(0);
  const ARROW_LENGTH = w * state.gravityButton.value();
  if (sort == 1) {
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      1
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
      1
    );
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value()))),
      1
    );
    p.line(
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value())))
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
      "vertical"
    );
    p.line(
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value())))
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value()))),
      "holizonal"
    );
  }
  if (sort == 2) {
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
      1
    );
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value()))),
      1
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value()))),
      "holizonal"
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
      "vertical"
    );
    p.line(
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
      1
    );
    dashedLine(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          p.sin(p.radians(state.slopeAngleButton.value())) *
          p.cos(p.radians(state.slopeAngleButton.value())),
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * p.sq(p.sin(p.radians(state.slopeAngleButton.value()))),
      1
    );
  }
  if (sort == 3) {
    p.line(
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH
    );
    arrow(
      p,
      a +
        (state.materialWidth *
          p.cos(p.radians(state.slopeAngleButton.value())) +
          state.materialHeight *
            p.sin(p.radians(state.slopeAngleButton.value()))) /
          2,
      b +
        (state.materialWidth *
          p.sin(p.radians(state.slopeAngleButton.value())) -
          state.materialHeight *
            p.cos(p.radians(state.slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
  }
  p.stroke(255, 0, 0);
  p.fill(255, 0, 0);
  p.line(
    a +
      (state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value())) +
        state.materialHeight *
          p.sin(p.radians(state.slopeAngleButton.value()))) /
        2 -
      (state.materialHeight / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())),
    b +
      (state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value())) -
        state.materialHeight *
          p.cos(p.radians(state.slopeAngleButton.value()))) /
        2 +
      (state.materialHeight / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())),
    a +
      (state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value())) +
        state.materialHeight *
          p.sin(p.radians(state.slopeAngleButton.value()))) /
        2 -
      (state.materialHeight / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())) +
      ARROW_LENGTH *
        p.cos(p.radians(state.slopeAngleButton.value())) *
        p.sin(p.radians(state.slopeAngleButton.value())),
    b +
      (state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value())) -
        state.materialHeight *
          p.cos(p.radians(state.slopeAngleButton.value()))) /
        2 +
      (state.materialHeight / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())) -
      ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value())))
  );
  arrow(
    p,
    a +
      (state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value())) +
        state.materialHeight *
          p.sin(p.radians(state.slopeAngleButton.value()))) /
        2 -
      (state.materialHeight / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())) +
      ARROW_LENGTH *
        p.cos(p.radians(state.slopeAngleButton.value())) *
        p.sin(p.radians(state.slopeAngleButton.value())),
    b +
      (state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value())) -
        state.materialHeight *
          p.cos(p.radians(state.slopeAngleButton.value()))) /
        2 +
      (state.materialHeight / 2) *
        p.cos(p.radians(state.slopeAngleButton.value())) -
      (state.minimumUnit / 2) *
        p.sin(p.radians(state.slopeAngleButton.value())) -
      ARROW_LENGTH * p.sq(p.cos(p.radians(state.slopeAngleButton.value()))),
    "normal"
  );
}

/**
 * 坂を滑る物体を表すクラス。
 */
export class Material {
  /**
   * @param {*} p p5インスタンス
   * @param {number} m_w 質量[kg]
   * @param {number} s 表示パターン（1〜3）
   */
  constructor(p, m_w, s) {
    this.materialX = state.referencePoint;
    this.materialY =
      state.groundHeight -
      state.slopeWidth * p.tan(p.radians(state.slopeAngleButton.value()));
    this.materialWeight = m_w;
    this.sort = s;
  }

  /**
   * 物体の位置を更新し、描画する。
   * @param {*} p p5インスタンス
   */
  _draw(p) {
    if (state.clickedCount == true) {
      const { dx, dy } = computeSlideDisplacement(
        state.gravityButton.value(),
        state.slopeAngleButton.value(),
        state.count
      );
      this.materialX += dx;
      this.materialY += dy;
    }
    if (
      this.materialX >=
      state.referencePoint +
        state.slopeWidth -
        state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value()))
    ) {
      this.materialX =
        state.referencePoint +
        state.slopeWidth -
        state.materialWidth * p.cos(p.radians(state.slopeAngleButton.value()));
      this.materialY =
        state.groundHeight -
        state.materialWidth * p.sin(p.radians(state.slopeAngleButton.value()));
    }
    rectMaterial(
      p,
      this.materialX,
      this.materialY,
      this.sort,
      this.materialWeight
    );
  }
}
