// index.ts はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { settingInit, elementSelectInit } from "./init.js";
import { state } from "./state.js";
import { updateGraph } from "./graph.js";
import { drawScenery, drawTrain, drawInfoPanel } from "./function.js";
import { FPS, V_W, GROUND_Y_RATIO, SAMPLE_EVERY_FRAMES } from "./constants.js";

/** 1フレーム分、運動を進め、一定間隔でv-t図へ点を追加する。 */
const advance = () => {
  state.stepCount++;
  state.train.step(1 / FPS, state.acceleration);
  if (state.stepCount % SAMPLE_EVERY_FRAMES === 0) {
    state.vtData.push({
      x: state.stepCount / FPS,
      y: state.train.velocity
    });
    updateGraph();
  }
};

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  // 上半分をp5キャンバス、下半分をv-t図にする
  const canvasController = new BicpemaCanvasController({ heightMode: "half" });
  let isFirstDraw = true;

  /** キャンバスを生成し、初期設定とグラフの生成を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    updateGraph();
  };

  /** 毎フレームの更新と描画を行う。一時停止中は状態が変わったときだけ再描画する。 */
  p.draw = () => {
    if (state.isPlaying) advance();
    else if (!state.needsRedraw) return;
    state.needsRedraw = false;

    p.scale(p.width / V_W);
    const vh = V_W * (p.height / p.width);
    const groundY = vh * GROUND_Y_RATIO;
    drawScenery(p, groundY, vh, state.train.position);
    drawTrain(p, groundY);
    drawInfoPanel(
      p,
      state.train.velocity,
      state.stepCount / FPS,
      state.acceleration
    );

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定し、再描画する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    state.needsRedraw = true;
  };
};

new p5(sketch);
