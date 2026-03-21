import { state } from "./state.js";

/**
 * シミュレーションの描画を行う関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  let max_time = 60 * Math.floor(p.width / 60);
  if (state.moveIs) {
    for (let speed = 0; speed < state.speedInput.value(); speed++) {
      for (let i = 0; i < state.waveArr.length; i++) {
        state.waveArr[i]._draw();
      }
    }
  }

  p.stroke(68, 122, 191);
  p.strokeWeight(5);
  p.noFill();
  p.beginShape();
  for (let i = 60; i < max_time; i++) {
    let y = 0;
    for (let j = 0; j < state.waveArr.length; j++) {
      y += state.waveArr[j].arr[i - 60];
    }
    p.vertex(i, y + p.height / 2);
  }
  p.endShape();
}
