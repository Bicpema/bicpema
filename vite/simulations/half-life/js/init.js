// init.js は初期処理専用のファイルです。

import { state, initAtoms } from "./state.js";
import {
  onToggleButtonClick,
  onPlusBtnClick,
  onMinusBtnClick,
  onSubstanceChange,
} from "./element-function.js";

/**
 * FPS を定数として定義する。
 * @constant {number} FPS - フレームレート。
 */
export const FPS = 30;

/**
 * 初期設定を行う。
 * @param {*} p - p5 インスタンス。
 */
export function settingInit(p) {
  p.frameRate(FPS);
}

/**
 * 要素の選択とイベントバインドを初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function elementSelectInit(p) {
  state.toggleButton = p.select("#toggleButton");
  state.plusBtn = p.select("#plusBtn");
  state.minusBtn = p.select("#minusBtn");
  state.nDisplay = p.select("#nDisplay");

  state.toggleButton.mousePressed(() => onToggleButtonClick(p));
  state.plusBtn.mousePressed(() => onPlusBtnClick(p));
  state.minusBtn.mousePressed(() => onMinusBtnClick(p));

  state.radioButtons = p.selectAll('input[name="substance"]');
  state.radioButtons.forEach((radio) => {
    radio.changed(() => onSubstanceChange(p));
  });
}

/**
 * 値の初期化を行う。リサイズ時にも呼ばれる。
 * @param {*} p - p5 インスタンス。
 */
export function valueInit(p) {
  state.isRunning = false;
  state.currentTime = 0;
  state.N0 = state.n * state.n;

  if (state.toggleButton) {
    state.toggleButton.html("スタート");
    state.toggleButton.removeClass("btn-danger");
    state.toggleButton.addClass("btn-primary");
  }
  if (state.nDisplay) {
    state.nDisplay.html(state.n);
  }

  initAtoms(p);
}
