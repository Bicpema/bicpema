// index.js - メインのメソッドを呼び出すためのファイルです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";
import {
  V_W,
  drawSlope,
  drawCartOnSlope,
  drawRecordingTape,
  drawInfoPanel,
} from "./function.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.cartImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/simpleTrolley.png?alt=media&token=f614f2c8-188e-4d34-807c-d48ffd21d95c",
      () => {},
      (err) => {
        console.warn("cart image load failed", err);
      }
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810",
      () => {},
      (err) => {
        console.warn("ground image load failed", err);
      }
    );
  };

  p.setup = () => {
    settingInit(p, canvasController);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit();
  };

  p.draw = () => {
    p.scale(p.width / V_W);
    p.background(255);

    if (state.isPlaying) {
      state.cart.update(1 / FPS);

      while (
        (state.tapeMarks.length + 1) * state.recInterval <=
        state.cart.time
      ) {
        const t = (state.tapeMarks.length + 1) * state.recInterval;
        const s = 0.5 * state.cart.accel * t * t;
        if (s > state.cart.slopeLengthM) break;
        state.tapeMarks.push(s);
      }

      if (state.cart.isAtBottom) {
        state.isPlaying = false;
        state.playPauseButton.html("▶ 開始");
      }
    }

    drawSlope(p, state.slopeDeg);
    drawCartOnSlope(p, state.cart, state.slopeDeg);
    drawRecordingTape(p, state.tapeMarks, state.recInterval);
    drawInfoPanel(p, state.cart);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
