import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initSimulation, windowResized } from "./init.js";
import { drawSimulation } from "./logic.js";

new p5((p) => {
  p.setup = () => {
    initSimulation(p);
  };

  p.draw = () => {
    p.scale(p.width / 1000);
    drawSimulation(p);
  };

  p.windowResized = () => {
    windowResized(p);
  };
});
