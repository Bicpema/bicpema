// function.ts は描画などのその他のメソッド管理専用のファイルです。

import type p5 from "p5";
import {
  V_W,
  PX_PER_METER,
  TRAIN_X,
  TRAIN_HALF_W,
  TIE_SPACING,
  MARKER_SPACING,
  COLOR
} from "./constants.js";
import { drawInfoPanel as drawInfoPanelComponent } from "../../../ts/components/info-panel.js";

/** 地面の高さに依存する、使い回すグラデーション */
const cache: { vh: number; ground: CanvasGradient | null } = {
  vh: -1,
  ground: null
};

/**
 * 高さが変わったときだけ地面のグラデーションを作り直す。
 * @param ctx - 2D描画コンテキスト
 * @param groundY - レール上端のy座標
 * @param vh - 仮想キャンバス高さ
 */
const ensureGradient = (
  ctx: CanvasRenderingContext2D,
  groundY: number,
  vh: number
) => {
  if (cache.vh === vh) return;
  cache.vh = vh;
  const ground = ctx.createLinearGradient(0, groundY + 18, 0, vh);
  ground.addColorStop(0, COLOR.groundLight);
  ground.addColorStop(1, "#ffffff");
  cache.ground = ground;
};

/**
 * 背景に流れる要素の画面上のx座標を、左端から順に列挙して処理する。
 * @param offset - 電車の移動距離（仮想ピクセル）
 * @param spacing - 要素の間隔（仮想ピクセル）
 * @param callback - 画面上のx座標と、その要素の位置 (m) を受け取る処理
 */
const forEachScrolling = (
  offset: number,
  spacing: number,
  callback: (screenX: number, meters: number) => void
) => {
  const first = Math.floor((offset - TRAIN_X) / spacing) * spacing;
  for (
    let world = first;
    world - offset + TRAIN_X < V_W + spacing;
    world += spacing
  ) {
    callback(world - offset + TRAIN_X, world / PX_PER_METER);
  }
};

/**
 * 背景・線路・地面・距離標を描画する。
 * @param p - p5インスタンス
 * @param groundY - レール上端のy座標（仮想ピクセル）
 * @param vh - 仮想キャンバス高さ
 * @param positionM - 電車の移動距離 (m)
 */
export const drawScenery = (
  p: p5,
  groundY: number,
  vh: number,
  positionM: number
) => {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ensureGradient(ctx, groundY, vh);
  const offset = positionM * PX_PER_METER;

  p.background(255);
  p.noStroke();

  // 地面（茶色の線から下へ向かって薄くなる）
  p.fill(COLOR.ground);
  p.rect(0, groundY + 12, V_W, 6);
  ctx.fillStyle = cache.ground!;
  ctx.fillRect(0, groundY + 18, V_W, vh - groundY - 18);

  // 枕木とレール（枕木の間は地面の色で埋める）
  p.fill(COLOR.groundLight);
  p.rect(0, groundY + 5, V_W, 7);
  p.fill(COLOR.sleeper);
  forEachScrolling(offset, TIE_SPACING, (x) => {
    p.rect(x - 6, groundY + 5, 12, 7);
  });
  p.fill(COLOR.rail);
  p.rect(0, groundY, V_W, 5);

  // 距離標（出発点を0 mとし、右を正、左を負とする）
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  forEachScrolling(offset, MARKER_SPACING, (x, meters) => {
    const m = Math.round(meters);
    const isOrigin = m === 0;
    p.fill(isOrigin ? COLOR.marker : COLOR.textMuted);
    p.rect(x - 1, groundY + 26, 2, isOrigin ? 14 : 9);
    p.text(`${m < 0 ? "−" : ""}${Math.abs(m)} m`, x, groundY + 52);
  });

  // 向きの目安
  p.fill(COLOR.textMuted);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("◀ 負の向き", 14, vh - 12);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text("正の向き ▶", V_W - 14, vh - 12);
  p.textAlign(p.CENTER, p.CENTER);
};

/**
 * 車輪を描画する。回転は電車の移動距離に連動する。
 * @param p - p5インスタンス
 * @param x - 中心x座標
 * @param y - 中心y座標
 * @param r - 半径
 * @param angle - 回転角 (rad)
 */
const drawWheel = (p: p5, x: number, y: number, r: number, angle: number) => {
  p.fill("#4b5563");
  p.stroke(COLOR.outline);
  p.strokeWeight(2);
  p.circle(x, y, r * 2);
  p.strokeWeight(1.5);
  p.stroke("#d1d5db");
  p.line(
    x + Math.cos(angle) * r * 0.65,
    y + Math.sin(angle) * r * 0.65,
    x - Math.cos(angle) * r * 0.65,
    y - Math.sin(angle) * r * 0.65
  );
  p.noStroke();
};

/**
 * 電車を描画する。
 * @param p - p5インスタンス
 * @param groundY - レール上端のy座標（仮想ピクセル）
 * @param positionM - 電車の移動距離 (m)。車輪の回転に使う
 */
export const drawTrain = (p: p5, groundY: number, positionM: number) => {
  const w = TRAIN_HALF_W * 2;
  const h = 58;
  const left = TRAIN_X - TRAIN_HALF_W;
  const top = groundY - 14 - h;
  const wheelR = 10;
  const angle = (positionM * PX_PER_METER) / wheelR;

  // 車輪
  for (const bx of [left + 32, left + 60, left + w - 60, left + w - 32]) {
    drawWheel(p, bx, groundY - wheelR, wheelR, angle);
  }

  // 車体（進行方向の右側を丸くする）
  p.fill(COLOR.train);
  p.stroke(COLOR.outline);
  p.strokeWeight(2);
  p.rect(left, top, w, h, 10, 32, 6, 6);

  // 帯
  p.noStroke();
  p.fill(255);
  p.rect(left + 2, top + h - 18, w - 4, 6);

  // 窓
  p.fill("#e6f1ff");
  p.stroke(COLOR.outline);
  p.strokeWeight(1.5);
  for (let i = 0; i < 5; i++) {
    p.rect(left + 16 + i * 38, top + 9, 28, 24, 4);
  }
  p.beginShape();
  p.vertex(left + w - 40, top + 9);
  p.vertex(left + w - 18, top + 9);
  p.vertex(left + w - 8, top + 33);
  p.vertex(left + w - 40, top + 33);
  p.endShape(p.CLOSE);

  // 前照灯
  p.noStroke();
  p.fill("#ffe27a");
  p.rect(left + w - 7, top + h - 32, 5, 9, 2);
};

/**
 * 加速度の向きと大きさを示す矢印を電車の上に描画する。
 * @param p - p5インスタンス
 * @param groundY - レール上端のy座標
 * @param acceleration - 加速度 (m/s²)
 */
export const drawAccelerationArrow = (
  p: p5,
  groundY: number,
  acceleration: number
) => {
  if (acceleration === 0) return;
  const y = groundY - 14 - 58 - 18;
  const length = acceleration * 16;
  const tip = TRAIN_X + length;
  const head = Math.sign(length) * 10;
  p.stroke(COLOR.text);
  p.strokeWeight(3);
  p.strokeCap(p.ROUND);
  p.line(TRAIN_X, y, tip - head, y);
  p.noStroke();
  p.fill(COLOR.text);
  p.triangle(tip, y, tip - head, y - 6, tip - head, y + 6);
  p.textSize(14);
  p.text("a", TRAIN_X, y - 14);
};

/**
 * 現在の速さ・経過時間・加速度を数値パネルで描画する。
 * @param p - p5インスタンス
 * @param velocity - 速さ (m/s)
 * @param elapsed - 経過時間 (s)
 * @param acceleration - 加速度 (m/s²)
 */
export const drawInfoPanel = (
  p: p5,
  velocity: number,
  elapsed: number,
  acceleration: number
) => {
  let state = "等速";
  let color: string | undefined;
  if (velocity === 0 && acceleration <= 0) {
    state = "停止中";
  } else if (acceleration > 0) {
    state = "加速中";
    color = COLOR.accelerating;
  } else if (acceleration < 0) {
    state = "減速中";
    color = COLOR.decelerating;
  }
  let sign = "";
  if (acceleration > 0) sign = "+";
  else if (acceleration < 0) sign = "−";

  drawInfoPanelComponent(
    p,
    [
      { label: "速さ v", value: velocity.toFixed(1), unit: "m/s" },
      { label: "経過時間 t", value: elapsed.toFixed(1), unit: "s" },
      {
        label: `加速度 a（${state}）`,
        value: `${sign}${Math.abs(acceleration).toFixed(1)}`,
        unit: "m/s²",
        color
      }
    ],
    { labelWidth: 130 }
  );
};
