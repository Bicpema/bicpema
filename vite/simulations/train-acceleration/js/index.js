import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  FPS,
  V_W,
  PX_PER_METER,
  settingInit,
  elCreate,
  initValue,
} from "./init.js";
import { drawTrack, drawTrain, drawInfoPanel } from "./function.js";
import { initChart, updateChart } from "./graph.js";
import {
  GRAPH_UPDATE_INTERVAL,
  GROUND_Y_RATIO,
  GROUND_FILL_Y_OFFSET,
} from "./constants.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0, {
    heightMode: "half",
  });

  p.setup = () => {
    settingInit(p, canvasController);
    elCreate(p);
    initValue(p);
    initChart();
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / V_W);

    /** 仮想キャンバス高さ */
    const VH = V_W * (p.height / p.width);
    /** 地面y座標（仮想ピクセル） */
    const GROUND_Y = VH * GROUND_Y_RATIO;

    if (state.isPlaying) {
      const dt = 1 / FPS;
      state.elapsedTime += dt;
      state.train.update(dt, state.acceleration, PX_PER_METER, V_W);

      // グラフデータを一定間隔で追記
      state.lastGraphUpdate += dt;
      if (state.lastGraphUpdate >= GRAPH_UPDATE_INTERVAL) {
        state.lastGraphUpdate = 0;
        const v = parseFloat(state.train.velocity.toFixed(3));
        if (v > state.maxObservedVelocity) state.maxObservedVelocity = v;
        state.vtData.push({
          x: parseFloat(state.elapsedTime.toFixed(2)),
          y: v,
        });
        updateChart();
      }
    }

    // 空背景
    p.background(135, 206, 235);

    // 地面
    p.fill(80, 130, 60);
    p.noStroke();
    p.rect(
      0,
      GROUND_Y + GROUND_FILL_Y_OFFSET,
      V_W,
      VH - GROUND_Y - GROUND_FILL_Y_OFFSET
    );

    // 線路
    drawTrack(p, GROUND_Y, state.train.trackOffset, V_W);

    // 電車
    drawTrain(p, state.train.x, GROUND_Y);

    // 情報パネル
    drawInfoPanel(
      p,
      state.train.velocity,
      state.elapsedTime,
      state.acceleration
    );
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
