// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state, initAtoms } from "./state.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  if (state.isRunning) {
    state.currentTime += state.T;
  }

  if (state.currentTime > state.maxYears) {
    state.currentTime = 0;
    initAtoms(p);
  }

  const padding = 80;
  const graphW = p.width - padding * 2;
  const bottomY = p.height - 150;
  const topY = 100;

  drawHalfLifeGuides(p, padding, graphW, bottomY, topY);
  drawAxes(p, padding, graphW, bottomY, topY);
  drawDecayCurve(p, padding, graphW, bottomY, topY);

  const currentDecayRate = p.pow(0.5, state.currentTime / state.halfLife);
  const markerX = p.map(state.currentTime, 0, state.maxYears, padding, padding + graphW);
  const markerY = p.map(currentDecayRate * state.N0, 0, state.N0, bottomY, topY);

  p.fill("#F32121");
  p.noStroke();
  p.ellipse(markerX, markerY, 10, 10);

  drawAtomGrid(p, p.width - 250, 80, 200, currentDecayRate);
  drawAtomImage(p);
}

/**
 * X・Y 軸と軸ラベルを描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} padding - グラフの左右余白。
 * @param {number} graphW - グラフの描画幅。
 * @param {number} bottomY - グラフ下端の Y 座標。
 * @param {number} topY - グラフ上端の Y 座標。
 */
function drawAxes(p, padding, graphW, bottomY, topY) {
  p.stroke(0);
  p.strokeWeight(2);
  p.line(padding, bottomY, p.width - padding, bottomY);
  p.noStroke();
  p.fill(0);
  p.triangle(
    p.width - padding, bottomY - 5,
    p.width - padding, bottomY + 5,
    p.width - padding + 10, bottomY
  );

  p.stroke(0);
  p.strokeWeight(2);
  p.line(padding, bottomY, padding, topY - 30);
  p.fill(0);
  p.noStroke();
  p.triangle(padding - 5, topY - 25, padding + 5, topY - 25, padding, topY - 35);

  p.textAlign(p.CENTER);
  p.textSize(13);
  if (state.halfLife === 8) {
    p.text("経過日数 (日)", padding + graphW / 2, bottomY + 50);
  } else {
    p.text("経過年数 (年)", padding + graphW / 2, bottomY + 50);
  }

  p.push();
  p.translate(padding - 50, (bottomY + topY) / 2);
  p.textAlign(p.CENTER, p.CENTER);
  p.textLeading(13);
  if (state.halfLife === 8) {
    p.text("ヨ\nウ\n素\nの\n量", 0, 0);
  } else if (state.halfLife === 5730) {
    p.text("炭\n素\nの\n量", 0, 0);
  } else if (state.halfLife === 30) {
    p.text("セ\nシ\nウ\nム\nの\n量", 0, 0);
  }
  p.pop();
}

/**
 * 半減期ガイドライン（半減期ごとの垂直・水平点線と目盛り）を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} padding - グラフの左右余白。
 * @param {number} graphW - グラフの描画幅。
 * @param {number} bottomY - グラフ下端の Y 座標。
 * @param {number} topY - グラフ上端の Y 座標。
 */
function drawHalfLifeGuides(p, padding, graphW, bottomY, topY) {
  for (let i = 0; i <= 4; i++) {
    const tHalf = state.halfLife * i;
    const amount = state.N0 / p.pow(2, i);
    const x = p.map(tHalf, 0, state.maxYears, padding, padding + graphW);
    const y = p.map(amount, 0, state.N0, bottomY, topY);

    p.stroke(72, 192, 225);
    p.strokeWeight(1);
    p.line(x, bottomY, x, y);
    p.line(padding, y, x, y);

    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text(i * state.halfLife, x, bottomY + 5);

    p.textAlign(p.RIGHT, p.CENTER);
    if (i === 0) {
      p.text("1", padding - 5, y);
    } else {
      p.text("1/" + p.pow(2, i), padding - 5, y);
    }
  }
}

/**
 * 崩壊曲線を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} padding - グラフの左右余白。
 * @param {number} graphW - グラフの描画幅。
 * @param {number} bottomY - グラフ下端の Y 座標。
 * @param {number} topY - グラフ上端の Y 座標。
 */
function drawDecayCurve(p, padding, graphW, bottomY, topY) {
  p.noFill();
  p.stroke(0);
  p.strokeWeight(3);
  p.beginShape();
  for (let t = 0; t <= state.maxYears; t += state.T) {
    const nt = state.N0 * p.pow(0.5, t / state.halfLife);
    const x = p.map(t, 0, state.maxYears, padding, padding + graphW);
    const y = p.map(nt, 0, state.N0, bottomY, topY);
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 原子グリッド（崩壊・未崩壊の原子を色分けして表示）を描画する。
 * @param {*} p - p5 インスタンス。
 * @param {number} xStart - グリッド描画の X 開始座標。
 * @param {number} yStart - グリッド描画の Y 開始座標。
 * @param {number} size - グリッド全体のサイズ。
 * @param {number} decayRate - 現在の崩壊率（0〜1）。
 */
function drawAtomGrid(p, xStart, yStart, size, decayRate) {
  const cols = state.n;
  const spacing = size / cols;
  const atomSize = spacing;
  state.count = 0;

  p.push();
  p.translate(xStart, yStart);
  p.rectMode(p.CENTER);
  p.noStroke();

  p.fill("#A6DAF1");
  p.rect(-50, size / 2, size * 2.75, size * 1.5, 20, 20);
  p.fill(255, 252, 230);
  p.rect(size / 2, size / 2, size * 1.05, size * 1.05, 10, 10);

  for (let i = 0; i < state.N0; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    if (decayRate < state.atoms[i]) {
      p.fill(30, 127, 180);
      state.count++;
    } else {
      p.fill(225, 84, 54);
    }
    p.ellipse(atomSize / 2 + col * spacing, atomSize / 2 + row * spacing, atomSize, atomSize);
  }

  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(20);
  p.noStroke();
  p.text("半減期シミュレーター", size / 2, -20);
  p.text(state.N0 + "個", 150, size * 1.125);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("原子の数", 0, size * 1.125);
  p.pop();
}

/**
 * 原子崩壊のイメージ画像と元素ラベルを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawAtomImage(p) {
  p.push();
  p.translate(20, 40);
  p.textLeading(20);
  p.textSize(16);
  p.fill(0);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("放射線", 400, 145);
  p.image(state.img, 200, 100, state.img.width * 0.3, state.img.height * 0.3);

  p.textAlign(p.CENTER, p.TOP);
  if (state.halfLife === 8) {
    p.text("ヨウ素131", 245, 210);
    p.text("キセノン131", 476, 210);
  } else if (state.halfLife === 5730) {
    p.text("炭素14", 245, 210);
    p.text("窒素14", 476, 210);
  } else if (state.halfLife === 30) {
    p.text("セシウム137", 255, 210);
    p.text("バリウム137", 466, 210);
  }

  p.textSize(20);
  p.text(state.N0 - state.count + "個", 245, 250);
  p.text(state.count + "個", 476, 250);
  p.pop();
}
