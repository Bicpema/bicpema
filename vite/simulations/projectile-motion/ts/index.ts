// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import {
  fullScreen,
  elementSelectInit,
  elementPositionInit,
  updateUsableHeight,
  CANVAS_HEIGHT_RATIO
} from "./init.js";
import {
  onStartClick,
  onStopClick,
  onResetButtonClick
} from "./element-function.js";
import { resetSimulationState, updateLayout, drawSimulation } from "./logic.js";
import { bindStartStopControls } from "../../../ts/bicpema-controls-controller.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  let isFirstDraw = true;

  /** キャンバスとDOM要素を生成し、状態の初期化と開始・停止・リセットボタンの設定を行う。 */
  p.setup = () => {
    fullScreen(p);
    elementSelectInit(p);
    resetSimulationState(p);
    elementPositionInit(p);

    const { startButton, stopButton, resetButton } = bindStartStopControls(p, {
      startSelector: "#startButton",
      stopSelector: "#stopButton",
      resetSelector: "#resetButton",
      onStart: onStartClick,
      onStop: onStopClick,
      /** リセットボタンが押されたときにシミュレーションを初期状態に戻す。 */
      onReset: () => onResetButtonClick(p)
    });
    state.startButton = startButton;
    state.stopButton = stopButton.hide();
    state.resetButton = resetButton;
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバス・レイアウト・DOMの位置を再設定する。 */
  p.windowResized = () => {
    updateUsableHeight(p);
    p.resizeCanvas(p.windowWidth, state.usableHeight * CANVAS_HEIGHT_RATIO);
    updateLayout(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
