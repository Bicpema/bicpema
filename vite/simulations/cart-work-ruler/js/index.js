// index.jsはメインのメソッドを呼び出すためのファイルです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { elCreate, initValue } from "./init.js";
import { drawSimulation } from "./logic.js";
import { state } from "./state.js";

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.preload = () => {
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      z-index: 9999;
      font-size: 24px;
      font-family: sans-serif;
    `;

    const spinner = document.createElement("div");
    spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    const loadingText = document.createElement("div");
    loadingText.textContent = "読み込み中です...";

    loadingDiv.appendChild(spinner);
    loadingDiv.appendChild(loadingText);
    document.body.appendChild(loadingDiv);

    state.font = p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
    );
    state.bookImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/book2.png?alt=media&token=5a1cd40b-af41-424e-90a3-7372fe30957b"
    );
    state.cartImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/realTrolley.png?alt=media&token=dd68620c-22aa-43e7-9963-dc953989662e"
    );
    state.groundImage = p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810"
    );
  };

  p.setup = () => {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) loadingDiv.remove();

    canvasController.fullScreen(p);
    elCreate(p);
    initValue(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
  };
};

new p5(sketch);
