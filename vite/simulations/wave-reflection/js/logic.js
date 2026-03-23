// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  drawGrid(p);
  drawReflectWall(p);
  p.noFill();

  drawIncidentWave(p);
  drawIncidentWaveDashed(p);
  drawReflectedWave(p);
  drawCompositeWave(p);

  if (state.running) {
    state.t += state.v;
    state.front = p.min(state.v * state.t, 2 * state.reflectX);
  }
}

/**
 * グリッドを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawGrid(p) {
  p.stroke(142, 216, 236);
  p.strokeWeight(1);

  const wavelength = p.TWO_PI / state.k;
  const gridX = wavelength / 8;

  for (let x = 0; x <= p.width; x += gridX) {
    p.line(x, 0, x, p.height);
  }

  const y0 = p.height / 2;
  for (let y = y0 - 4 * state.A; y <= y0 + 4 * state.A; y += state.A / 2) {
    p.line(0, y, p.width, y);
  }

  p.stroke(0);
  p.strokeWeight(2);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

/**
 * 反射壁を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawReflectWall(p) {
  if (state.mode === "free") {
    p.stroke(236, 193, 56);
  } else {
    p.stroke(0, 171, 158);
  }
  p.strokeWeight(3);
  p.line(state.reflectX, 0, state.reflectX, p.height);
}

/**
 * 入射波（青・実線）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawIncidentWave(p) {
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x < p.width; x++) {
    if (x <= p.min(state.front, state.reflectX)) {
      const y = state.A * p.sin(state.k * x - state.omega * state.t);
      p.vertex(x, p.height / 2 + y);
    }
  }
  p.endShape();
}

/**
 * 入射波（壁より右・点線）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawIncidentWaveDashed(p) {
  p.stroke(0, 0, 255);
  p.drawingContext.setLineDash([6, 6]);
  p.beginShape();
  for (let x = 0; x < p.width; x++) {
    if (x >= state.reflectX && x <= state.front) {
      const y = state.A * p.sin(state.k * x - state.omega * state.t);
      p.vertex(x, p.height / 2 + y);
    }
  }
  p.endShape();
  p.drawingContext.setLineDash([]);
}

/**
 * 反射波を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawReflectedWave(p) {
  if (state.front <= state.reflectX) return;

  const reflectedFront = p.max(0, 2 * state.reflectX - state.front);

  // 反射波（赤・実線）
  p.stroke(255, 0, 0);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x < p.width; x++) {
    if (x >= reflectedFront && x <= state.reflectX) {
      let y = state.A * p.sin(state.k * (2 * state.reflectX - x) - state.omega * state.t);
      if (state.mode === "fixed") y *= -1;
      p.vertex(x, p.height / 2 + y);
    }
  }
  p.endShape();

  // 固定端：壁より右の仮想反射波（赤・点線）
  if (state.mode === "fixed") {
    p.stroke(255, 0, 0);
    p.drawingContext.setLineDash([6, 6]);
    p.beginShape();
    for (let x = 0; x < p.width; x++) {
      if (x >= state.reflectX && x <= state.front) {
        const y = -state.A * p.sin(state.k * (2 * state.reflectX - x) - state.omega * state.t);
        p.vertex(x, p.height / 2 + y);
      }
    }
    p.endShape();
    p.drawingContext.setLineDash([]);
  }
}

/**
 * 合成波（緑）を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawCompositeWave(p) {
  if (state.front <= state.reflectX) return;

  const reflectedFront = p.max(0, 2 * state.reflectX - state.front);

  p.stroke(0, 160, 0);
  p.strokeWeight(2.5);
  p.beginShape();
  for (let x = 0; x < p.width; x++) {
    if (x >= reflectedFront && x <= state.reflectX) {
      const yIncident = state.A * p.sin(state.k * x - state.omega * state.t);
      let yReflected = state.A * p.sin(state.k * (2 * state.reflectX - x) - state.omega * state.t);
      if (state.mode === "fixed") yReflected *= -1;
      p.vertex(x, p.height / 2 + (yIncident + yReflected));
    }
  }
  p.endShape();

  p.strokeWeight(8);
  if (state.mode === "free") {
    p.point(
      state.reflectX,
      p.height / 2 + 2 * state.A * p.sin(state.k * state.reflectX - state.omega * state.t)
    );
  } else {
    p.point(state.reflectX, p.height / 2);
  }
}
