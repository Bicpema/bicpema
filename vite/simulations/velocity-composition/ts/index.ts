import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawScene, drawInfoPanel } from "./logic.js";
import { FPS, V_W } from "./constants.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  let isFirstDraw = true;

  /** 毎フレーム、水の粒子・船・人を更新して描画し、情報パネルを表示する。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / V_W);
    drawScene(p);

    if (!state.boat || !state.person) return;

    const dt = 1 / FPS;

    for (const particle of state.waterParticles) {
      particle.update(dt);
      particle.draw(p);
    }

    state.boat.update(dt);
    state.boat.draw(p);

    state.person.draw(p);

    drawInfoPanel(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスサイズを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
