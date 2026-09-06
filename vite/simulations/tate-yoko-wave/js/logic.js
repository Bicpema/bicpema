import { state } from "./state.js";
import { computeWaveDisplacement, computeArrivalTime } from "./physics.js";
import {
  WAVE_ORIGIN_X,
  AXIS_RIGHT_MARGIN,
  ARROW_LENGTH,
  PARTICLE_SIZE,
  FOCUS_PARTICLE_SIZE,
  WAVE_COLOR,
  FOCUS_ORIGIN_COLOR,
  ARROW_COLOR,
} from "./constants.js";

function displacement(p, x0) {
  return computeWaveDisplacement(
    state.A,
    state.k,
    state.omega,
    x0,
    state.xStart,
    state.t
  );
}

function drawArrow(p, x1, y1, x2, y2) {
  if (p.dist(x1, y1, x2, y2) < 1) return;
  p.stroke(...ARROW_COLOR);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);
  let angle = p.atan2(y2 - y1, x2 - x1);
  let s = 8;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.fill(...ARROW_COLOR);
  p.noStroke();
  p.triangle(0, 0, -s, s / 2, -s, -s / 2);
  p.pop();
}

function drawAxis(p, title) {
  p.stroke(0);
  p.strokeWeight(1);
  p.line(AXIS_RIGHT_MARGIN, 0, p.width - AXIS_RIGHT_MARGIN, 0);
  p.fill(0);
  p.triangle(
    p.width - AXIS_RIGHT_MARGIN,
    0,
    p.width - AXIS_RIGHT_MARGIN - ARROW_LENGTH,
    -4,
    p.width - AXIS_RIGHT_MARGIN - ARROW_LENGTH,
    4
  );
  p.noStroke();
  p.textSize(20);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(title, WAVE_ORIGIN_X, -60);
}

function drawLongitudinal(p) {
  p.push();
  p.translate(0, p.height / 3);
  drawAxis(p, "縦波");
  for (let pt of state.particles) {
    let dx = displacement(p, pt.x0);
    let x = pt.x0 + dx;
    p.stroke(180);
    p.line(x, -50, x, 50);
    p.fill(...WAVE_COLOR);
    p.noStroke();
    p.circle(x, 0, PARTICLE_SIZE);
  }
  let fp = state.particles[state.focusIndex];
  let fdx = displacement(p, fp.x0);
  let xNow = fp.x0 + fdx;
  p.fill(...FOCUS_ORIGIN_COLOR);
  p.circle(fp.x0, 0, FOCUS_PARTICLE_SIZE);
  p.fill(...WAVE_COLOR);
  p.circle(xNow, 0, FOCUS_PARTICLE_SIZE);
  let arrivalTime = computeArrivalTime(
    state.k,
    state.omega,
    fp.x0,
    state.xStart
  );
  if (state.t > arrivalTime) drawArrow(p, fp.x0, 0, xNow, 0);
  p.pop();
}

function drawConvertedTransverse(p) {
  p.push();
  p.translate(0, (p.height * 2) / 3);
  drawAxis(p, "横波");
  p.noFill();
  p.stroke(...WAVE_COLOR);
  p.strokeWeight(1);
  p.beginShape();
  for (let x = state.xStart; x < p.width - WAVE_ORIGIN_X; x++) {
    let dy = displacement(p, x);
    p.vertex(x, -dy);
  }
  p.endShape();
  for (let pt of state.particles) {
    let dy = displacement(p, pt.x0);
    p.fill(...WAVE_COLOR);
    p.noStroke();
    p.circle(pt.x0, -dy, PARTICLE_SIZE);
    p.stroke(...WAVE_COLOR, 100);
    p.line(pt.x0, 0, pt.x0, -dy);
  }
  let fp = state.particles[state.focusIndex];
  let fdy = displacement(p, fp.x0);
  p.noStroke();
  p.fill(...FOCUS_ORIGIN_COLOR);
  p.circle(fp.x0, 0, FOCUS_PARTICLE_SIZE);
  p.fill(...WAVE_COLOR);
  p.circle(fp.x0, -fdy, FOCUS_PARTICLE_SIZE);
  let arrivalTime = computeArrivalTime(
    state.k,
    state.omega,
    fp.x0,
    state.xStart
  );
  if (state.t > arrivalTime) drawArrow(p, fp.x0, 0, fp.x0, -fdy);
  p.pop();
}

export function drawSimulation(p) {
  const speedSlider = document.getElementById("speedSlider");
  if (speedSlider) p.frameRate(parseInt(speedSlider.value));
  p.background(255);
  if (state.running) state.t += 1;
  drawLongitudinal(p);
  drawConvertedTransverse(p);
}
