import { state } from "./state.js";
import {
  computeFreqConst,
  computeStandingWaveDisplacement
} from "./physics.js";

/** 仮想キャンバス幅 */
const CANVAS_WIDTH = 1000;
/** 定常波を表す色 */
const WAVE_COLOR = [0, 100, 255];
/** 管の輪郭線の太さ */
const PIPE_LINE_WEIGHT = 5;
/** 補足テキストのフォントサイズ */
const CAPTION_FONT_SIZE = 14;

export function updateWaveLayer(p) {
  const startX = (CANVAS_WIDTH - state.pipeL) / 2;
  state.waveLayer.clear();
  state.waveLayer.stroke(...WAVE_COLOR, 100);
  state.waveLayer.noFill();
  const freqConst = computeFreqConst(state.type, state.m_n, state.pipeL);
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    const phase = p.map(i, 0, steps - 1, -p.HALF_PI, p.HALF_PI);
    const currentAmp = state.Amp * p.sin(phase);
    state.waveLayer.beginShape();
    for (let x = 0; x <= state.pipeL; x++) {
      const yVal = computeStandingWaveDisplacement(currentAmp, freqConst, x, 1);
      state.waveLayer.vertex(startX + x, state.pipeY + yVal);
    }
    state.waveLayer.endShape();
  }
}

export function drawWave(p) {
  const startX = (CANVAS_WIDTH - state.pipeL) / 2;
  const freqConst = computeFreqConst(state.type, state.m_n, state.pipeL);
  p.noFill();
  p.stroke(...WAVE_COLOR);
  p.strokeWeight(2);
  p.beginShape();
  const currentSin = p.sin(state.time);
  for (let x = 0; x <= state.pipeL; x++) {
    const yVal = computeStandingWaveDisplacement(
      state.Amp,
      freqConst,
      x,
      currentSin
    );
    p.vertex(startX + x, state.pipeY + yVal);
  }
  p.endShape();
  if (state.isRunning) {
    state.time += 0.05;
  }
}

export function drawUIContext(p) {
  const pipeH = 100;
  const startX = (CANVAS_WIDTH - state.pipeL) / 2;
  const { type, m_n, pipeL, pipeY } = state;

  const dimY = pipeY + pipeH;
  p.stroke(150);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([5, 5]);
  p.line(startX, pipeY + pipeH / 2, startX, dimY + 10);
  p.line(startX + pipeL, pipeY + pipeH / 2, startX + pipeL, dimY + 10);
  p.drawingContext.setLineDash([]);
  p.stroke(0);
  p.line(startX, dimY, startX + pipeL, dimY);
  p.line(startX, dimY - 5, startX, dimY + 5);
  p.line(startX + pipeL, dimY - 5, startX + pipeL, dimY + 5);
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER);
  p.textSize(20);
  p.textFont("serif");
  p.text("L", startX + pipeL / 2, dimY + 25);

  p.stroke(0);
  p.strokeWeight(PIPE_LINE_WEIGHT);
  p.line(startX, pipeY - pipeH / 2, startX + pipeL, pipeY - pipeH / 2);
  p.line(startX, pipeY + pipeH / 2, startX + pipeL, pipeY + pipeH / 2);
  if (type === "closed") {
    p.line(
      startX + pipeL + PIPE_LINE_WEIGHT / 2,
      pipeY - pipeH / 2,
      startX + pipeL + PIPE_LINE_WEIGHT / 2,
      pipeY + pipeH / 2
    );
    drawLabels(p, "腹", "節", startX, pipeL, pipeY);
  } else {
    drawLabels(p, "腹", "腹", startX, pipeL, pipeY);
  }

  p.stroke(203, 201, 203);
  p.strokeWeight(3);
  p.line(startX, pipeY - pipeH / 2, startX + pipeL, pipeY - pipeH / 2);
  p.line(startX, pipeY + pipeH / 2, startX + pipeL, pipeY + pipeH / 2);
  if (type === "closed") {
    p.line(
      startX + pipeL + PIPE_LINE_WEIGHT / 2,
      pipeY - pipeH / 2,
      startX + pipeL + PIPE_LINE_WEIGHT / 2,
      pipeY + pipeH / 2
    );
    drawLabels(p, "腹", "節", startX, pipeL, pipeY);
  } else {
    drawLabels(p, "腹", "腹", startX, pipeL, pipeY);
  }
}

function drawLabels(p, left, right, x, l, y) {
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER);
  p.text(left, x, y + 70);
  p.text(right, x + l, y + 70);
}

export function drawFormula(p) {
  const { type, m_n } = state;
  const formulaY = 400;
  const centerX = 500;
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER);
  p.textSize(22);
  p.textFont("serif");
  if (type === "closed") {
    p.text(`波長: λ(m) = 4L / ${m_n}`, centerX, formulaY);
    p.text(`固有振動数: f(m) = (V / 4L) × ${m_n}`, centerX, formulaY + 45);
    p.textSize(CAPTION_FONT_SIZE);
    p.textFont("sans-serif");
    p.fill(100);
    p.text("(m = 1, 3, 5, ...)", centerX, formulaY + 70);
  } else {
    p.text(`波長: λ(n) = 2L / ${m_n}`, centerX, formulaY);
    p.text(`固有振動数: f(n) = (V / 2L) × ${m_n}`, centerX, formulaY + 45);
    p.textSize(CAPTION_FONT_SIZE);
    p.textFont("sans-serif");
    p.fill(100);
    p.text("(n = 1, 2, 3, ...)", centerX, formulaY + 70);
  }
}
