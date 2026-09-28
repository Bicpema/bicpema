// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import "../../../css/tailwind.css";
import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import {
  elCreate,
  elInit,
  uiInit,
  initValue,
  loadJapaneseFont
} from "./init.js";
import { drawSimulation } from "./logic.js";
import {
  loadTestDataButtonFunction,
  submit,
  loadLayers,
  placeRefreshFunction,
  firstPlaceSelectFunction,
  secondPlaceSelectFunction,
  thirdPlaceSelectFunction
} from "./element-function.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController({
    fixedAspectRatio: false,
    is3D: true
  });

  // 子ウィンドウ（childWindow.html）からwindow.opener経由で呼び出されるための公開。
  // 別ドキュメントのため、ESモジュールのimport/exportでは参照できない。
  window.submit = submit;
  window.loadLayers = loadLayers;
  /** 子ウィンドウから呼び出され、地点の選択状態を更新する。 */
  window.placeRefreshFunction = () => placeRefreshFunction(p);
  /** 子ウィンドウから呼び出され、1つ目の地点の選択を反映する。 */
  window.firstPlaceSelectFunction = () => firstPlaceSelectFunction(p);
  /** 子ウィンドウから呼び出され、2つ目の地点の選択を反映する。 */
  window.secondPlaceSelectFunction = () => secondPlaceSelectFunction(p);
  /** 子ウィンドウから呼び出され、3つ目の地点の選択を反映する。 */
  window.thirdPlaceSelectFunction = () => thirdPlaceSelectFunction(p);

  /** キャンバスを生成し、DOM要素・初期値・テストデータ読み込みボタンを設定して日本語フォントを読み込む。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    elInit(p);
    initValue(p);
    loadTestDataButtonFunction(p);
    uiInit();
    loadJapaneseFont(p);
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置・初期値を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elInit(p);
    initValue(p);
  };
};

new p5(sketch);
