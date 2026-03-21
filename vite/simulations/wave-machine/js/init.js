// init.js は初期処理専用のファイルです。

import { state, MEDIUM_QUANTITY } from "./state.js";
import { Medium } from "./medium.js";
import {
  onDecelerationButtonClick,
  onAccelerationButtonClick,
} from "./element-function.js";

/**
 * FPS を定数として定義する。
 * @constant {number} FPS - フレームレート。
 */
export const FPS = 60;

/**
 * 初期設定を行う。
 * @param {*} p - p5 インスタンス。
 */
export function settingInit(p) {
  p.frameRate(FPS);
}

/**
 * 要素の選択を初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function elementSelectInit(p) {
  state.decelerationButton = p.select("#decelerationButton");
  state.accelerationButton = p.select("#accelerationButton");

  state.decelerationButton.mousePressed(() => onDecelerationButtonClick(p));
  state.accelerationButton.mousePressed(() => onAccelerationButtonClick(p));
}

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function valueInit(p) {
  state.stopper.resize(100, 0);
  state.button.resize(50, 50);
  state.buttonClickedIs = true;
  state.fixedIs = true;
  state.speed = 1;
  state.incidentWaves = [];
  state.reflectedWaves = [];

  state.mediums = new Array(MEDIUM_QUANTITY);
  for (let i = 0; i < MEDIUM_QUANTITY; i++) {
    state.mediums[i] = new Medium(
      p,
      (i * (p.width - 200)) / MEDIUM_QUANTITY,
      0,
      i
    );
  }

  state.stopperX =
    p.width - state.stopper.width - 5 - (p.width - 200) / MEDIUM_QUANTITY;
  state.stopperY = p.height / 2 - state.stopper.height / 8;
}
