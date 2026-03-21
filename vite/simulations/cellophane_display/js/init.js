// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import {
  cellophaneAddButtonFunction,
  cellophaneRemoveButtonFunction,
  setupScreenshot,
} from "./element-function.js";

/**
 * UI要素の生成とイベントリスナーの設定を担当する関数。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.polarizerSelect = p.select("#polarizerSelect");
  state.cellophaneAddButton = p.select("#cellophaneAddButton");
  state.cellophaneRemoveButton = p.select("#cellophaneRemoveButton");
  state.opdInput = p.select("#opdInput");

  state.cellophaneAddButton.mousePressed(() => cellophaneAddButtonFunction(p));
  state.cellophaneRemoveButton.mousePressed(() =>
    cellophaneRemoveButtonFunction(p)
  );

  // スライダーとラジオボタンの生成
  state.slider = p.createSlider(10, 400, 75);
  state.slider.position(50, 100);
  state.lastSlider = state.slider.value();

  state.lineradio = p.createRadio();
  state.lineradio.option("補助線あり");
  state.lineradio.option("補助線なし");
  state.lineradio.selected("補助線なし");
  state.lineradio.position(400, 130);

  state.optRadio = p.createRadio();
  state.optRadio.option("セロハンテープ");
  state.optRadio.option("OPPフィルム");
  state.optRadio.position(400, 100);
  state.optRadio.selected("セロハンテープ");
  state.preValue = state.optRadio.value();

  setupScreenshot();
}

/**
 * パラメータと状態を初期化する
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
  state.xArrAfter = Array(state.osRowNum).fill(0);
  state.yArrAfter = Array(state.osRowNum).fill(0);
  state.zArrAfter = Array(state.osRowNum).fill(0);
  state.xArrBefore = Array(state.osRowNum).fill(0);
  state.yArrBefore = Array(state.osRowNum).fill(0);
  state.zArrBefore = Array(state.osRowNum).fill(0);
  state.Intensity_all_box = Array(state.osRowNum).fill(0);
  state.R_os = Array(state.osRowNum).fill(0);
  state.speyBox = Array(state.osRowNum).fill(0);

  state.colabNum = 0;
  state.precolabNum = state.colabNum;
  state.cellophaneNum = 0;

  for (let n = 1; n <= 15; n++) {
    state.last_otherCellophaneNums[n - 1] = 1;
    state.last_targetAngles[n - 1] = 1;
    state.last_opt[n - 1] = 1;
  }
  state.last_polarizer = state.polarizerSelect.value();
  state.last_opt1 = state.opdInput.value();

  p.colorMode(p.RGB, 255, 255, 255);
  state.copyimg = state.img2.get();
  state.clusterCount = 0;
  state.clusterCount1 = 0;
  state.Cluster1isDead = false;
  state.changeisDead = false;
}
