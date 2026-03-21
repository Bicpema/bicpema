import { state } from "./state.js";
import { onPlayPause, onReset } from "./element-function.js";

export const FPS = 60;

/**
 * シミュレーションの初期設定
 * @param {*} p p5インスタンス
 * @param {*} canvasController BicpemaCanvasControllerインスタンス
 */
export function settingInit(p, canvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.LEFT, p.TOP);
}

/**
 * DOM要素の取得とイベントハンドラ登録
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  const playBtn = p.select("#playPauseButton");
  if (playBtn) {
    playBtn.mousePressed(onPlayPause);
  }
  const resetBtn = p.select("#resetButton");
  if (resetBtn) {
    resetBtn.mousePressed(onReset);
  }
}

/**
 * state の初期値を設定する
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  state.stage = 0;
  state.weightOn = true;
  state.t = 0;
  state.pistonY = 160;
  state.isPlaying = true;
}
