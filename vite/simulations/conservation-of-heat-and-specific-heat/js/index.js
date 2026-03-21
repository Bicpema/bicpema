// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from 'p5';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BicpemaCanvasController } from './bicpema-canvas-controller.js';
import { state } from './state.js';
import { initValue, elCreate } from './init.js';
import { drawSimulation } from './logic.js';

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false);

  p.preload = () => {
    state.boxImg = p.loadImage(
      'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/stirringVessel.png?alt=media&token=665a56ef-4ff2-487c-bc9d-3089b1609699'
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    p.frameRate(20);
    initValue(p);
    elCreate(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    initValue(p);
  };
};

new p5(sketch);
