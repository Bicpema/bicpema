// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { computeRefractionAngle, computeSnellRatio } from "./physics.js";
import {
  INITIAL_N1,
  INITIAL_N2,
  LIGHT_SOURCE_LENGTH_DIVISOR,
  REMOCON_RESIZE_WIDTH_DIVISOR
} from "./constants.js";

/**
 * シミュレーションそのものの設定を行います。
 * @param {*} p p5インスタンス
 */
export function settingInit(p) {
  p.textAlign(p.CENTER);
  p.textSize(p.width / 50);
}

/**
 * 初期値を設定します。
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  state.lightRotateTheta = 0;
  state.pg = p.createGraphics(p.width, p.height);
  state.n1 = INITIAL_N1;
  state.n2 = INITIAL_N2;
  state.n12 = state.n2 / state.n1;
  state.theta1 = p.radians(state.lightRotateTheta);
  state.theta2 = computeRefractionAngle(state.theta1, state.n12);
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
  state.raysSpeedX = state.raysSpeed * p.cos(state.theta1 + p.PI / 2);
  state.raysSpeedY = state.raysSpeed * p.sin(state.theta1 + p.PI / 2);
  state.count = 0;
  state.rotateRemocon.resize(p.width / REMOCON_RESIZE_WIDTH_DIVISOR, 0);
  state.nRemocon.resize(p.width / REMOCON_RESIZE_WIDTH_DIVISOR, 0);
  state.boundary = computeSnellRatio(state.theta1, state.n12);
  state.simulationMode = "lineMax";
}
