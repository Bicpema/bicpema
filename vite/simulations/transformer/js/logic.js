// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  updateFromDOM();

  p.background(255);

  p.textSize(16);
  p.textAlign(p.CENTER, p.TOP);
  p.text("一次コイル", p.width * 0.359, p.height * 0.75);
  p.text("巻数：" + (state.count1 + 1), p.width * 0.359, p.height * 0.75 + 25);
  p.text("二次コイル", p.width * 0.586, p.height * 0.75);
  p.text("巻数：" + (state.count2 + 1), p.width * 0.586, p.height * 0.75 + 25);

  p.push();
    p.translate(p.width * 0.318, 0);
    drawTransformerImage(p);
    drawMagline(p);
    drawCoil1(p);
    drawCoil2(p);
  p.pop();

  p.push();
    p.translate(p.width * 0.045, p.height * 0.25);
    drawOscillo1(p);
  p.pop();

  p.push();
    p.translate(p.width * 0.773, p.height * 0.25);
    drawOscillo2(p);
  p.pop();

  state.t++;
}

/**
 * DOM のラジオボタン値を state に反映する。
 */
function updateFromDOM() {
  if (state.phaseRadios) {
    for (const radio of state.phaseRadios) {
      if (radio.checked) {
        state.phase = radio.value === "phasetrue";
        break;
      }
    }
  }
  if (state.speedRadios) {
    for (const radio of state.speedRadios) {
      if (radio.checked) {
        state.omega = Number(radio.value);
        break;
      }
    }
  }
}

/**
 * 変圧器本体の画像を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawTransformerImage(p) {
  const w = p.width * 0.36;
  const h = w * (376 / 396);
  p.image(state.img1, 0, p.height * 0.083, w, h);
}

/**
 * 磁力線を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawMagline(p) {
  const cx = p.width * 0.161;
  const cy = p.height * 0.417;
  const rw = p.width * 0.227;
  const rh = p.height * 0.417;

  p.rectMode(p.CENTER);
  p.noFill();
  p.stroke(0, 50, 200);
  p.strokeWeight(5);
  p.rect(cx, cy, rw, rh, 20);

  if (p.sin(-state.omega * state.t) >= 0) {
    p.triangle(cx - 5, cy + rh / 2 + 5, cx - 5, cy + rh / 2 - 5, cx + 5, cy + rh / 2);
    p.triangle(cx + 5, cy - rh / 2 + 5, cx + 5, cy - rh / 2 - 5, cx - 5, cy - rh / 2);
  } else {
    p.triangle(cx + 5, cy + rh / 2 + 5, cx + 5, cy + rh / 2 - 5, cx - 5, cy + rh / 2);
    p.triangle(cx - 5, cy - rh / 2 + 5, cx - 5, cy - rh / 2 - 5, cx + 5, cy - rh / 2);
  }

  p.noStroke();
  p.fill(0, 50, 200);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("磁力線", cx, p.height * 0.183);

  p.rectMode(p.CORNER);
}

/**
 * 一次コイルを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawCoil1(p) {
  const x = 0;
  const w = 91;
  const h = 5;
  const x2 = x + w - 2;
  const w2 = 45;
  const centerY = p.height * 0.417;
  const y = centerY - (state.count1 * h) / 2;
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
    drawCurrent1(p);
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    p.text("一次電流", 0, 20);
  p.pop();
}

/**
 * 二次コイルを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawCoil2(p) {
  const x = 260;
  const w = 87;
  const h = 5;
  const x2 = x + w - 2;
  const w2 = 53;
  const centerY = p.height * 0.417;
  const y = centerY - (state.count2 * h) / 2;
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
      drawCurrent2(p);
      p.noStroke();
      p.fill(255, 0, 0);
      p.textSize(16);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("二次電流", 5, -10);
    p.pop();
  } else {
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
      drawCurrent2(p);
      p.noStroke();
      p.fill(255, 0, 0);
      p.textSize(16);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text("二次電流", 5, -10);
    p.pop();
  }
}

/**
 * 一次側オシロスコープを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawOscillo1(p) {
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
    const y = h / 2 + V1 * p.sin(state.k * x - state.omega * state.t);
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 二次側オシロスコープを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawOscillo2(p) {
  const w = 200;
  const h = 200;
  const V1 = h / 10;
  const V2 = V1 * (state.count2 + 1) / (state.count1 + 1);

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
      y = h / 2 + V2 * p.sin(state.k * x - state.omega * state.t);
    } else {
      y = h / 2 - V2 * p.sin(state.k * x - state.omega * state.t);
    }
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 一次電流の矢印を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawCurrent1(p) {
  p.push();
  p.noStroke();
  p.fill(255, 0, 0);
  const I = 15 * p.sin(state.omega * state.t);
  const x = 10 * p.sin(state.omega * state.t);
  p.quad(0, 0, I, 0, I, 5, 0, 5);
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}

/**
 * 二次電流の矢印を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawCurrent2(p) {
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
  p.quad(0, 0, I, 0, I, 5, 0, 5);
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}
