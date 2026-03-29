import { state } from "./state.js";

/**
 * シミュレーション全体を描画する関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  const phaseRadio = document.querySelector('input[name="phase"]:checked');
  if (phaseRadio) state.phase = phaseRadio.value === "true";

  const speedRadio = document.querySelector('input[name="speed"]:checked');
  if (speedRadio) state.omega = parseFloat(speedRadio.value);

  p.background(255);
  p.textSize(16);
  p.textAlign(p.CENTER, p.TOP);
  p.text("一次コイル", 395, 450);
  p.text("巻数：" + (state.count1 + 1), 395, 475);
  p.text("二次コイル", 645, 450);
  p.text("巻数：" + (state.count2 + 1), 645, 475);

  p.push();
  p.translate(350, 0);
  p.image(state.img1, 0, 50, 396, 376);
  magline(p);
  coil1(p);
  coil2(p);
  p.pop();

  p.push();
  p.translate(50, 150);
  oscillo1(p);
  p.pop();

  p.push();
  p.translate(850, 150);
  oscillo2(p);
  p.pop();

  state.t++;
}

function magline(p) {
  p.rectMode(p.CENTER);
  p.noFill();
  p.stroke(0, 50, 200);
  p.strokeWeight(5);
  p.rect(177, 252, 250, 250, 20);
  if (p.sin(-state.omega * state.t) >= 0) {
    p.triangle(177 - 5, 252 + 125 + 5, 177 - 5, 252 + 125 - 5, 177 + 5, 252 + 125);
    p.triangle(177 + 5, 252 - 125 + 5, 177 + 5, 252 - 125 - 5, 177 - 5, 252 - 125);
  }
  if (p.sin(-state.omega * state.t) < 0) {
    p.triangle(177 + 5, 252 + 125 + 5, 177 + 5, 252 + 125 - 5, 177 - 5, 252 + 125);
    p.triangle(177 - 5, 252 - 125 + 5, 177 - 5, 252 - 125 - 5, 177 + 5, 252 - 125);
  }
  p.noStroke();
  p.fill(0, 50, 200);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("磁力線", 177, 110);
}

function coil1(p) {
  const x = 0;
  const w = 91;
  const h = 5;
  const x2 = x + w - 2;
  const w2 = 45;
  const y = 250 - (state.count1 * h) / 2;
  const d = p.sin(-state.angle) * w2;

  p.image(state.img2, x - 77, y - h - d, 78, h);
  p.image(state.img2, x - 77, y + state.count1 * h, w + 77, h);

  p.push();
  p.translate(x2, y + state.count1 * h);
  p.rotate(state.angle);
  p.image(state.img3, 0, 0, w2, h);
  p.pop();

  for (let i = 0; i < state.count1; i++) {
    state.topY1 = y + i * h;
    p.image(state.img2, x, state.topY1, w, h);
    p.push();
    p.translate(x2, state.topY1);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
  }

  p.push();
  p.translate(-40, y + state.count1 * h);
  current1(p);
  p.noStroke();
  p.fill(255, 0, 0);
  p.textSize(16);
  p.textAlign(p.CENTER, p.TOP);
  p.text("一次電流", 0, 20);
  p.pop();
}

function coil2(p) {
  const x = 260;
  const w = 87;
  const h = 5;
  const x2 = x + w - 2;
  const w2 = 53;
  const y = 250 - (state.count2 * h) / 2;
  const d = p.sin(-state.angle) * w2;

  for (let i = 0; i < state.count2; i++) {
    state.topY2 = y + i * h;
    p.image(state.img2, x, state.topY2, w, h);
    p.push();
    p.translate(x2, state.topY2);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
  }

  if (state.phase) {
    p.image(state.img2, x, y + state.count2 * h, w, h);
    p.push();
    p.translate(x2, y + state.count2 * h);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
    p.image(state.img3, x + w, y + state.count2 * h, w + 30, h);
    p.image(state.img3, x + 135, y - h - d, w * 2 - 135 + 30, h);
    p.push();
    p.translate(x2 + 82, y - h - d);
    current2(p);
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("二次電流", 5, -10);
    p.pop();
  }

  if (!state.phase) {
    p.image(state.img2, x, y - h, w, h);
    p.push();
    p.translate(x2, y - h);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
    p.image(state.img3, x + 135, y + state.count2 * h, w * 2 - 135 + 30, h);
    p.image(state.img3, x + w, y - h, w + 30, h);
    p.push();
    p.translate(x2 + 82, y - h);
    current2(p);
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("二次電流", 5, -10);
    p.pop();
  }
}

function oscillo1(p) {
  const w = 200;
  const h = 200;
  const V1 = h / 10;
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("一次電圧", 100, -10);
  p.fill(75, 127, 127, 220);
  p.noStroke();
  p.rect(0, 0, w, h);
  p.stroke(200);
  for (let i = 0; i <= w; i += V1) {
    p.line(0, i, w, i);
    p.line(i, 0, i, h);
  }
  p.noFill();
  p.stroke(0, 255, 255);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x <= w; x++) {
    let y = h / 2 + V1 * p.sin(state.waveK * x - state.omega * state.t);
    p.vertex(x, y);
  }
  p.endShape();
}

function oscillo2(p) {
  const w = 200;
  const h = 200;
  const V1 = h / 10;
  let V2 = V1 * (state.count2 + 1) / (state.count1 + 1);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("二次電圧", 100, -10);
  p.fill(75, 127, 127, 220);
  p.noStroke();
  p.rect(0, 0, w, h);
  p.stroke(200);
  for (let i = 0; i <= w; i += V1) {
    p.line(0, i, w, i);
    p.line(i, 0, i, h);
  }
  p.noFill();
  p.stroke(0, 255, 255);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x <= w; x++) {
    let y;
    if (state.phase) {
      y = h / 2 + V2 * p.sin(state.waveK * x - state.omega * state.t);
    } else {
      y = h / 2 - V2 * p.sin(state.waveK * x - state.omega * state.t);
    }
    p.vertex(x, y);
  }
  p.endShape();
}

function current1(p) {
  p.push();
  p.noStroke();
  p.fill(255, 0, 0);
  const I = 15 * p.sin(state.omega * state.t);
  const x = 10 * p.sin(state.omega * state.t);
  p.quad(0, 0, 0 + I, 0, 0 + I, 0 + 5, 0, 0 + 5);
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}

function current2(p) {
  p.push();
  p.noStroke();
  p.fill(255, 0, 0);
  let I, x;
  if (state.phase) {
    I = 15 * (state.count1 + 1) / (state.count2 + 1) * p.sin(state.omega * state.t);
    x = 10 * p.sin(state.omega * state.t);
  } else {
    I = -15 * (state.count1 + 1) / (state.count2 + 1) * p.sin(state.omega * state.t);
    x = -10 * p.sin(state.omega * state.t);
  }
  p.quad(0, 0, 0 + I, 0, 0 + I, 0 + 5, 0, 0 + 5);
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}
