import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { state } from "./state.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { V_W, FPS } from "./constants.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.carImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FyCar.png?alt=media&token=fa3ee043-5471-41d7-bb7f-93ac1eca46f1"
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    p.background(30);
    state.car.update(1 / FPS);
    p.scale(p.width / V_W);

    const vH = (V_W * p.height) / p.width;
    const showMarkers =
      state.showMarkersCheckBox && state.showMarkersCheckBox.checked();

    state.car.display(p, vH, {
      carImage: state.carImage,
      groundImage: state.groundImage,
      showMarkers: showMarkers,
    });

    if (state.car.isMoving && state.graphVisible) {
      state.graph.updateGraph();
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
