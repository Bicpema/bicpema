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
  ARROW_COLOR
} from "./constants.js";

/**
 * 現在時刻における、つり合いの位置x0の媒質の変位を計算します。
 * @param p - p5インスタンス
 * @param x0 - 媒質のつり合いの位置
 * @returns 媒質の変位
 */
function displacement(p: p5, x0: number) {
  return computeWaveDisplacement(
    state.A,
    state.k,
    state.omega,
    x0,
    state.xStart,
    state.t
  );
}

/**
 * 始点から終点へ向かう矢印を描画します（長さが1未満の場合は描画しません）。
 * @param p - p5インスタンス
 * @param x1 - 始点のX座標
 * @param y1 - 始点のY座標
 * @param x2 - 終点のX座標
 * @param y2 - 終点のY座標
 */
function drawArrow(p: p5, x1: number, y1: number, x2: number, y2: number) {
  if (p.dist(x1, y1, x2, y2) < 1) return;
  p.stroke(...ARROW_COLOR);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);
  const angle = p.atan2(y2 - y1, x2 - x1);
  const s = 8;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.fill(...ARROW_COLOR);
  p.noStroke();
  p.triangle(0, 0, -s, s / 2, -s, -s / 2);
  p.pop();
}

/**
 * 矢印付きの横軸とタイトルを描画します。
 * @param p - p5インスタンス
 * @param title - 軸に表示するタイトル
 */
function drawAxis(p: p5, title: string) {
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

/**
 * 縦波の媒質の様子と、注目する媒質の変位を表す矢印を描画します。
 * @param p - p5インスタンス
 */
function drawLongitudinal(p: p5) {
  p.push();
  p.translate(0, p.height / 3);
  drawAxis(p, "縦波");
  for (const pt of state.particles) {
    const dx = displacement(p, pt.x0);
    const x = pt.x0 + dx;
    p.stroke(180);
    p.line(x, -50, x, 50);
    p.fill(...WAVE_COLOR);
    p.noStroke();
    p.circle(x, 0, PARTICLE_SIZE);
  }
  const fp = state.particles[state.focusIndex];
  const fdx = displacement(p, fp.x0);
  const xNow = fp.x0 + fdx;
  p.fill(...FOCUS_ORIGIN_COLOR);
  p.circle(fp.x0, 0, FOCUS_PARTICLE_SIZE);
  p.fill(...WAVE_COLOR);
  p.circle(xNow, 0, FOCUS_PARTICLE_SIZE);
  const arrivalTime = computeArrivalTime(
    state.k,
    state.omega,
    fp.x0,
    state.xStart
  );
  if (state.t > arrivalTime) drawArrow(p, fp.x0, 0, xNow, 0);
  p.pop();
}

/**
 * 縦波の変位を横波に変換した波形と、注目する媒質の変位を表す矢印を描画します。
 * @param p - p5インスタンス
 */
function drawConvertedTransverse(p: p5) {
  p.push();
  p.translate(0, (p.height * 2) / 3);
  drawAxis(p, "横波");
  p.noFill();
  p.stroke(...WAVE_COLOR);
  p.strokeWeight(1);
  p.beginShape();
  for (let x = state.xStart; x < p.width - WAVE_ORIGIN_X; x++) {
    const dy = displacement(p, x);
    p.vertex(x, -dy);
  }
  p.endShape();
  for (const pt of state.particles) {
    const dy = displacement(p, pt.x0);
    p.fill(...WAVE_COLOR);
    p.noStroke();
    p.circle(pt.x0, -dy, PARTICLE_SIZE);
    p.stroke(...WAVE_COLOR, 100);
    p.line(pt.x0, 0, pt.x0, -dy);
  }
  const fp = state.particles[state.focusIndex];
  const fdy = displacement(p, fp.x0);
  p.noStroke();
  p.fill(...FOCUS_ORIGIN_COLOR);
  p.circle(fp.x0, 0, FOCUS_PARTICLE_SIZE);
  p.fill(...WAVE_COLOR);
  p.circle(fp.x0, -fdy, FOCUS_PARTICLE_SIZE);
  const arrivalTime = computeArrivalTime(
    state.k,
    state.omega,
    fp.x0,
    state.xStart
  );
  if (state.t > arrivalTime) drawArrow(p, fp.x0, 0, fp.x0, -fdy);
  p.pop();
}

/**
 * 速度スライダーに応じてフレームレートを設定し、時刻を進めて縦波と横波を描画します。
 * @param p - p5インスタンス
 */
export function drawSimulation(p: p5) {
  const speedSlider = document.getElementById(
    "speedSlider"
  ) as HTMLInputElement | null;
  if (speedSlider) p.frameRate(parseInt(speedSlider.value, 10));
  p.background(255);
  if (state.running) state.t += 1;
  drawLongitudinal(p);
  drawConvertedTransverse(p);
}
