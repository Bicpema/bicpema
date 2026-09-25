// init.js は初期処理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { onWeightChange, onReset } from "./element-function.js";
import { initModal } from "../../../ts/bicpema-modal-controller.js";

const FPS = 30;

/**
 * DOM 要素の取得とイベントリスナーの登録、基本設定を行う。
 * @param {*} p p5 インスタンス
 */
export function elCreate(p: p5) {
  state.weightInput = p.select("#weightInput");
  state.weightDisplay = p.select("#weightDisplay");

  state.weightInput?.input(() => onWeightChange());
  p.select("#resetButton")?.mousePressed(() => onReset());

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal"
  });

  p.frameRate(FPS);
}

/**
 * シミュレーションの初期値を設定する。
 * @param {*} p p5 インスタンス
 */
export function initValue(p: p5) {
  p.textFont("sans-serif");
}
