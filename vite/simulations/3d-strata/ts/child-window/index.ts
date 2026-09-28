// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import "../../../../css/tailwind.css";
import p5 from "p5";
import { elCreate, elInit } from "./init.js";
import { loadOpenerLayers } from "./element-function.js";
import { drawSimulation } from "./logic.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  // html要素が全て読み込まれた後に、親ウィンドウから地層データを引き継ぐ
  window.addEventListener("load", () => {
    loadOpenerLayers(p);
  });

  /** 大きさ0のキャンバスを生成し、DOM要素の生成と初期設定を行う。 */
  p.setup = () => {
    p.createCanvas(0, 0);
    elCreate(p);
    elInit(p);
  };

  /** 毎フレーム、地層データの表示を更新する。 */
  p.draw = () => {
    drawSimulation(p);
  };
};

new p5(sketch);
