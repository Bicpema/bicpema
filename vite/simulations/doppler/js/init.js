// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import {
  startButtonFunction,
  stopButtonFunction,
  resetButtonAction,
  onSpeedInputChange,
} from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindStartStopControls } from "../../../js/bicpema-controls-controller.js";

/**
 * フレームレート。
 * @constant {number}
 */
export const FPS = 60;

/**
 * 描画座標系の幅。
 * @constant {number}
 */
export const W = 1000;

/**
 * 描画座標系の高さ。
 * @constant {number}
 */
export const H = ((1000 * 9) / 16) * 0.9;

/**
 * 初期設定を行う。
 * @param {*} p - p5 インスタンス。
 */
export function settingInit(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

/**
 * HTML ボタンのイベントリスナーを登録する。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  bindStartStopControls(p, {
    startSelector: "#startButton",
    stopSelector: "#stopButton",
    resetSelector: "#resetButton",
    onStart: startButtonFunction,
    onStop: stopButtonFunction,
    onReset: resetButtonAction,
  });
  initModal({
    openSelectors: "#settingsButton",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
  p.select("#speedInput").input(onSpeedInputChange);
}

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  state.posx = 50;
  state.posy = H / 2;
  state.count = 0;
  state.sounds = [];
  state.clickedCount = false;
}
