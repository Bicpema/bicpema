// init.js は初期処理専用のファイルです。

import { state, SPRING_Y_POSITIONS, ATTACH_X, NATURAL_LENGTH } from "./state.js";
import { Spring } from "./class.js";
import {
  onSpringConstantChange,
  onReset,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

const FPS = 30;

/**
 * 要素の選択とイベントハンドラーの設定、基本設定を行う。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.springConstantInput = p.select("#springConstantInput");
  state.springConstantDisplay = p.select("#springConstantDisplay");
  state.settingsModal = p.select("#settingsModal");

  state.springConstantInput.input(() => onSpringConstantChange());
  p.select("#resetButton").mousePressed(() => onReset());
  p.select("#toggleModal").mousePressed(() => onToggleModal());
  p.select("#closeModal").mousePressed(() => onCloseModal());

  p.frameRate(FPS);
}

/**
 * シミュレーションの初期値を設定する。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  const k = parseInt(state.springConstantInput.value());
  state.springs = SPRING_Y_POSITIONS.map(
    (y) => new Spring(ATTACH_X, y, NATURAL_LENGTH, k)
  );
}
