import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import { initSimulation, windowResized } from "./init.js";
import { drawSimulation } from "./logic.js";

new p5((p) => {
  p.setup = () => {
    initSimulation(p);
  };

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

    p.scale(p.width / 1000);
    drawSimulation(p);
  };

  p.windowResized = () => {
    windowResized(p);
  };
});
