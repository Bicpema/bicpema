// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from "./state.js";

// 仮想キャンバス幅 (scale(p.width/1000) で使用)
const VIRTUAL_W = 1000;

// 仮想キャンバス高 (16:9)
const VIRTUAL_H = 562;

// シリンダーの定数 (仮想座標系)
const CYL_LEFT = 183;
const CYL_TOP = 134;
const CYL_WIDTH = 634;
const CYL_HEIGHT = 220;
const CYL_CENTER_Y = 244;
const CYL_DEPTH = 49;

// 温度・体積変化の単位
const DT_UNIT = 0.3;

/**
 * シミュレーションを描画する。
 * @param {object} p - p5 インスタンス
 */
export function drawSimulation(p) {
  p.push();
  p.scale(p.width / VIRTUAL_W);

  // ピストンを目標位置に向けてスムーズに移動
  state.pistonX = p.lerp(state.pistonX, state.pistonX_target, 0.05);
  state.gasWidth = state.pistonX - CYL_LEFT;

  p.background(255);

  // 下部UIエリアの背景
  p.fill(100, 200, 255, 100);
  p.noStroke();
  p.rect(0, (VIRTUAL_H * 3) / 4, VIRTUAL_W, VIRTUAL_H / 4);

  drawUI(p);
  drawCylinder(p);
  drawGas(p);
  drawPiston(p);

  state.molecules.forEach((m) => m.move());
  state.molecules.forEach((m) => m.draw(p));

  drawArrows(p);
  drawFormula(p);
  drawFlame(p);

  p.pop();
}

/**
 * 下部 UI（熱量ラベルと結果テキスト）を描画する。
 * @param {object} p - p5 インスタンス
 */
function drawUI(p) {
  p.fill(255, 0, 0);
  p.noStroke();
  p.textSize(32);
  p.text("加えた熱量 Q", 220, (VIRTUAL_H * 3) / 4 + 75);

  p.fill(0);
  p.textSize(29);
  p.text("<結果>", 500, (VIRTUAL_H * 3) / 4 + 75);
  p.text(`Q = ${state.Q}Q`, 600, (VIRTUAL_H * 3) / 4 + 40);
  p.text(`Win = -${state.W}Wout`, 600, (VIRTUAL_H * 3) / 4 + 75);
  p.text(`ΔU = ${state.dU}ΔT`, 600, (VIRTUAL_H * 3) / 4 + 110);
}

/**
 * シリンダーを3D風に描画する。
 * @param {object} p - p5 インスタンス
 */
function drawCylinder(p) {
  p.noStroke();
  p.fill(230);
  p.rect(CYL_LEFT, CYL_TOP, CYL_WIDTH, CYL_HEIGHT);
  p.ellipse(CYL_LEFT, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
  p.ellipse(CYL_LEFT + CYL_WIDTH, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);

  p.stroke(0);
  p.noFill();
  p.rect(CYL_LEFT, CYL_TOP, CYL_WIDTH, CYL_HEIGHT);
  p.ellipse(CYL_LEFT, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
  p.ellipse(CYL_LEFT + CYL_WIDTH, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
}

/**
 * 気体を3D風に描画する。
 * @param {object} p - p5 インスタンス
 */
function drawGas(p) {
  const col = p.map(state.T, state.T0, state.T0 + 5 * DT_UNIT, 180, 255);
  p.noStroke();
  p.fill(col, 160, 120, 180);
  p.rect(CYL_LEFT, CYL_TOP, state.gasWidth, CYL_HEIGHT);
  p.ellipse(CYL_LEFT, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
  p.ellipse(CYL_LEFT + state.gasWidth, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
}

/**
 * ピストンを3D風に描画する。
 * @param {object} p - p5 インスタンス
 */
function drawPiston(p) {
  p.fill(180);
  p.stroke(0);
  p.strokeWeight(1);
  p.ellipse(state.pistonX, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);

  // 初期位置のゴースト表示
  p.push();
  p.noFill();
  p.strokeWeight(2);
  p.stroke(0, 100);
  p.ellipse(512, CYL_CENTER_Y, CYL_DEPTH, CYL_HEIGHT);
  p.pop();
}

/**
 * 仕事・内部エネルギーの矢印を描画する。
 * @param {object} p - p5 インスタンス
 */
function drawArrows(p) {
  p.strokeWeight(3);

  // 仕事の矢印（ピストン右向き）
  if (state.step > 0) {
    p.stroke(0);
    p.line(state.pistonX + 37, CYL_CENTER_Y, state.pistonX + 110, CYL_CENTER_Y);
    p.triangle(
      state.pistonX + 110,
      CYL_CENTER_Y,
      state.pistonX + 91,
      CYL_CENTER_Y - 12,
      state.pistonX + 91,
      CYL_CENTER_Y + 12
    );
    p.noStroke();
    p.fill(0);
    p.textSize(24);
    p.text(`${state.W}Wout`, state.pistonX + 43, CYL_CENTER_Y - 24);
  }

  // 内部エネルギーの矢印（上向き）
  if (state.step > 0) {
    p.stroke(150, 80, 0);
    p.line(317, 293, 317, 195);
    p.triangle(317, 183, 305, 207, 329, 207);
    p.noStroke();
    p.fill(120, 80, 0);
    p.textSize(24);
    p.text("ΔU", 335, CYL_CENTER_Y);
  }
}

/**
 * 熱力学第一法則の式を描画する。
 * @param {object} p - p5 インスタンス
 */
function drawFormula(p) {
  p.fill(100, 200, 255, 100);
  p.noStroke();
  p.rect(0, 29, VIRTUAL_W, 49);
  p.fill(0);
  p.textSize(39);
  p.text("ΔU = Q + Win  （定圧膨張）", 305, 67);
}

/**
 * 炎の画像を描画する（Q > 0 のとき）。
 * @param {object} p - p5 インスタンス
 */
function drawFlame(p) {
  if (state.step > 0 && state.img_flame) {
    p.image(state.img_flame, 207, 329);
  }
}
