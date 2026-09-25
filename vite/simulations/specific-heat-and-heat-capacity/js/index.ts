import p5 from "p5";
import { loadFontFromUrl } from "../../../js/bicpema-font.js";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import { settingInit, elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";

const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();

  p.setup = async () => {
    try {
      [state.burnerImg, state.font] = await Promise.all([
        p.loadImage(
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/gasBurner.png?alt=media&token=20f7ca3b-dc1d-4459-8bd9-01bd6b5d3b94"
        ),
        loadFontFromUrl(
          p,
          "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
        )
      ]);
    } catch {
      // 読み込み失敗時もシミュレーション自体は起動できるようにする
    }
    settingInit(p, canvasController);
    elCreate(p);
    initValue(p);
    if (state.font) p.textFont(state.font);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
