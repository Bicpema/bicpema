import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import {
  elementPositionInit,
  elementSelectInit,
  settingInit,
  setupControls,
  valueInit
} from "./init.js";
import { drawOscilloscope, updateAudioData } from "./logic.js";

const canvasController = new BicpemaCanvasController();

const sketch = (p: p5) => {
  let elements: ReturnType<typeof elementSelectInit>;

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

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    updateAudioData();
    drawOscilloscope(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit();
  };
};

async function startSimulation() {
  // p5.sound(v2)はグローバルスコープのp5を参照して自身を登録するUMD形式のため、
  // import前にwindow.p5へ明示的に代入する必要がある。
  (window as unknown as { p5: typeof p5 }).p5 = p5;
  await import("p5.sound");
  new p5(sketch);
}

startSimulation();
