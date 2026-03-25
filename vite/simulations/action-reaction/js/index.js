// index.js はメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";
import { state } from "./state.js";
import {
  FPS,
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit,
} from "./init.js";

/** キャンバスの論理幅 */
const W = 1000;
/** キャンバスの論理高さ（16:9） */
const H = (W * 9) / 16;
/** 地面のy座標（論理ピクセル） */
const GROUND_Y = 420;
/** 1メートルあたりのピクセル数 */
const PIXELS_PER_METER = 150;

const sketch = (p) => {
  const canvasController = new BicpemaCanvasController(true, false, 1.0, 1.0);

  p.setup = () => {
    settingInit(p, canvasController);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
    // 地面画像を非同期で読み込む（失敗してもシミュレーションは動作する）
    p.loadImage(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810",
      (img) => {
        state.groundImg = img;
      },
      () => {}
    );
    // フォントを非同期で読み込む（失敗してもシミュレーションは動作する）
    p.loadFont(
      "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
      (f) => {
        state.font = f;
      },
      () => {}
    );
  };

  p.draw = () => {
    p.scale(p.width / W);
    p.background(30, 30, 40);

    // 物理シミュレーション更新
    if (state.phase === "releasing") {
      const F = state.spring.getForce(
        state.blockA,
        state.blockB,
        PIXELS_PER_METER
      );
      if (F > 0) {
        state.blockA.force = -F;
        state.blockB.force = +F;
      } else {
        state.blockA.force = 0;
        state.blockB.force = 0;
        state.phase = "free";
      }
      state.blockA.update(1 / FPS, PIXELS_PER_METER);
      state.blockB.update(1 / FPS, PIXELS_PER_METER);
    } else if (state.phase === "free") {
      state.blockA.force = 0;
      state.blockB.force = 0;
      state.blockA.update(1 / FPS, PIXELS_PER_METER);
      state.blockB.update(1 / FPS, PIXELS_PER_METER);
    }

    // 地面描画
    if (state.groundImg) {
      p.image(state.groundImg, 0, GROUND_Y, W, H - GROUND_Y);
    } else {
      p.fill(80, 60, 40);
      p.noStroke();
      p.rect(0, GROUND_Y, W, H - GROUND_Y);
    }

    // レール（地面ライン）
    p.stroke(180);
    p.strokeWeight(3);
    p.line(0, GROUND_Y, W, GROUND_Y);

    // ばね描画（ready・releasing フェーズのみ）
    if (state.phase !== "free") {
      state.spring.display(p, state.blockA, state.blockB, GROUND_Y);
    }

    // ブロック描画
    state.blockA.display(p, GROUND_Y, state.font);
    state.blockB.display(p, GROUND_Y, state.font);

    // 力の矢印描画（releasing フェーズで力が働いているとき）
    if (state.phase === "releasing") {
      const F = Math.abs(state.blockA.force);
      if (F > 0) {
        const arrowY = GROUND_Y - state.blockA.H / 2;
        drawForceArrow(p, state.blockA.leftEdge, arrowY, F, true);
        drawForceArrow(p, state.blockB.rightEdge, arrowY, F, false);
      }
    }

    // 情報パネル描画
    drawInfoPanel(p);

    // 準備状態のヒント描画
    if (state.phase === "ready") {
      drawReadyHint(p);
    }
  };

  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

/**
 * 力の矢印を描画する
 * @param {*} p p5インスタンス
 * @param {number} originX 矢印の起点x（左矢印なら左端、右矢印なら右端）
 * @param {number} y 矢印のy座標（論理ピクセル）
 * @param {number} F 力の大きさ (N)
 * @param {boolean} isLeft 左向き矢印か
 */
function drawForceArrow(p, originX, y, F, isLeft) {
  const arrowLen = Math.min(F * 6, 220);
  if (arrowLen < 5) return;

  const arrowSize = 16;
  const r = isLeft ? 220 : 80;
  const g = isLeft ? 80 : 150;
  const b = isLeft ? 80 : 220;

  const tipX = isLeft ? originX - arrowLen : originX + arrowLen;
  const lineEndX = isLeft ? tipX + arrowSize : tipX - arrowSize;

  p.push();
  p.stroke(r, g, b);
  p.strokeWeight(5);
  p.line(originX, y, lineEndX, y);

  p.fill(r, g, b);
  p.noStroke();
  if (isLeft) {
    p.triangle(
      tipX,
      y,
      tipX + arrowSize,
      y - arrowSize / 2,
      tipX + arrowSize,
      y + arrowSize / 2
    );
  } else {
    p.triangle(
      tipX,
      y,
      tipX - arrowSize,
      y - arrowSize / 2,
      tipX - arrowSize,
      y + arrowSize / 2
    );
  }

  // 力のラベル
  p.fill(r, g, b);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textSize(20);
  p.textAlign(p.CENTER, p.BOTTOM);
  const label = isLeft ? "BがAに加える力" : "AがBに加える力";
  const labelX = (originX + tipX) / 2;
  p.text(label, labelX, y - 10);
  p.pop();
}

/**
 * 情報パネルを描画する
 * @param {*} p p5インスタンス
 */
function drawInfoPanel(p) {
  const F = Math.abs(state.blockA.force);
  const vA = state.blockA.velocity;
  const vB = state.blockB.velocity;
  const pA = state.blockA.mass * vA;
  const pB = state.blockB.mass * vB;

  p.fill(0, 0, 0, 190);
  p.stroke(255, 255, 255, 50);
  p.strokeWeight(1);
  p.rect(20, 20, 390, 195, 10);

  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textAlign(p.LEFT, p.TOP);

  // 力の大きさ（作用 = 反作用）
  p.fill(255);
  p.textSize(22);
  p.text(`力の大きさ: ${F.toFixed(2)} N`, 40, 34);
  p.fill(180);
  p.textSize(17);
  p.text(`（作用力 = 反作用力）`, 40, 62);

  // 速度
  p.textSize(20);
  p.fill(220, 100, 100);
  p.text(`v_A = ${vA.toFixed(2)} m/s`, 40, 90);
  p.fill(80, 150, 220);
  p.text(`v_B = ${vB.toFixed(2)} m/s`, 230, 90);

  // 運動量
  p.textSize(18);
  p.fill(220, 100, 100);
  p.text(`p_A = ${pA.toFixed(2)} kg·m/s`, 40, 122);
  p.fill(80, 150, 220);
  p.text(`p_B = ${pB.toFixed(2)} kg·m/s`, 230, 122);

  // 運動量の和（保存則）
  p.fill(200);
  p.textSize(18);
  p.text(`p_A + p_B = ${(pA + pB).toFixed(2)} kg·m/s`, 40, 154);

  // フェーズ表示
  const phaseLabel =
    state.phase === "ready"
      ? "準備中"
      : state.phase === "releasing"
        ? "ばね放出中"
        : "等速運動中";
  p.fill(160);
  p.textSize(16);
  p.text(phaseLabel, 40, 178);
}

/**
 * 準備状態のヒントを描画する
 * @param {*} p p5インスタンス
 */
function drawReadyHint(p) {
  p.push();
  p.fill(255, 255, 255, 200);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textSize(22);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("「開始」ボタンを押してばねを放してください", W / 2, GROUND_Y - 150);
  p.pop();
}

new p5(sketch);
