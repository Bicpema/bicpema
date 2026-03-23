// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

/**
 * 10 本の半透明スナップショット波形をオフスクリーンレイヤーに描画する。
 * パラメータ変更時に呼び出して残像を更新する。
 * @param {*} p - p5 インスタンス。
 */
export function updateWaveLayer(p) {
  state.waveLayer.clear();
  state.waveLayer.stroke(0, 100, 255, 100);
  state.waveLayer.noFill();

  const freqConst =
    state.type === "closed"
      ? (state.m_n * p.PI) / (2 * state.pipeL)
      : (state.m_n * p.PI) / state.pipeL;

  const steps = 10;
  for (let i = 0; i < steps; i++) {
    const phase = p.map(i, 0, steps - 1, -p.HALF_PI, p.HALF_PI);
    const currentAmp = state.Amp * p.sin(phase);
    state.waveLayer.beginShape();
    for (let x = 0; x <= state.pipeL; x++) {
      const yVal = currentAmp * p.cos(x * freqConst);
      state.waveLayer.vertex(state.startX + x, state.pipeY + yVal);
    }
    state.waveLayer.endShape();
  }
}

/**
 * 毎フレームのシミュレーション描画を行う。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  p.image(state.waveLayer, 0, 0);

  drawUIContext(p);

  const freqConst =
    state.type === "closed"
      ? (state.m_n * p.PI) / (2 * state.pipeL)
      : (state.m_n * p.PI) / state.pipeL;

  p.noFill();
  p.stroke(0, 100, 255);
  p.strokeWeight(2);
  p.beginShape();
  const currentSin = p.sin(state.time);
  for (let x = 0; x <= state.pipeL; x++) {
    const yVal = state.Amp * p.cos(x * freqConst) * currentSin;
    p.vertex(state.startX + x, state.pipeY + yVal);
  }
  p.endShape();

  state.time += 0.05;

  drawFormula(p);
}

/**
 * 管・寸法線・腹/節ラベルを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawUIContext(p) {
  const pipeH = 100;
  const dimY = state.pipeY + 100;

  // 寸法線（破線）
  p.stroke(150);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([5, 5]);
  p.line(state.startX, state.pipeY + pipeH / 2, state.startX, dimY + 10);
  p.line(
    state.startX + state.pipeL,
    state.pipeY + pipeH / 2,
    state.startX + state.pipeL,
    dimY + 10
  );
  p.drawingContext.setLineDash([]);

  // L 矢印線
  p.stroke(0);
  p.line(state.startX, dimY, state.startX + state.pipeL, dimY);
  p.line(state.startX, dimY - 5, state.startX, dimY + 5);
  p.line(
    state.startX + state.pipeL,
    dimY - 5,
    state.startX + state.pipeL,
    dimY + 5
  );
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER);
  p.textSize(20);
  p.textFont("serif");
  p.text("L", state.startX + state.pipeL / 2, dimY + 25);

  // 管の壁（黒・太）
  p.stroke(0);
  p.strokeWeight(5);
  p.line(
    state.startX,
    state.pipeY - pipeH / 2,
    state.startX + state.pipeL,
    state.pipeY - pipeH / 2
  );
  p.line(
    state.startX,
    state.pipeY + pipeH / 2,
    state.startX + state.pipeL,
    state.pipeY + pipeH / 2
  );
  if (state.type === "closed") {
    p.line(
      state.startX + state.pipeL + 5 / 2,
      state.pipeY - pipeH / 2,
      state.startX + state.pipeL + 5 / 2,
      state.pipeY + pipeH / 2
    );
    drawLabels(p, "腹", "節");
  } else {
    drawLabels(p, "腹", "腹");
  }

  // 管の壁（グレー・細）で上書きしてハイライト
  p.stroke(203, 201, 203);
  p.strokeWeight(3);
  p.line(
    state.startX,
    state.pipeY - pipeH / 2,
    state.startX + state.pipeL,
    state.pipeY - pipeH / 2
  );
  p.line(
    state.startX,
    state.pipeY + pipeH / 2,
    state.startX + state.pipeL,
    state.pipeY + pipeH / 2
  );
  if (state.type === "closed") {
    p.line(
      state.startX + state.pipeL + 5 / 2,
      state.pipeY - pipeH / 2,
      state.startX + state.pipeL + 5 / 2,
      state.pipeY + pipeH / 2
    );
    drawLabels(p, "腹", "節");
  } else {
    drawLabels(p, "腹", "腹");
  }
}

/**
 * 管の左右端に腹/節ラベルを描画する。
 * @param {*} p - p5 インスタンス。
 * @param {string} left - 左端ラベル。
 * @param {string} right - 右端ラベル。
 */
function drawLabels(p, left, right) {
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER);
  p.text(left, state.startX, state.pipeY + 70);
  p.text(right, state.startX + state.pipeL, state.pipeY + 70);
}

/** 管中心から数式表示領域までの Y オフセット (px) */
const FORMULA_Y_OFFSET = 200;

/**
 * 波長・固有振動数の式をキャンバス下部に描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawFormula(p) {
  const formulaY = Math.min(state.pipeY + FORMULA_Y_OFFSET, p.height - 80);
  const x = 100;

  p.fill(0);
  p.noStroke();
  p.textAlign(p.LEFT);
  p.textSize(22);
  p.textFont("serif");

  if (state.type === "closed") {
    p.text(`波長: λ(m) = 4L / ${state.m_n}`, x, formulaY);
    p.text(
      `固有振動数: f(m) = (V / 4L) × ${state.m_n}`,
      x,
      formulaY + 45
    );
    p.textSize(14);
    p.textFont("sans-serif");
    p.fill(100);
    p.text("(m = 1, 3, 5, ...)", x + 250, formulaY);
  } else {
    p.text(`波長: λ(n) = 2L / ${state.m_n}`, x, formulaY);
    p.text(
      `固有振動数: f(n) = (V / 2L) × ${state.m_n}`,
      x,
      formulaY + 45
    );
    p.textSize(14);
    p.textFont("sans-serif");
    p.fill(100);
    p.text("(n = 1, 2, 3, ...)", x + 250, formulaY);
  }
}
