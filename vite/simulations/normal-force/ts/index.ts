// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import {
  fullScreen,
  resizeScreen,
  buttonCreation,
  materialSet,
  buttonSettings,
  buttonEvents,
  initSettings,
  updateLayout
} from "./init.js";
import {
  sortButtonAction1,
  sortButtonAction2,
  sortButtonAction3,
  onStartClick,
  onStopClick,
  resetButtonAction
} from "./element-function.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  let isFirstDraw = true;

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    fullScreen(p);
    buttonCreation(p, {
      sortButtonAction1,
      sortButtonAction2,
      sortButtonAction3
    });
    initSettings(p);
    materialSet(p);
    buttonSettings(p);
    buttonEvents(p, { onStartClick, onStopClick, resetButtonAction });
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとボタンの配置を再設定する。 */
  p.windowResized = () => {
    resizeScreen(p);
    updateLayout(p);
    buttonSettings(p);
  };
};

new p5(sketch);
