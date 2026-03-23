// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state, A, OMEGA, X_START } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.frameRate(state.timesSlider.value());
  p.background(255);

  if (state.running) state.t += 1;

  drawLongitudinal(p);
  drawConvertedTransverse(p);
}

/**
 * 粒子の変位を計算する。
 * @param {number} x0 - 粒子の平衡位置。
 * @param {*} p - p5 インスタンス。
 * @returns {number} 変位量。
 */
function displacement(x0, p) {
  const v = OMEGA / state.k;
  const arrivalTime = (x0 - X_START) / v;
  if (state.t <= arrivalTime) return 0;
  return -A * p.sin(state.k * (x0 - X_START) - OMEGA * state.t);
}

/**
 * 縦波を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawLongitudinal(p) {
  p.push();
  p.translate(0, p.height / 3);

  drawAxis(p, "縦波");

  for (const particle of state.particles) {
    const dx = displacement(particle.x0, p);
    const x = particle.x0 + dx;
    p.stroke(180);
    p.line(x, -50, x, 50);
    p.fill(255, 0, 0);
    p.noStroke();
    p.circle(x, 0, 5);
  }

  const focused = state.particles[state.focusIndex];
  const dx = displacement(focused.x0, p);
  const xNow = focused.x0 + dx;

  p.fill(0, 100, 255);
  p.circle(focused.x0, 0, 8);

  p.fill(255, 0, 0);
  p.circle(xNow, 0, 8);

  const v = OMEGA / state.k;
  const arrivalTime = (focused.x0 - X_START) / v;
  if (state.t > arrivalTime) {
    drawArrow(p, focused.x0, 0, xNow, 0);
  }

  p.pop();
}

/**
 * 縦波を横波表示に変換して描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawConvertedTransverse(p) {
  p.push();
  p.translate(0, p.height * 2 / 3);

  drawAxis(p, "横波");

  p.noFill();
  p.stroke(255, 0, 0);
  p.strokeWeight(1);
  p.beginShape();
  for (let x = X_START; x < p.width - 60; x++) {
    const dy = displacement(x, p);
    p.vertex(x, -dy);
  }
  p.endShape();

  for (const particle of state.particles) {
    const dy = displacement(particle.x0, p);
    p.fill(255, 0, 0);
    p.noStroke();
    p.circle(particle.x0, -dy, 5);
    p.stroke(255, 0, 0, 100);
    p.line(particle.x0, 0, particle.x0, -dy);
  }

  const focused = state.particles[state.focusIndex];
  const dy = displacement(focused.x0, p);

  p.noStroke();
  p.fill(0, 100, 255);
  p.circle(focused.x0, 0, 8);
  p.fill(255, 0, 0);
  p.circle(focused.x0, -dy, 8);

  const v = OMEGA / state.k;
  const arrivalTime = (focused.x0 - X_START) / v;
  if (state.t > arrivalTime) {
    drawArrow(p, focused.x0, 0, focused.x0, -dy);
  }

  p.pop();
}

/**
 * 矢印を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} x1 - 始点 X。
 * @param {number} y1 - 始点 Y。
 * @param {number} x2 - 終点 X。
 * @param {number} y2 - 終点 Y。
 */
function drawArrow(p, x1, y1, x2, y2) {
  if (p.dist(x1, y1, x2, y2) < 1) return;

  p.stroke(0, 200, 0);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);

  const angle = p.atan2(y2 - y1, x2 - x1);
  const s = 8;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.fill(0, 200, 0);
  p.noStroke();
  p.triangle(0, 0, -s, s / 2, -s, -s / 2);
  p.pop();
}

/**
 * 軸を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {string} title - 軸のラベル。
 */
function drawAxis(p, title) {
  p.stroke(0);
  p.strokeWeight(1);
  p.line(50, 0, p.width - 50, 0);
  p.fill(0);
  p.triangle(p.width - 50, 0, p.width - 60, -4, p.width - 60, 4);
  p.noStroke();
  p.textSize(20);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(title, 60, -60);
}
