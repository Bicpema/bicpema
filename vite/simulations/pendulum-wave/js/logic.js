// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";
import { FPS } from "./init.js";

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);

  for (let i = 0; i < state.balls.length; i++) {
    state.balls[i].move(p);
    state.balls[i].display(p);
  }

  state.count++;
  p.text(p.nf(state.count / FPS, 1, 2) + "s", 100, 100);
}
