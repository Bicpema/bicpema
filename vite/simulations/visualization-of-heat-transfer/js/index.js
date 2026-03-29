import p5 from 'p5';
import { initSimulation, windowResized } from './init.js';
import { drawSimulation } from './logic.js';

new p5((p) => {
  p.setup = () => {
    initSimulation(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    windowResized(p);
  };
});
