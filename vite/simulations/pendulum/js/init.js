// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Ball } from "./class.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindStartStopControls } from "../../../js/bicpema-controls-controller.js";
import {
  onStartClick,
  onStopClick,
  onResetClick,
  onGridClick,
  onInputChange
} from "./element-function.js";
import {
  GRAVITY,
  BALL_RADIUS_DIVISOR,
  WEIGHT_IMAGE_WIDTH_DIVISOR,
  INITIAL_STRING_LENGTH,
  INITIAL_LEFT_ANGLE_DEG,
  INITIAL_RIGHT_ANGLE_DEG
} from "./constants.js";

/**
 * 要素の選択とイベントハンドラーの設定を行う。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.gridButton = p.select("#gridButton");
  state.leftAngleInput = p.select("#leftAngleInput");
  state.leftLengthInput = p.select("#leftLengthInput");
  state.rightAngleInput = p.select("#rightAngleInput");
  state.rightLengthInput = p.select("#rightLengthInput");

  const { startButton, stopButton, resetButton } = bindStartStopControls(p, {
    startSelector: "#startButton",
    stopSelector: "#stopButton",
    resetSelector: "#resetButton",
    onStart: onStartClick,
    onStop: onStopClick,
    onReset: () => onResetClick(p)
  });
  state.startButton = startButton;
  state.stopButton = stopButton;
  state.resetButton = resetButton;

  state.gridButton.mousePressed(onGridClick);
  state.leftAngleInput.input(onInputChange);
  state.leftLengthInput.input(onInputChange);
  state.rightAngleInput.input(onInputChange);
  state.rightLengthInput.input(onInputChange);

  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#exampleModal",
    closeSelectors: ".modal-close"
  });
}

/**
 * 初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  state.radi = p.width / BALL_RADIUS_DIVISOR;
  state.clickedCount = false;
  state.gridIs = false;
  state.gravity = GRAVITY;
  state.count = 0;
  state.weightImage.resize(p.width / WEIGHT_IMAGE_WIDTH_DIVISOR, 0);
  state.leftPendulum = new Ball(INITIAL_STRING_LENGTH, INITIAL_LEFT_ANGLE_DEG);
  state.rightPendulum = new Ball(
    INITIAL_STRING_LENGTH,
    INITIAL_RIGHT_ANGLE_DEG
  );
}
