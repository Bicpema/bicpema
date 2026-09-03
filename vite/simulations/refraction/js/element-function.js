// element-function.jsは仮想DOMメソッド管理専用のファイルです。
// このシミュレーションはDOM要素を持たず、キャンバス上に描画したリモコン・モードタブを
// クリック座標の当たり判定で操作するため、p5のmousePressedライフサイクルに対応する
// ハンドラをここにまとめています。

import { state } from "./state.js";
import { computeRefractionAngle } from "./physics.js";

/**
 * キャンバスクリック時の処理。
 * 回転リモコン・屈折率リモコン・表示モードタブの当たり判定を行い、状態を更新する。
 * @param {*} p p5インスタンス
 */
export function onMousePressed(p) {
  state.theta1 = p.radians(state.lightRotateTheta);
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
  state.n12 = state.n2 / state.n1;

  if (
    p.dist(
      p.width -
        state.rotateRemocon.width +
        (9 * state.rotateRemocon.width) / 10,
      p.height -
        state.rotateRemocon.height +
        (3 * state.rotateRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
      state.rotateRemocon.width / 20 &&
    state.lightRotateTheta < 90
  ) {
    state.lightRotateTheta += 0.1;
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
    if (state.lightRotateTheta > 90) {
      state.lightRotateTheta = 90;
    }
  }
  if (
    p.dist(
      p.width -
        state.rotateRemocon.width +
        (9 * state.rotateRemocon.width) / 10,
      p.height -
        state.rotateRemocon.height +
        (7 * state.rotateRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
      state.rotateRemocon.width / 20 &&
    state.lightRotateTheta > -90
  ) {
    state.lightRotateTheta -= 0.1;
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
    if (state.lightRotateTheta < -90) {
      state.lightRotateTheta = -90;
    }
  }
  if (
    p.dist(
      (9 * state.nRemocon.width) / 10,
      p.height / 2 + (3 * state.nRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
    state.nRemocon.width / 20
  ) {
    state.n1 += 0.1;
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (9 * state.nRemocon.width) / 10,
      p.height / 2 + (7 * state.nRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
      state.nRemocon.width / 20 &&
    state.n1 > 0.1
  ) {
    state.n1 -= 0.1;
    if (state.n1 < 0.1) {
      state.n1 = 0.1;
    }
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (9 * state.nRemocon.width) / 10,
      p.height / 2 - state.nRemocon.height + (3 * state.nRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
    state.nRemocon.width / 20
  ) {
    state.n2 += 0.1;
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (9 * state.nRemocon.width) / 10,
      p.height / 2 - state.nRemocon.height + (7 * state.nRemocon.height) / 10,
      p.mouseX,
      p.mouseY
    ) <
      state.nRemocon.width / 20 &&
    state.n2 > 0.1
  ) {
    state.n2 -= 0.1;
    if (state.n2 < 0.1) {
      state.n2 = 0.1;
    }
    state.raysX =
      p.width / 2 - (p.height / 2 - p.height / 6) * p.sin(state.theta1);
    state.raysY =
      p.height / 2 + (p.height / 2 - p.height / 6) * p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }

  const modes = ["animation", "animationMax", "line", "lineMax"];
  for (let i = 0; i < 4; i++) {
    if (
      p.width - ((4 - i) * p.width) / 8 < p.mouseX &&
      p.mouseX < p.width - ((4 - i - 1) * p.width) / 8 &&
      0 < p.mouseY &&
      p.mouseY < p.height / 20
    ) {
      state.simulationMode = modes[i];
    }
  }
}
