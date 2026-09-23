// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import "../../../../css/tailwind.css";
import p5 from "p5";
import { elCreate, elInit } from "./init.js";
import { loadOpenerLayers } from "./element-function.js";
import { drawSimulation } from "./logic.js";

const sketch = (p) => {
  // html要素が全て読み込まれた後に、親ウィンドウから地層データを引き継ぐ
  window.addEventListener("load", () => {
    loadOpenerLayers(p);
  });

  p.setup = () => {
    p.createCanvas(0, 0);
    elCreate(p);
    elInit(p);
  };

  p.draw = () => {
    drawSimulation(p);
  };
};

new p5(sketch);
