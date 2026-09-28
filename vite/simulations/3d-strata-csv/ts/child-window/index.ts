// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import "../../../../css/tailwind.css";
import p5 from "p5";
import { elCreate, elInit } from "./init.js";
import { loadOpenerLayers } from "./element-function.js";
import { drawSimulation } from "./logic.js";

/**
 * 子ウィンドウのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  // html要素が全て読み込まれた後に、親ウィンドウから地層データを引き継ぐ
  window.addEventListener("load", () => {
    loadOpenerLayers(p);
  });

  /** DOM要素を扱うための最小サイズのキャンバスを生成し、DOM要素の初期設定を行う。 */
  p.setup = () => {
    p.createCanvas(0, 0);
    elCreate(p);
    elInit(p);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    drawSimulation(p);
  };
};

new p5(sketch);
