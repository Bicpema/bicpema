import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, FPS } from "./init.js";
import { drawSimulation } from "./logic.js";

/** 仮想キャンバス幅。p.scale() でこの幅に合わせてスケーリングする。 */
const V_W = 1000;

const sketch = (p) => {
  // 16:9 固定比率、下部設定パネルの高さを考慮してキャンバスサイズを計算
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0, {
    bottomBarSelector: "#settingsPanel",
  });

  p.preload = () => {
    // 変圧器コア・コイル画像を事前ロード
    state.img1 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2FTransformer.png?alt=media&token=70310a44-504b-4e40-8180-c0806ca6a925"
    );
    state.img2 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil1.png?alt=media&token=c72113f3-d995-496a-bc88-5b80653b68bd"
    );
    state.img3 = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil2.png?alt=media&token=23ef07d6-1a31-4a06-9b3b-aae6f433866a"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    p.angleMode(p.DEGREES); // 角度を度数法で扱う
    elCreate(p); // UIボタンのイベントリスナー登録
    initValue(); // stateの初期値設定
    p.frameRate(FPS); // フレームレート設定
    p.loop();
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    // 仮想座標系 (V_W × V_W*9/16) に合わせてスケーリング
    p.scale(p.width / V_W);
    drawSimulation(p);
  };

  p.windowResized = () => {
    // ウィンドウリサイズ時にキャンバスを再計算
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
