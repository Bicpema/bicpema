import { state } from "./state.js";
import {
  computeRightWaveDisplacement,
  computeLeftWaveDisplacement,
  computeStandingWaveDisplacement,
  computeWaveFronts,
} from "./physics.js";

export function drawSimulation(p) {
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

function drawXAxis(p) {
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

function drawRightWave(p) {
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

function drawLeftWave(p) {
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

function drawStandingWave(p) {
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
