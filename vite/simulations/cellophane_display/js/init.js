// init.jsは初期処理専用のファイルです。

import { initModal } from "../../../js/bicpema-modal-controller.js";
import { state } from "./state.js";
import {
  cellophaneAddButtonFunction,
  cellophaneRemoveButtonFunction,
  onScreenshotClick,
} from "./element-function.js";
import { beforeColorCalculate } from "./logic.js";

/**
 * DOM要素の参照を取得する。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.polarizerSelect = p.select("#polarizerSelect");
  state.cellophaneAddButton = p.select("#cellophaneAddButton");
  state.cellophaneRemoveButton = p.select("#cellophaneRemoveButton");
  state.opdInput = p.select("#opdInput");
}

/**
 * DOM要素にイベントを設定する。
 * @param {*} p p5インスタンス
 */
export function elInit(p) {
  state.cellophaneAddButton.mousePressed(() => cellophaneAddButtonFunction(p));
  state.cellophaneRemoveButton.mousePressed(() =>
    cellophaneRemoveButtonFunction(p)
  );
  // resizeSimulation()からも呼ばれるため、addEventListenerでの多重登録を避け
  // 上書き型のonclickでハンドラを設定する
  document.getElementById("screenshotButton").onclick = onScreenshotClick;
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#settingModal",
    closeSelectors: ".modal-close",
  });
}

/**
 * 初期値やシミュレーションの設定を行う。
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

  // xyzを格納する配列の初期化(windowResized経由での再呼び出し時に配列が
  // 肥大化しないよう、pushする前に空にリセットする)
  state.xArrAfter.length = 0;
  state.yArrAfter.length = 0;
  state.zArrAfter.length = 0;
  state.xArrBefore.length = 0;
  state.yArrBefore.length = 0;
  state.zArrBefore.length = 0;
  state.R_os.length = 0;
  for (let i = 0; i < state.osRowNum; i++) {
    state.xArrAfter.push(0);
    state.yArrAfter.push(0);
    state.zArrAfter.push(0);
    state.xArrBefore.push(0);
    state.yArrBefore.push(0);
    state.zArrBefore.push(0);
    state.R_os.push(0);
  }

  state.colabNum = 0;
  state.precolabNum = state.colabNum;
  state.cellophaneNum = 0;

  // 分割計算する際に必要な配列
  for (let n = 1; n <= 15; n++) {
    state.last_otherCellophaneNums[n - 1] = 1;
    state.last_targetAngles[n - 1] = 1;
  }
  state.last_polarizer = state.polarizerSelect.value();
  state.last_opt1 = state.opdInput.value();
  p.colorMode(p.RGB, 255, 255, 255);
}

/**
 * 白画像を定位置に配置し, pixelsの色を初期値にする処理。入力画像のサイズを設定する処理。
 */
export function createStartimg() {
  state.img.resize(200, 200);
  state.centerX = 100;
  state.centerY = 100;
  state.img.loadPixels();
  for (let i = 0; i < state.img.pixels.length; i += 4) {
    state.img.pixels[i] = 200;
    state.img.pixels[i + 1] = 200;
    state.img.pixels[i + 2] = 200;
    state.img.pixels[i + 3] = 255;
  }
  state.img.updatePixels();
}

/**
 * スライダーやラジオボタンを作成する処理。
 * @param {*} p p5インスタンス
 */
export function createSliderandRadio(p) {
  state.slider = p.createSlider(10, 400, 75); // テープの幅を決定するslider
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
}

/**
 * シミュレーションの初回セットアップを行う。
 * @param {*} p p5インスタンス
 */
export function setupSimulation(p) {
  elCreate(p);
  elInit(p);
  initValue(p);
  p.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  createStartimg();
  createSliderandRadio(p);
  beforeColorCalculate(p).catch((error) => {
    console.error("色計算の初期化に失敗しました。", error);
  });
}

/**
 * windowResized時の再初期化を行う。
 * セロハンの組を全て削除した上で初期値を設定し直す。
 * @param {*} p p5インスタンス
 */
export function resizeSimulation(p) {
  elInit(p);
  // cellophaneRemoveButtonFunctionは呼ぶたびにstate.colabNum(組数)を1減らす。
  // state.cellophaneNum(総枚数)は更新されないため、colabNumを基準に
  // 組の数だけ削除する
  while (state.colabNum > 0) {
    cellophaneRemoveButtonFunction(p);
  }
  initValue(p);
  p.camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  beforeColorCalculate(p).catch((error) => {
    console.error("色計算の再初期化に失敗しました。", error);
  });
}
