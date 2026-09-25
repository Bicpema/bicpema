import p5 from "p5";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      state.img = await p.loadImage(
        "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fhalf-life%2FatomImage.png?alt=media&token=9583f019-b011-419b-a27e-8e769e435788"
      );
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
