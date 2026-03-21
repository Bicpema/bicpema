import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import $ from "jquery";
import html2canvas from "html2canvas";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { state } from "./state.js";
import {
  submit,
  loadLayers,
  placeRefreshFunction,
  firstPlaceSelectFunction,
  secondPlaceSelectFunction,
  thirdPlaceSelectFunction,
} from "./element-function.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(false, true, 1.0, 1.0);

  p.preload = () => {
    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
  };

  p.setup = () => {
    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
    p.camera(800, -500, 800, 0, 0, 0, 0, 1, 0);

    // スクリーンショットボタンの設定
    document.getElementById("screenshotButton")?.addEventListener("click", () => {
      html2canvas(document.body).then((canvas) => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL();
        a.download = "screenshot.png";
        a.click();
      });
    });

    // 子ウィンドウから呼び出せるようにwindowへ公開
    window.submit = (arr) => submit(arr);
    window.loadLayers = (placeName) => loadLayers(placeName);
    window.placeRefreshFunction = () => placeRefreshFunction(p);
    window.firstPlaceSelectFunction = () => firstPlaceSelectFunction(p);
    window.secondPlaceSelectFunction = () => secondPlaceSelectFunction(p);
    window.thirdPlaceSelectFunction = () => thirdPlaceSelectFunction(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);

