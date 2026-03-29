import { state } from "./state.js";

/**
 * 原子配列を初期化する（各原子に 0〜1 のランダムしきい値を設定）。
 */
export function initAtoms() {
  state.atoms = [];
  for (let i = 0; i < state.N0; i++) {
    state.atoms.push(Math.random());
  }
}

/**
 * シミュレーション全体を描画する。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  if (state.isRunning) {
    state.currentTime += state.T;
  }
  if (state.currentTime > state.maxYears) {
    state.currentTime = 0;
    initAtoms();
  }

  const padding = 80;
  const graphW = 840;
  const bottomY = 420;
  const topY = 100;

  drawHalfLifeGuides(p, padding, graphW, bottomY, topY);
  drawAxes(p, padding, graphW, bottomY, topY);
  drawDecayCurve(p, padding, graphW, bottomY, topY);

  const currentDecayRate = Math.pow(0.5, state.currentTime / state.halfLife);
  const markerX = p.map(
    state.currentTime,
    0,
    state.maxYears,
    padding,
    padding + graphW
  );
  const markerY = p.map(
    currentDecayRate * state.N0,
    0,
    state.N0,
    bottomY,
    topY
  );
  p.fill("#F32121");
  p.noStroke();
  p.ellipse(markerX, markerY, 10, 10);

  drawAtomGrid(p, 750, 80, 200, currentDecayRate);
}

/**
 * X・Y 軸を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} pad 左右のパディング。
 * @param {number} w グラフの幅。
 * @param {number} bY グラフ下端のY座標。
 * @param {number} tY グラフ上端のY座標。
 */
function drawAxes(p, pad, w, bY, tY) {
  p.stroke(0);
  p.strokeWeight(2);
  p.line(pad, bY, pad + w, bY);
  p.noStroke();
  p.fill(0);
  p.triangle(
    pad + w,
    bY - 5,
    pad + w,
    bY + 5,
    pad + w + 10,
    bY
  );
  p.stroke(0);
  p.strokeWeight(2);
  p.line(pad, bY, pad, tY - 30);
  p.fill(0);
  p.noStroke();
  p.triangle(pad - 5, tY - 25, pad + 5, tY - 25, pad, tY - 35);

  p.textAlign(p.CENTER);
  p.textSize(13);
  if (state.halfLife === 8) {
    p.text("経過日数 (日)", pad + w / 2, bY + 50);
  } else {
    p.text("経過年数 (年)", pad + w / 2, bY + 50);
  }

  p.push();
  p.translate(pad - 50, (bY + tY) / 2);
  p.textAlign(p.CENTER, p.CENTER);
  p.textLeading(13);
  if (state.halfLife === 8) {
    p.text("ヨ\nウ\n素\nの\n量", 0, 0);
  } else if (state.halfLife === 5730) {
    p.text("炭\n素\nの\n量", 0, 0);
  }
  p.pop();
}

/**
 * 半減期ガイド線（点線グリッド）を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} pad 左右のパディング。
 * @param {number} w グラフの幅。
 * @param {number} bY グラフ下端のY座標。
 * @param {number} tY グラフ上端のY座標。
 */
function drawHalfLifeGuides(p, pad, w, bY, tY) {
  for (let i = 0; i <= 4; i++) {
    const t_half = state.halfLife * i;
    const amount = state.N0 / Math.pow(2, i);
    const x = p.map(t_half, 0, state.maxYears, pad, pad + w);
    const y = p.map(amount, 0, state.N0, bY, tY);

    p.stroke(72, 192, 225);
    p.strokeWeight(1);
    p.line(x, bY, x, y);
    p.line(pad, y, x, y);

    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text(i * state.halfLife, x, bY + 5);
    p.textAlign(p.RIGHT, p.CENTER);
    if (i === 0) {
      p.text("1", pad - 5, y);
    } else {
      p.text("1/" + Math.pow(2, i), pad - 5, y);
    }
  }
}

/**
 * 放射性崩壊曲線を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} pad 左右のパディング。
 * @param {number} w グラフの幅。
 * @param {number} bY グラフ下端のY座標。
 * @param {number} tY グラフ上端のY座標。
 */
function drawDecayCurve(p, pad, w, bY, tY) {
  p.noFill();
  p.stroke(0);
  p.strokeWeight(3);
  p.beginShape();
  for (let t = 0; t <= state.maxYears; t += state.T) {
    const n_t = state.N0 * Math.pow(0.5, t / state.halfLife);
    const x = p.map(t, 0, state.maxYears, pad, pad + w);
    const y = p.map(n_t, 0, state.N0, bY, tY);
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 原子グリッドパネルを描画する。
 * @param {*} p p5インスタンス。
 * @param {number} xStart グリッド左上のX座標。
 * @param {number} yStart グリッド左上のY座標。
 * @param {number} size グリッドの一辺のサイズ。
 * @param {number} decayRate 現在の崩壊率（0〜1）。
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
    p.ellipse(
      atomSize / 2 + col * spacing,
      atomSize / 2 + row * spacing,
      atomSize,
      atomSize
    );
  }

  // 崩壊前後の原子画像と個数テキストを左側に描画（ループ後に count が確定）
  if (state.img) {
    const imgX = -310;
    const imgY = 45;
    p.noStroke();
    p.image(state.img, imgX, imgY, state.img.width * 0.3, state.img.height * 0.3);
    p.fill(0);
    p.textLeading(20);
    p.textSize(16);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("放射線", imgX + 200, imgY + 45);
    p.textAlign(p.CENTER, p.TOP);
    if (state.halfLife === 8) {
      p.text("ヨウ素131", imgX + 45, imgY + 110);
      p.text("キセノン131", imgX + 276, imgY + 110);
    } else if (state.halfLife === 5730) {
      p.text("炭素14", imgX + 45, imgY + 110);
      p.text("窒素14", imgX + 276, imgY + 110);
    } else if (state.halfLife === 30) {
      p.text("セシウム137", imgX + 55, imgY + 110);
      p.text("バリウム137", imgX + 266, imgY + 110);
    }
    p.textSize(20);
    p.text(state.N0 - state.count + "個", imgX + 45, imgY + 150);
    p.text(state.count + "個", imgX + 276, imgY + 150);
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

