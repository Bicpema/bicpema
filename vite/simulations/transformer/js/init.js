// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import {
  onCoil1PlusBtn,
  onCoil1MinusBtn,
  onCoil2PlusBtn,
  onCoil2MinusBtn,
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
  p.angleMode(p.DEGREES);
}

/**
 * 要素の選択を初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function elementSelectInit(p) {
  state.phaseRadios = document.querySelectorAll('input[name="phase"]');
  state.speedRadios = document.querySelectorAll('input[name="speed"]');
  state.coil1PlusBtn = p.select("#coil1PlusBtn");
  state.coil1MinusBtn = p.select("#coil1MinusBtn");
  state.coil2PlusBtn = p.select("#coil2PlusBtn");
  state.coil2MinusBtn = p.select("#coil2MinusBtn");
  state.count1Display = document.getElementById("count1Display");
  state.count2Display = document.getElementById("count2Display");

  state.coil1PlusBtn.mousePressed(() => onCoil1PlusBtn());
  state.coil1MinusBtn.mousePressed(() => onCoil1MinusBtn());
  state.coil2PlusBtn.mousePressed(() => onCoil2PlusBtn());
  state.coil2MinusBtn.mousePressed(() => onCoil2MinusBtn());
}

/**
 * 値の初期化を行う。
 */
export function valueInit() {
  state.count1 = 19;
  state.count2 = 4;
  state.t = 0;
  state.phase = true;
  state.omega = 1;
  if (state.count1Display) state.count1Display.textContent = state.count1 + 1;
  if (state.count2Display) state.count2Display.textContent = state.count2 + 1;
}
