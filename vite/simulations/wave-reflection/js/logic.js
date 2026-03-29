import { state } from "./state.js";

export function drawSimulation(p) {
  p.background(255);
  drawGrid(p);
  drawReflectWall(p);
  p.noFill();

  // 入射波（青）- 壁より左の実線部分
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

  // 入射波（壁より右・点線）
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

  // 反射波（赤）
  if (state.front > state.reflectX) {
    const reflectedFront = p.max(0, 2 * state.reflectX - state.front);
    const mirrorOrigin = 2 * state.reflectX;
    p.stroke(255, 0, 0);
    p.strokeWeight(2);
    p.beginShape();
    for (let x = 0; x < p.width; x++) {
      if (x >= reflectedFront && x <= state.reflectX) {
        let y =
          state.A * p.sin(state.k * (mirrorOrigin - x) - state.omega * state.t);
        if (state.mode === "fixed") y *= -1;
        p.vertex(x, p.height / 2 + y);
      }
    }
    p.endShape();

    // 固定端：壁より右の反射波（点線）
    if (state.mode === "fixed") {
      p.stroke(255, 0, 0);
      p.drawingContext.setLineDash([6, 6]);
      p.beginShape();
      for (let x = 0; x < p.width; x++) {
        if (x >= state.reflectX && x <= state.front) {
          const y =
            -state.A *
            p.sin(state.k * (mirrorOrigin - x) - state.omega * state.t);
          p.vertex(x, p.height / 2 + y);
        }
      }
      p.endShape();
      p.drawingContext.setLineDash([]);
    }
  }

  // 合成波（緑）
  if (state.front > state.reflectX) {
    const reflectedFront = p.max(0, 2 * state.reflectX - state.front);
    const mirrorOrigin = 2 * state.reflectX;
    p.stroke(0, 160, 0);
    p.strokeWeight(2.5);
    p.beginShape();
    for (let x = 0; x < p.width; x++) {
      if (x >= reflectedFront && x <= state.reflectX) {
        const yIncident = state.A * p.sin(state.k * x - state.omega * state.t);
        let yReflected =
          state.A * p.sin(state.k * (mirrorOrigin - x) - state.omega * state.t);
        if (state.mode === "fixed") yReflected *= -1;
        p.vertex(x, p.height / 2 + (yIncident + yReflected));
      }
    }
    p.endShape();

    // 壁の点（合成波の端点）
    p.strokeWeight(8);
    if (state.mode === "free") {
      p.point(
        state.reflectX,
        p.height / 2 +
          2 * state.A * p.sin(state.k * state.reflectX - state.omega * state.t)
      );
    } else {
      p.point(state.reflectX, p.height / 2);
    }
  }

  if (state.running) {
    state.t += state.v;
    state.front = p.min(state.v * state.t, 2 * state.reflectX);
  }
}

function drawGrid(p) {
  p.stroke(142, 216, 236);
  p.strokeWeight(1);
  const wavelength = p.TWO_PI / state.k;
  const gridX = wavelength / 8;
  // 壁位置（state.reflectX）を起点に左右へグリッド線を引く
  for (let x = state.reflectX; x <= p.width; x += gridX) {
    p.line(x, 0, x, p.height);
  }
  for (let x = state.reflectX - gridX; x >= 0; x -= gridX) {
    p.line(x, 0, x, p.height);
  }
  // 中央（p.height/2）を起点に上下へグリッド線を引く
  const y0 = p.height / 2;
  const gridY = state.A / 2;
  for (let y = y0; y <= p.height; y += gridY) {
    p.line(0, y, p.width, y);
  }
  for (let y = y0 - gridY; y >= 0; y -= gridY) {
    p.line(0, y, p.width, y);
  }
  p.stroke(0);
  p.strokeWeight(2);
  p.line(0, p.height / 2, p.width, p.height / 2);
}

function drawReflectWall(p) {
  if (state.mode === "free") p.stroke(236, 193, 56);
  else p.stroke(0, 171, 158);
  p.strokeWeight(3);
  p.line(state.reflectX, 0, state.reflectX, p.height);
}
