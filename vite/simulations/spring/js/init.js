// init.jsは初期処理専用のファイルです。

import { state, FPS } from "./state.js";
import { Spring } from "./class.js";
import { initCharts } from "./logic.js";
import { moveButtonAction, resetButtonAction } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";

/** ナビゲーションバーの高さ（px）。グラフDOM要素の位置決めに使用する。 */
const NAV_HEIGHT = 60;

/**
 * DOM要素の生成とイベントリスナーの設定を行う。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  p.select("#startButton").mousePressed(moveButtonAction);
  p.select("#stopButton").mousePressed(moveButtonAction);
  p.select("#resetButton").mousePressed(() => resetButtonAction(p));
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#settingModal",
    closeSelectors: ".modal-close",
  });

  state.konstantInput1 = p.select("#konstantButton1");
  state.combiInput1 = p.select("#combiButton1");
  state.weightInput1 = p.select("#weightButton1");
  state.amplitudeInput1 = p.select("#amplitudeButton1");
  state.konstantInput2 = p.select("#konstantButton2");
  state.combiInput2 = p.select("#combiButton2");
  state.weightInput2 = p.select("#weightButton2");
  state.amplitudeInput2 = p.select("#amplitudeButton2");

  state.graph1 = p.createElement("div");
  state.graph2 = p.createElement("div");
  state.graphCanvas1 = p.createElement("canvas");
  state.graphCanvas2 = p.createElement("canvas");
  state.graphCanvas1.parent(state.graph1);
  state.graphCanvas2.parent(state.graph2);
}

/**
 * canvasサイズに依存する画像サイズを再計算する（リサイズ時にも呼ぶため、シミュレーションの状態は変更しない）。
 * @param {*} p p5インスタンス
 */
export function resizeImages(p) {
  state.springImage.resize(p.width / 20, p.height / 4);
  state.ballImage.resize(p.height / 15, 0);
}

/**
 * グラフ用DOM要素のサイズ・位置を設定する。
 * @param {*} p p5インスタンス
 */
export function layoutGraphs(p) {
  state.graph1
    .size(p.width / 2, p.height / 2)
    .position(p.width / 2, NAV_HEIGHT);
  state.graphCanvas1.id("chart1");
  state.graph2
    .size(p.width / 2, p.height / 2)
    .position(p.width / 2, NAV_HEIGHT + p.height / 2);
  state.graphCanvas2.id("chart2");
}

/**
 * シミュレーションの初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  resizeImages(p);
  state.countData = [0];
  state.data1 = [];
  state.data2 = [];
  state.clickedCount = false;
  state.count = 0;
  p.frameRate(FPS);
  state.spring1 = new Spring(
    state.konstantInput1.value(),
    state.weightInput1.value(),
    state.combiInput1.value(),
    state.amplitudeInput1.value(),
    1
  );
  state.spring2 = new Spring(
    state.konstantInput2.value(),
    state.weightInput2.value(),
    state.combiInput2.value(),
    state.amplitudeInput2.value(),
    2
  );
  initCharts();
}
