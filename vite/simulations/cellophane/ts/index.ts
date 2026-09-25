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

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false,
    is3D: true,
    panelSelector: "#p5Canvas"
  });

  p.setup = async () => {
    try {
      [
        state.spectrumSheet,
        state.rgbSheet,
        state.cmfSheet,
        state.lightSourceSpectrumSheet
      ] = await Promise.all([
        // p5.jsの型定義上、loadTable()の戻り値は`object`型となっているため、
        // 実際の戻り値であるp5.Tableへ明示的にキャストする。
        p.loadTable(
          "https://dl.dropboxusercontent.com/s/vqd8bojsw5z5zxz/spectrumSheet.csv"
        ) as Promise<p5.Table>,
        p.loadTable(
          "https://dl.dropboxusercontent.com/s/a2o8jwq7b7234ul/rgbSheet.csv"
        ) as Promise<p5.Table>,
        p.loadTable(
          "https://dl.dropboxusercontent.com/s/t00y963w7hitfho/cmfSheet.csv"
        ) as Promise<p5.Table>,
        p.loadTable(
          "https://dl.dropboxusercontent.com/s/bsoxh313yvv6wuv/lightSourceSpectrumSheet.csv"
        ) as Promise<p5.Table>
      ]);
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
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

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
