// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state } from "./state.js";
import { groundLevel, BALL_START_X, BALL_RADIUS_DIVISOR } from "./init.js";
import { Ball } from "./class.js";

/**
 * canvasサイズに依存するレイアウト値の再計算を行う
 * （リサイズ時にも呼ぶため、シミュレーションの状態は変更しない）。
 * @param {*} p p5インスタンス
 */
export function updateLayout(p) {
  state.radi = p.width / BALL_RADIUS_DIVISOR;
  if (state.pg) {
    state.pg.resizeCanvas(p.width, p.height);
  } else {
    state.pg = p.createGraphics(p.width, p.height);
  }
  p.textSize(p.width / 100);
  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * シミュレーションの状態と赤玉・青玉を初期値にリセットする
 * （初回セットアップ・リセットボタン押下時に呼ぶ）。
 * @param {*} p p5インスタンス
 */
export function resetSimulationState(p) {
  updateLayout(p);
  state.clickedCount = false;
  state.resetCount = true;
  state.count = 0;
  state.b1 = new Ball(
    BALL_START_X,
    groundLevel(p) - state.radi - state.heightButton1.value(),
    state.speedButton1.value(),
    state.angleButton1.value(),
    state.weightButton1.value(),
    groundLevel(p) - state.radi - state.heightButton1.value(),
    state.konstantButton1.value(),
    1
  );
  state.b2 = new Ball(
    BALL_START_X,
    groundLevel(p) - state.radi - state.heightButton2.value(),
    state.speedButton2.value(),
    state.angleButton2.value(),
    state.weightButton2.value(),
    groundLevel(p) - state.radi - state.heightButton2.value(),
    state.konstantButton2.value(),
    2
  );
}

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  if (state.clickedCount === true) {
    state.count += 10;
  } else if (state.resetCount === true) {
    state.b1 = new Ball(
      BALL_START_X,
      groundLevel(p) - state.radi,
      state.speedButton1.value(),
      state.angleButton1.value(),
      state.weightButton1.value(),
      groundLevel(p) - state.radi - state.heightButton1.value(),
      state.konstantButton1.value(),
      1
    );
    state.b2 = new Ball(
      BALL_START_X,
      groundLevel(p) - state.radi,
      state.speedButton2.value(),
      state.angleButton2.value(),
      state.weightButton2.value(),
      groundLevel(p) - state.radi - state.heightButton2.value(),
      state.konstantButton2.value(),
      2
    );
  }
  backGround(p);
  state.b1._draw(p);
  state.b2._draw(p);
}

/**
 * 背景・地面・グリッド・軌跡を描画する。
 * @param {*} p p5インスタンス
 */
function backGround(p) {
  p.background(255);
  if (state.clickedCount === true) {
    state.pg.fill(255, 0, 0);
    state.pg.ellipse(state.b1.posx, state.b1.posy, 5, 5);
    state.pg.fill(0, 0, 255);
    state.pg.ellipse(state.b2.posx, state.b2.posy, 5, 5);
  }
  if (state.resetCount === true) {
    state.pg.fill(255);
    state.pg.rect(0, 0, p.width, p.height);
  }
  p.image(state.pg, 0, 0);
  p.stroke(0, 100);
  for (let i = 0; i < groundLevel(p); i += 10) {
    if (i % 100 === 0) {
      p.strokeWeight(2);
    } else {
      p.strokeWeight(1);
    }
    p.line(
      BALL_START_X,
      groundLevel(p) - state.radi - i,
      p.width,
      groundLevel(p) - state.radi - i
    );
  }
  for (let i = 0; i < p.width; i += 10) {
    if (i % 100 === 0) {
      p.strokeWeight(2);
    } else {
      p.strokeWeight(1);
    }
    p.line(i + BALL_START_X, 0, i + BALL_START_X, groundLevel(p) - state.radi);
  }
  p.fill(100, 150);
  p.rect(0, p.height - p.height / 10, p.width, p.height / 10);
  p.fill(0);
  for (let i = 0; i < p.width - BALL_START_X; i += 100) {
    p.text(i, BALL_START_X + i, groundLevel(p) + 10);
  }
  for (let i = 0; i < groundLevel(p); i += 100) {
    p.text(i, 20, groundLevel(p) - i - state.radi);
  }
}
