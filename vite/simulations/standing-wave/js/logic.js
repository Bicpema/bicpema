// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(211, 237, 244);

  p.push();
  p.translate(state.margin, state.margin);

  drawGrid(p);
  drawXAxis(p);
  drawRightWave(p);
  drawLeftWave(p);
  drawStandingWave(p);

  p.pop();

  if (state.running) {
    state.t += state.v;
    state.rightFront = p.min(state.v * state.t, state.innerW);
    state.leftFront = p.max(state.innerW - state.v * state.t, 0);
  }
}

/**
 * グリッドを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawGrid(p) {
  p.stroke(200);
  p.strokeWeight(1);

  const yCenter = state.innerH / 2;
  const gridUnitY = state.wavelength / 8;

  for (let y = yCenter; y <= state.innerH; y += gridUnitY) {
    p.line(0, y, state.innerW, y);
  }
  for (let y = yCenter; y >= 0; y -= gridUnitY) {
    p.line(0, y, state.innerW, y);
  }

  const xCenter = state.innerW / 2;
  const gridUnitX = state.wavelength / 8;

  for (let x = xCenter; x <= state.innerW; x += gridUnitX) {
    p.line(x, 0, x, state.innerH);
  }
  for (let x = xCenter; x >= 0; x -= gridUnitX) {
    p.line(x, 0, x, state.innerH);
  }
}

/**
 * x 軸と矢印・ラベルを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawXAxis(p) {
  const yAxis = state.innerH / 2;

  p.stroke(0);
  p.strokeWeight(2);
  p.line(0, yAxis, state.innerW - 1, yAxis);

  p.strokeWeight(1);
  p.fill(0);
  p.triangle(
    state.innerW - 10, yAxis - 5,
    state.innerW - 10, yAxis + 5,
    state.innerW, yAxis
  );

  p.noStroke();
  p.fill(0);
  p.textSize(14);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text("x", state.innerW - 5, yAxis + 20);
}

/**
 * 右向き進行波（赤）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawRightWave(p) {
  p.stroke(255, 0, 0);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x < state.rightFront) {
      const y = state.A * p.sin(state.k * x - state.omega * state.t);
      p.vertex(x, state.innerH / 2 + y);
    }
  }
  p.endShape();
}

/**
 * 左向き進行波（青）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawLeftWave(p) {
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x > state.leftFront) {
      const y = state.A * p.sin(state.k * x + state.omega * state.t);
      p.vertex(x, state.innerH / 2 + y);
    }
  }
  p.endShape();
}

/**
 * 合成波（定常波・緑）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawStandingWave(p) {
  p.stroke(0, 180, 0);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x <= state.rightFront && x >= state.leftFront) {
      const y1 = state.A * p.sin(state.k * x - state.omega * state.t);
      const y2 = state.A * p.sin(state.k * (state.innerW - x) - state.omega * state.t);
      p.vertex(x, state.innerH / 2 + y1 + y2);
    }
  }
  p.endShape();
}
