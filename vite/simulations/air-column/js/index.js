import p5 from 'p5';
import { BicpemaCanvasController } from './bicpema-canvas-controller.js';
import { state } from './state.js';
import { elementPositionInit, setupControls } from './init.js';
import { updateWaveLayer, drawWave, drawUIContext, drawFormula } from './logic.js';

const canvasController = new BicpemaCanvasController(false);

const sketch = (p) => {
  p.setup = () => {
    canvasController.fullScreen(p);
    elementPositionInit(p);
    setupControls(p);
  };

  p.draw = () => {
    p.background(255);
    p.image(state.waveLayer, 0, 0);
    drawUIContext(p);
    drawWave(p);
    drawFormula(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
