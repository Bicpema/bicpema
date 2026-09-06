// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { Train } from "./class.js";
import {
  onPlayPause,
  onToggleModal,
  onCloseModal,
  onReset,
  onAccelerationChange,
} from "./element-function.js";
import { DEFAULT_ACCELERATION, TRAIN_START_X_DIVISOR } from "./constants.js";

/** フレームレート */
export const FPS = 60;
/** 仮想キャンバス幅 */
export const V_W = 1000;
/** 仮想ピクセル/メートル（1m = 50 仮想px） */
export const PX_PER_METER = 50;

/**
 * キャンバスとp5.jsの基本設定を行う。
 * @param {*} p p5インスタンス。
 * @param {*} canvasController BicpemaCanvasControllerインスタンス。
 */
export function settingInit(p, canvasController) {
  p.loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (f) => {
      state.font = f;
    },
    () => {}
  );
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

/**
 * DOM要素を取得し、イベントを設定する。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  p.select("#playPauseButton").mousePressed(onPlayPause);
  p.select("#toggleModal").mousePressed(onToggleModal);
  p.select("#closeModal").mousePressed(onCloseModal);
  p.select("#resetButton").mousePressed(onReset);
  p.select("#accelerationInput").input(onAccelerationChange);
}

/**
 * シミュレーション変数の初期化。
 * @param {*} p p5インスタンス。
 */
export function initValue(p) {
  state.isPlaying = false;
  state.elapsedTime = 0;
  state.lastGraphUpdate = 0;
  state.maxObservedVelocity = 0;
  state.acceleration =
    parseFloat(p.select("#accelerationInput").value()) || DEFAULT_ACCELERATION;
  state.train = new Train(V_W / TRAIN_START_X_DIVISOR);
  state.vtData = [{ x: 0, y: 0 }];
}
