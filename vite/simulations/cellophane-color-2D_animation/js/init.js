// init.jsは初期処理専用のファイルです。

import { initModal } from "../../../js/bicpema-modal-controller.js";
import { state } from "./state.js";
import {
  onScreenshotClick,
  cellophaneAddButtonFunction,
  cellophaneRemoveButtonFunction,
} from "./element-function.js";

/**
 * DOM要素の生成
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.polarizerSelect = p.select("#polarizerSelect");
  state.cellophaneAddButton = p.select("#cellophaneAddButton");
  state.cellophaneRemoveButton = p.select("#cellophaneRemoveButton");
  state.opdInput = p.select("#opdInput");
}

/**
 * DOM要素の設定
 * @param {*} p p5インスタンス
 */
export function elInit(p) {
  state.cellophaneAddButton.mousePressed(() => cellophaneAddButtonFunction(p));
  state.cellophaneRemoveButton.mousePressed(() =>
    cellophaneRemoveButtonFunction(p)
  );
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#settingModal",
    closeSelectors: ".modal-close",
  });
}

/**
 * スクリーンショットボタンのUIを初期化する。
 */
export function uiInit() {
  document
    .getElementById("screenshotButton")
    .addEventListener("click", onScreenshotClick);
}

/**
 * 初期値やシミュレーションの設定
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  // テーブルからそれぞれのデータを取得
  state.cmfRowNum = state.cmfTable.getRowCount();
  state.waveLengthArr = state.cmfTable.getColumn("wave-length");
  state.waveLengthArr = state.waveLengthArr.map((str) => parseInt(str, 10));
  state.xLambda = state.cmfTable.getColumn("x(lambda)");
  state.yLambda = state.cmfTable.getColumn("y(lambda)");
  state.zLambda = state.cmfTable.getColumn("z(lambda)");
  state.osRowNum = state.osTable.getRowCount();
  state.osArr = state.osTable.getColumn("optical-strength");
  state.osArrOrigin = state.osTable.getColumn("optical-strength");
  state.dArr = state.dTable.getColumn("d");
  state.dRowNum = state.dTable.getRowCount();
  state.R_all = state.rTable.getColumn("optical-strength");

  // xyzを格納する配列の初期化
  for (let i = 0; i < state.osRowNum; i++) {
    state.xArrAfter.push(0);
    state.yArrAfter.push(0);
    state.zArrAfter.push(0);
    state.xArrBefore.push(0);
    state.yArrBefore.push(0);
    state.zArrBefore.push(0);
    state.Intensity_all_box.push(0);
    state.R_os.push(0);
  }

  state.colabNum = 0;
  state.precolabNum = state.colabNum;
  state.cellophaneNum = 0;

  //分割計算する際に必要な配列
  for (let n = 1; n <= 15; n++) {
    state.last_otherCellophaneNums[n - 1] = 1;
    state.last_targetAngles[n - 1] = 1;
    state.last_opt[n - 1] = 1;
  }
  state.last_polarizer = state.polarizerSelect.value();
  state.last_opt1 = state.opdInput.value();
  // クラスター分類の際のsetup
  p.colorMode(p.RGB, 255, 255, 255);
  state.copyimg = state.img2.get();
  state.clusterCount = 0;
  state.clusterCount1 = 0;
  state.Cluster1isDead = false;
  state.changeisDead = false;
  document.getElementById("mainSpectrumGraphParent").style.display = "block"; //On
  document.getElementById("mainSpectrumGraphParent0").style.display = "none"; //OFf
}
