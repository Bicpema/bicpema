import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state } from "./state.js";
import { FPS, V_W, PX_PER_METER, settingInit, elCreate, initValue } from "./init.js";
import { drawTrack, drawTrain, drawInfoPanel } from "./function.js";
import { initChart, updateChart } from "./graph.js";

const GRAPH_UPDATE_INTERVAL = 0.1;

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    settingInit(p, canvasController);
    elCreate(p);
    initValue(p);
    initChart();
  };

  p.draw = () => {
    p.scale(p.width / V_W);

    /** 仮想キャンバス高さ */
    const VH = V_W * (p.height / p.width);
    /** 地面y座標（仮想ピクセル） */
    const GROUND_Y = VH * 0.72;

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
    p.rect(0, GROUND_Y + 28, V_W, VH - GROUND_Y - 28);

    // 線路
    drawTrack(p, GROUND_Y, state.train.trackOffset, V_W);

    // 電車
    drawTrain(p, state.train.x, GROUND_Y);

    // 情報パネル
    drawInfoPanel(p, state.train.velocity, state.elapsedTime, state.acceleration);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);

