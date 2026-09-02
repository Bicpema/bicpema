import { state } from "./state.js";
import { computeWaveDisplacement, computeArrivalTime } from "./physics.js";

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
  p.stroke(0, 200, 0);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);
  let angle = p.atan2(y2 - y1, x2 - x1);
  let s = 8;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.fill(0, 200, 0);
  p.noStroke();
  p.triangle(0, 0, -s, s / 2, -s, -s / 2);
  p.pop();
}

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

function drawLongitudinal(p) {
  p.push();
  p.translate(0, p.height / 3);
  drawAxis(p, "縦波");
  for (let pt of state.particles) {
    let dx = displacement(p, pt.x0);
    let x = pt.x0 + dx;
    p.stroke(180);
    p.line(x, -50, x, 50);
    p.fill(255, 0, 0);
    p.noStroke();
    p.circle(x, 0, 5);
  }
  let fp = state.particles[state.focusIndex];
  let fdx = displacement(p, fp.x0);
  let xNow = fp.x0 + fdx;
  p.fill(0, 100, 255);
  p.circle(fp.x0, 0, 8);
  p.fill(255, 0, 0);
  p.circle(xNow, 0, 8);
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
  p.stroke(255, 0, 0);
  p.strokeWeight(1);
  p.beginShape();
  for (let x = state.xStart; x < p.width - 60; x++) {
    let dy = displacement(p, x);
    p.vertex(x, -dy);
  }
  p.endShape();
  for (let pt of state.particles) {
    let dy = displacement(p, pt.x0);
    p.fill(255, 0, 0);
    p.noStroke();
    p.circle(pt.x0, -dy, 5);
    p.stroke(255, 0, 0, 100);
    p.line(pt.x0, 0, pt.x0, -dy);
  }
  let fp = state.particles[state.focusIndex];
  let fdy = displacement(p, fp.x0);
  p.noStroke();
  p.fill(0, 100, 255);
  p.circle(fp.x0, 0, 8);
  p.fill(255, 0, 0);
  p.circle(fp.x0, -fdy, 8);
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
