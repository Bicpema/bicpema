// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { RAYS_PER_COLOR } from "./constants.js";
import { elCreate, uiInit, initValue } from "./init.js";
import { csvDataLoad, updateColorSwatches } from "./element-function.js";
import { initGraph, initCmfGraph } from "./graph.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false,
    is3D: true,
    panelSelector: "#p5Canvas"
  });

  /** スペクトル・RGB・等色関数・光源スペクトルのCSVを読み込む。 */
  p.preload = () => {
    // p5.jsの型定義上、loadTable()の戻り値は`object`型となっているため、
    // 実際の戻り値であるp5.Tableへ明示的にキャストする。
    state.spectrumSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/vqd8bojsw5z5zxz/spectrumSheet.csv"
    ) as p5.Table;
    state.rgbSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/a2o8jwq7b7234ul/rgbSheet.csv"
    ) as p5.Table;
    state.cmfSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/t00y963w7hitfho/cmfSheet.csv"
    ) as p5.Table;
    state.lightSourceSpectrumSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/bsoxh313yvv6wuv/lightSourceSpectrumSheet.csv"
    ) as p5.Table;
  };

  /** キャンバスを生成し、初期設定・CSVデータの反映・グラフの初期化を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    csvDataLoad();
    updateColorSwatches();
    initGraph();
    initCmfGraph();
    uiInit();
  };

  let isFirstDraw = true;

  /** 毎フレーム、光線とシミュレーションの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.orbitControl(10, 10, 10);
    p.background(100);
    for (let i = 0; i < RAYS_PER_COLOR; i++) {
      state.rRays[i]._draw(p);
      state.gRays[i]._draw(p);
      state.bRays[i]._draw(p);
    }
    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
