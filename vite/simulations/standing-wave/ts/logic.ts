import { state } from "./state.js";
import {
  computeRightWaveDisplacement,
  computeLeftWaveDisplacement,
  computeStandingWaveDisplacement,
  computeWaveFronts
} from "./physics.js";
import { GRID_LINES_PER_WAVELENGTH } from "./constants.js";

/**
 * グリッド・x軸・右向きの波・左向きの波・定常波を描画し、再生中は時間と波の先端位置を進める。
 * @param p - p5インスタンス
 */
export function drawSimulation(p: p5) {
  p.background(211, 237, 244);
  p.push();
  p.translate(state.margin, state.margin);
  p.noStroke();
  p.rect(0, 0, state.innerW, state.innerH);
  drawGrid(p);
  drawXAxis(p);
  drawRightWave(p);
  drawLeftWave(p);
  drawStandingWave(p);
  p.pop();

  if (state.running) {
    state.t += state.v;
    const { rightFront, leftFront } = computeWaveFronts(
      state.v,
      state.t,
      state.innerW
    );
    state.rightFront = rightFront;
    state.leftFront = leftFront;
  }
}

/**
 * キャンバス中央を起点に、波長に応じた間隔でグリッド線を描画する。
 * @param p - p5インスタンス
 */
function drawGrid(p: p5) {
  p.stroke(200);
  p.strokeWeight(1);
  const yCenter = state.innerH / 2;
  const gridUnitY = state.wavelength / GRID_LINES_PER_WAVELENGTH;
  for (let y = yCenter; y <= state.innerH; y += gridUnitY) {
    p.line(0, y, state.innerW, y);
  }
  for (let y = yCenter; y >= 0; y -= gridUnitY) {
    p.line(0, y, state.innerW, y);
  }
  const xCenter = state.innerW / 2;
  const gridUnitX = state.wavelength / GRID_LINES_PER_WAVELENGTH;
  for (let x = xCenter; x <= state.innerW; x += gridUnitX) {
    p.line(x, 0, x, state.innerH);
  }
  for (let x = xCenter; x >= 0; x -= gridUnitX) {
    p.line(x, 0, x, state.innerH);
  }
}

/**
 * 矢印とラベル付きのx軸を描画する。
 * @param p - p5インスタンス
 */
function drawXAxis(p: p5) {
  const yAxis = state.innerH / 2;
  p.stroke(0);
  p.strokeWeight(2);
  p.line(0, yAxis, state.innerW - 1, yAxis);
  p.strokeWeight(1);
  p.fill(0);
  p.triangle(
    state.innerW - 10,
    yAxis - 5,
    state.innerW - 10,
    yAxis + 5,
    state.innerW,
    yAxis
  );
  p.noStroke();
  p.fill(0);
  p.textSize(14);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text("x", state.innerW - 5, yAxis + 20);
}

/**
 * 右向きに進む波を、波の先端より左側の範囲に赤色で描画する。
 * @param p - p5インスタンス
 */
function drawRightWave(p: p5) {
  p.stroke(255, 0, 0);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x < state.rightFront) {
      const y = computeRightWaveDisplacement(
        state.A,
        state.k,
        x,
        state.omega,
        state.t
      );
      p.vertex(x, state.innerH / 2 + y);
    }
  }
  p.endShape();
}

/**
 * 左向きに進む波を、波の先端より右側の範囲に青色で描画する。
 * @param p - p5インスタンス
 */
function drawLeftWave(p: p5) {
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x > state.leftFront) {
      const y = computeLeftWaveDisplacement(
        state.A,
        state.k,
        x,
        state.omega,
        state.t
      );
      p.vertex(x, state.innerH / 2 + y);
    }
  }
  p.endShape();
}

/**
 * 2つの波が重なり合う範囲に定常波を緑色で描画する。
 * @param p - p5インスタンス
 */
function drawStandingWave(p: p5) {
  p.stroke(0, 180, 0);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = 0; x < state.innerW; x++) {
    if (x <= state.rightFront && x >= state.leftFront) {
      const y = computeStandingWaveDisplacement(
        state.A,
        state.k,
        x,
        state.omega,
        state.t,
        state.innerW
      );
      p.vertex(x, state.innerH / 2 + y);
    }
  }
  p.endShape();
}
