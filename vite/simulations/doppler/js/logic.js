// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";
import { FPS, W, H } from "./init.js";
import { SOUND } from "./class.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.scale(p.width / 1000);
  p.background(255);
  drawBackground(p);

  if (state.clickedCount === true) {
    state.count++;
  }

  if (state.count % (FPS / 10) === 0 && state.clickedCount === true) {
    state.sounds.push(new SOUND(state.posx, 0));
  }

  for (let i = 0; i < state.sounds.length; i++) {
    state.sounds[i]._draw(p);
  }

  const speedValue = state.speedValue;
  state.posx = (speedValue * state.count) / FPS + 50;

  p.fill(0);
  p.stroke(0);
  p.strokeWeight(1);
  p.ellipse(state.posx, state.posy, 20, 20);
  p.textSize(20);
  p.text(speedValue + " m/s", state.posx, state.posy + 20);
}

/**
 * 背景グリッドを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawBackground(p) {
  p.stroke(0, 100);
  for (let i = 0; i < W - 50; i += 10) {
    if (i % 100 === 0) {
      p.strokeWeight(2);
    } else {
      p.strokeWeight(1);
    }
    p.line(i + 50, 0, i + 50, H);
  }
  for (let i = 0; i < H / 2; i += 10) {
    if (i % 100 === 0) {
      p.strokeWeight(2);
    } else {
      p.strokeWeight(1);
    }
    p.line(50, H / 2 + i, W, H / 2 + i);
    p.line(50, H / 2 - i, W, H / 2 - i);
  }
  p.stroke(0);
}
