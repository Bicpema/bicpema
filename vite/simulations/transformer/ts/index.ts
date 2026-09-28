import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { elCreate, initValue, FPS } from "./init.js";
import { drawSimulation } from "./logic.js";

/** 仮想キャンバス幅。p.scale() でこの幅に合わせてスケーリングする。 */
const V_W = 1000;

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  // 16:9 固定比率でキャンバスサイズを計算（設定UIはモーダル表示のため高さは考慮不要）
  const canvasController = new BicpemaCanvasController();

  /** 変圧器のコアとコイルの画像を読み込む。 */
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

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    p.angleMode(p.DEGREES); // 角度を度数法で扱う
    elCreate(p); // UIボタンのイベントリスナー登録
    initValue(); // stateの初期値設定
    p.frameRate(FPS); // フレームレート設定
    p.loop();
  };

  let isFirstDraw = true;

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    // 仮想座標系 (V_W × V_W*9/16) に合わせてスケーリング
    p.scale(p.width / V_W);
    drawSimulation(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスを再設定する。 */
  p.windowResized = () => {
    // ウィンドウリサイズ時にキャンバスを再計算
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
