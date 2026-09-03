// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Ball } from "./class.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import {
  onStartClick,
  onStopClick,
  onResetClick,
  onGridClick,
  onInputChange,
} from "./element-function.js";

/**
 * 要素の選択とイベントハンドラーの設定を行う。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.startButton = p.select("#startButton");
  state.stopButton = p.select("#stopButton");
  state.resetButton = p.select("#resetButton");
  state.gridButton = p.select("#gridButton");
  state.leftAngleInput = p.select("#leftAngleInput");
  state.leftLengthInput = p.select("#leftLengthInput");
  state.rightAngleInput = p.select("#rightAngleInput");
  state.rightLengthInput = p.select("#rightLengthInput");

  state.startButton.mousePressed(onStartClick);
  state.stopButton.mousePressed(onStopClick);
  state.gridButton.mousePressed(onGridClick);
  state.resetButton.mousePressed(() => onResetClick(p));
  state.leftAngleInput.input(onInputChange);
  state.leftLengthInput.input(onInputChange);
  state.rightAngleInput.input(onInputChange);
  state.rightLengthInput.input(onInputChange);

  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#exampleModal",
    closeSelectors: ".modal-close",
  });
}

/**
 * 初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  state.radi = p.width / 50;
  state.clickedCount = false;
  state.gridIs = false;
  state.gravity = 9.8;
  state.count = 0;
  state.weightImage.resize(p.width / 18, 0);
  state.leftPendulum = new Ball(500, 10);
  state.rightPendulum = new Ball(500, 15);
}
