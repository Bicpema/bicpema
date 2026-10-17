// index.ts はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { settingInit, elementSelectInit } from "./init.js";
import { state } from "./state.js";
import { updateGraph } from "./graph.js";
import {
  drawScenery,
  drawTrain,
  drawAccelerationArrow,
  drawInfoPanel
} from "./function.js";
import {
  FPS,
  V_W,
  GROUND_Y_RATIO,
  SAMPLE_EVERY_FRAMES,
  TRAIN_X
} from "./constants.js";

/** 幅の狭い画面とみなすキャンバス幅 (px) */
const NARROW_WIDTH = 700;
/** 幅の狭い画面での電車・数値表示の拡大率 */
const NARROW_SCALE = 1.4;

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
    // 幅の狭い画面では電車と数値表示を拡大する
    const narrow = p.width < NARROW_WIDTH;
    const k = narrow ? NARROW_SCALE : 1;
    drawScenery(p, groundY, vh, state.train.position);
    p.push();
    p.translate(TRAIN_X, groundY);
    p.scale(k);
    p.translate(-TRAIN_X, -groundY);
    drawTrain(p, groundY, state.train.position);
    drawAccelerationArrow(p, groundY, state.acceleration);
    p.pop();
    p.push();
    p.scale(k);
    drawInfoPanel(
      p,
      state.train.velocity,
      state.stepCount / FPS,
      state.acceleration
    );
    p.pop();

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
