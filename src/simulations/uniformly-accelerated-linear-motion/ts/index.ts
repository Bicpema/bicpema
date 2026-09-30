import p5 from "p5";
import { hideLoadingSpinner } from "../../../lib/simulation/bicpema-loading-spinner.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { V_W, FPS } from "./constants.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  /** フォントと車・地面の画像を読み込む。 */
  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.carImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FyellowCar.png?alt=media&token=1fb005bb-7540-4b23-8c1c-330973d4d243"
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
  };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  let isFirstDraw = true;

  /** 毎フレーム、車の状態を更新して描画し、表示中であればグラフを更新する。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.background(255);
    const { car, graph } = state;
    if (car) {
      car.update(1 / FPS);
    }
    p.scale(p.width / V_W);

    const vH = (V_W * p.height) / p.width;
    const showMarkers = state.showMarkersCheckBox?.checked();

    if (car) {
      car.display(p, vH, {
        carImage: state.carImage ?? undefined,
        groundImage: state.groundImage ?? undefined,
        showMarkers
      });
    }

    if (state.graphVisible && graph) {
      graph.updateGraph();
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
