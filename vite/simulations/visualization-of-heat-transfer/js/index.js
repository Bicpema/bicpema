import p5 from "p5";
import "../../../css/tailwind.css";
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
