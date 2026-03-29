import { state } from './state.js';
import { BicpemaCanvasController } from './bicpema-canvas-controller.js';

export const canvasController = new BicpemaCanvasController(false, false, 1.0, 1.0);

export function initSimulation(p) {
  canvasController.fullScreen(p);
  resetState();
}

export function resetState() {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
  state.Teq = (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) / (state.C_hot + state.C_cold);
}

export function windowResized(p) {
  canvasController.resizeScreen(p);
}
