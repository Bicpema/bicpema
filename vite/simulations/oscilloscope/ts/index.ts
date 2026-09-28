import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { initModal } from "../../../ts/bicpema-modal-controller.js";
import {
  elementPositionInit,
  elementSelectInit,
  settingInit,
  setupControls,
  valueInit
} from "./init.js";
import { drawOscilloscope, updateAudioData } from "./logic.js";

const canvasController = new BicpemaCanvasController();

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  let elements: ReturnType<typeof elementSelectInit>;

  /** キャンバスを生成し、初期設定・操作パネル・設定モーダルを準備する。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elements = elementSelectInit();
    elementPositionInit();
    valueInit();
    setupControls(p, elements);
    initModal({
      openSelectors: ".settings-modal-open",
      modalSelector: "#simulationSettingModal",
      closeSelectors: ".modal-close"
    });
  };

  let isFirstDraw = true;

  /** 毎フレーム、音声データを更新してオシロスコープの波形を描画する。 */
  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    updateAudioData();
    drawOscilloscope(p);
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit();
  };
};

/**
 * p5.soundを読み込んだうえでシミュレーションを開始する。
 */
async function startSimulation() {
  window.p5 = p5;
  await import("p5/lib/addons/p5.sound.js");
  new p5(sketch);
}

startSimulation();
