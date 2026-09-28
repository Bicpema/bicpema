import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { initSimulation, windowResized } from "./init.js";
import { drawSimulation } from "./logic.js";

new p5((p) => {
  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    initSimulation(p);
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    windowResized(p);
  };
});
