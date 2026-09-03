// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";

/**
 * 3分割された画面の枠線とグリッド線を描画する。
 * @param {*} p p5インスタンス
 */
function drawBackground(p) {
  for (let i = 0; i < 3; i++) {
    p.stroke(0, 100);
    if (state.gridIs) {
      for (let f = -p.width / 6; f < p.width / 6; f += 10) {
        p.strokeWeight(f % 50 === 0 ? 3 : 1);
        p.line(
          f + (p.width / 3) * i + p.width / 6,
          0,
          f + (p.width / 3) * i + p.width / 6,
          p.height
        );
      }
      for (let f = 0; f < p.height; f += 10) {
        p.strokeWeight(f % 50 === 0 ? 3 : 1);
        p.line((p.width / 3) * i, f, (p.width / 3) * i + p.width / 3, f);
      }
    }
    p.noFill();
    p.stroke(0);
    p.strokeWeight(5);
    p.rect((p.width / 3) * i, 0, p.width / 3, p.height);
  }
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);
  if (state.clickedCount) state.count += 1;
  drawBackground(p);

  state.leftPendulum.calculate(p, 0);
  state.rightPendulum.calculate(p, p.width / 3);
  state.leftPendulum.display(p, 0);
  state.rightPendulum.display(p, p.width / 3);

  state.leftPendulum.calculate(p, (2 * p.width) / 3);
  state.rightPendulum.calculate(p, (2 * p.width) / 3);
  p.tint(255, 150);
  p.stroke(0, 150);
  state.leftPendulum.display(p, (2 * p.width) / 3);
  state.rightPendulum.display(p, (2 * p.width) / 3);
  p.tint(255);
}
