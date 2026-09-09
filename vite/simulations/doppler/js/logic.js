// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";
import {
  FPS,
  W,
  H,
  ORIGIN_X,
  GRID_STEP,
  MAJOR_GRID_INTERVAL,
  MAJOR_GRID_STROKE_WEIGHT,
  MINOR_GRID_STROKE_WEIGHT
} from "./constants.js";
import { SOUND } from "./class.js";
import { computeSourcePosition } from "./physics.js";

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
  state.posx = computeSourcePosition(speedValue, state.count, FPS);

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
  for (let i = 0; i < W - ORIGIN_X; i += GRID_STEP) {
    if (i % MAJOR_GRID_INTERVAL === 0) {
      p.strokeWeight(MAJOR_GRID_STROKE_WEIGHT);
    } else {
      p.strokeWeight(MINOR_GRID_STROKE_WEIGHT);
    }
    p.line(i + ORIGIN_X, 0, i + ORIGIN_X, H);
  }
  for (let i = 0; i < H / 2; i += GRID_STEP) {
    if (i % MAJOR_GRID_INTERVAL === 0) {
      p.strokeWeight(MAJOR_GRID_STROKE_WEIGHT);
    } else {
      p.strokeWeight(MINOR_GRID_STROKE_WEIGHT);
    }
    p.line(ORIGIN_X, H / 2 + i, W, H / 2 + i);
    p.line(ORIGIN_X, H / 2 - i, W, H / 2 - i);
  }
  p.stroke(0);
}
