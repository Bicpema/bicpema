// element-function.jsは仮想DOMメソッド管理専用のファイルです。
// このシミュレーションはDOM要素を持たず、キャンバス上に描画したリモコン・モードタブを
// クリック座標の当たり判定で操作するため、p5のmousePressedライフサイクルに対応する
// ハンドラをここにまとめています。

import { state } from "./state.js";
import { computeRefractionAngle, computeSnellRatio } from "./physics.js";
import {
  ANGLE_LIMIT_DEG,
  ROTATE_STEP_DEG,
  N_STEP,
  N_MIN,
  HIT_RADIUS_DIVISOR,
  REMOCON_HOTSPOT_X_NUMERATOR,
  REMOCON_HOTSPOT_TOP_Y_NUMERATOR,
  REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR,
  REMOCON_HOTSPOT_RATIO_DENOMINATOR,
  LIGHT_SOURCE_LENGTH_DIVISOR,
  MODE_TAB_COUNT,
  MODE_TAB_WIDTH_DIVISOR,
  MODE_TAB_HEIGHT_DIVISOR,
} from "./constants.js";

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
        (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height -
        state.rotateRemocon.height +
        (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.rotateRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
      state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
    state.lightRotateTheta < ANGLE_LIMIT_DEG
  ) {
    state.lightRotateTheta += ROTATE_STEP_DEG;
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.boundary = computeSnellRatio(state.theta1, state.n12);
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
    if (state.lightRotateTheta > ANGLE_LIMIT_DEG) {
      state.lightRotateTheta = ANGLE_LIMIT_DEG;
    }
  }
  if (
    p.dist(
      p.width -
        state.rotateRemocon.width +
        (REMOCON_HOTSPOT_X_NUMERATOR * state.rotateRemocon.width) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height -
        state.rotateRemocon.height +
        (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.rotateRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
      state.rotateRemocon.width / HIT_RADIUS_DIVISOR &&
    state.lightRotateTheta > -ANGLE_LIMIT_DEG
  ) {
    state.lightRotateTheta -= ROTATE_STEP_DEG;
    state.theta1 = p.radians(state.lightRotateTheta);
    state.theta2 = computeRefractionAngle(state.theta1, state.n12);
    state.boundary = computeSnellRatio(state.theta1, state.n12);
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
    if (state.lightRotateTheta < -ANGLE_LIMIT_DEG) {
      state.lightRotateTheta = -ANGLE_LIMIT_DEG;
    }
  }
  if (
    p.dist(
      (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
        REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height / 2 +
        (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
    state.nRemocon.width / HIT_RADIUS_DIVISOR
  ) {
    state.n1 += N_STEP;
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
        REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height / 2 +
        (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
      state.nRemocon.width / HIT_RADIUS_DIVISOR &&
    state.n1 > N_MIN
  ) {
    state.n1 -= N_STEP;
    if (state.n1 < N_MIN) {
      state.n1 = N_MIN;
    }
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
        REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height / 2 -
        state.nRemocon.height +
        (REMOCON_HOTSPOT_TOP_Y_NUMERATOR * state.nRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
    state.nRemocon.width / HIT_RADIUS_DIVISOR
  ) {
    state.n2 += N_STEP;
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }
  if (
    p.dist(
      (REMOCON_HOTSPOT_X_NUMERATOR * state.nRemocon.width) /
        REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.height / 2 -
        state.nRemocon.height +
        (REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR * state.nRemocon.height) /
          REMOCON_HOTSPOT_RATIO_DENOMINATOR,
      p.mouseX,
      p.mouseY
    ) <
      state.nRemocon.width / HIT_RADIUS_DIVISOR &&
    state.n2 > N_MIN
  ) {
    state.n2 -= N_STEP;
    if (state.n2 < N_MIN) {
      state.n2 = N_MIN;
    }
    state.raysX =
      p.width / 2 -
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.sin(state.theta1);
    state.raysY =
      p.height / 2 +
      (p.height / 2 - p.height / LIGHT_SOURCE_LENGTH_DIVISOR) *
        p.cos(state.theta1);
    state.raysX2 = p.width / 2;
    state.raysY2 = p.height / 2;
  }

  const modes = ["animation", "animationMax", "line", "lineMax"];
  for (let i = 0; i < MODE_TAB_COUNT; i++) {
    if (
      p.width - ((MODE_TAB_COUNT - i) * p.width) / MODE_TAB_WIDTH_DIVISOR <
        p.mouseX &&
      p.mouseX <
        p.width -
          ((MODE_TAB_COUNT - i - 1) * p.width) / MODE_TAB_WIDTH_DIVISOR &&
      0 < p.mouseY &&
      p.mouseY < p.height / MODE_TAB_HEIGHT_DIVISOR
    ) {
      state.simulationMode = modes[i];
    }
  }
}
