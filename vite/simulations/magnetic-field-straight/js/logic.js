// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(240);
  p.orbitControl();

  const currentVal = parseFloat(state.currentSlider.value());

  drawWire(p, currentVal);
  drawFieldLines(p, currentVal);
}

/**
 * 導線と電流方向の矢印を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} currentVal - 電流の強さ。
 */
function drawWire(p, currentVal) {
  p.push();
  p.noStroke();

  if (p.abs(currentVal) > 0.1) {
    p.fill("#FF8C00");
    const speed = currentVal;
    const yOffset = (p.frameCount * speed) % 40;

    for (let i = -6; i < 6; i++) {
      p.push();
      p.translate(0, i * 40 + yOffset, 0);
      if (currentVal < 0) {
        p.translate(0, 40, 0);
        p.rotateX(p.PI);
      }
      p.cone(5, 10);
      p.translate(0, -10, 0);
      p.cylinder(2, 10);
      p.pop();
    }
  }

  p.fill(200, 200, 200, 100);
  p.cylinder(8, 500);
  p.pop();
}

/**
 * 磁力線の円と矢印を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} currentVal - 電流の強さ。
 */
function drawFieldLines(p, currentVal) {
  const numLines = p.abs(currentVal) * 2;

  for (let i = 0; i < numLines; i++) {
    const r = 180 - (180 / numLines) * i;

    p.noFill();
    p.stroke("#0073FF");

    drawCircle(p, r);
    drawFlowArrow(p, r, 0, currentVal);
  }
}

/**
 * XZ 平面上に円を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} R - 半径。
 */
function drawCircle(p, R) {
  p.beginShape();
  for (let theta = 0; theta <= p.TWO_PI; theta += 0.05) {
    p.vertex(R * p.cos(theta), 0, R * p.sin(theta));
  }
  p.endShape(p.CLOSE);
}

/**
 * 磁力線上に進行方向を示す矢印を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} r - 磁力線の半径。
 * @param {number} y - Y 座標。
 * @param {number} currentVal - 電流の強さ。
 */
function drawFlowArrow(p, r, y, currentVal) {
  const t = 0;

  const x = r * p.cos(t);
  const z = r * p.sin(t);

  p.push();
  p.translate(x, y, z);
  const directionOffset = currentVal >= 0 ? p.PI / 2 : -p.PI / 2;
  p.rotateY(-t + directionOffset);
  p.noStroke();
  p.fill("#0073FF");
  p.rotateZ(p.PI / 2);
  p.cone(4, 10);
  p.pop();

  p.push();
  p.translate(-x, -y, z);
  const directionOffset2 = currentVal <= 0 ? p.PI / 2 : -p.PI / 2;
  p.rotateY(-t + directionOffset2);
  p.noStroke();
  p.fill("#0073FF");
  p.rotateZ(p.PI / 2);
  p.cone(4, 10);
  p.pop();
}
