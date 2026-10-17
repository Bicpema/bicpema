// function.ts は描画などのその他のメソッド管理専用のファイルです。

import type p5 from "p5";
import {
  V_W,
  PX_PER_METER,
  TRAIN_X,
  TRAIN_HALF_W,
  TRAIN_BODY_COLOR_RGB,
  TIE_SPACING,
  MARKER_SPACING
} from "./constants.js";

/**
 * 背景に流れる要素（枕木・距離標）の、画面上のx座標を左端から順に列挙して処理する。
 * 電車の移動距離 offset の分だけ、背景は左へ流れる。
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
 * 空・地面・線路・距離標を描画する。
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
  const offset = positionM * PX_PER_METER;
  p.background(135, 206, 235);
  p.noStroke();
  p.fill(80, 130, 60);
  p.rect(0, groundY + 28, V_W, vh - groundY - 28);

  // 枕木
  p.fill(120, 80, 40);
  forEachScrolling(offset, TIE_SPACING, (x) => {
    p.rect(x - 15, groundY, 30, 8);
  });
  // レール
  p.fill(160);
  p.rect(0, groundY + 4, V_W, 6);
  p.rect(0, groundY + 16, V_W, 6);

  // 距離標（出発点を0 mとし、右を正、左を負とする）
  p.textSize(14);
  forEachScrolling(offset, MARKER_SPACING, (x, meters) => {
    p.fill(255);
    p.rect(x - 1.5, groundY + 30, 3, 14);
    p.text(`${Math.round(meters)} m`, x, groundY + 56);
  });
};

/**
 * 電車を描画する。
 * @param p - p5インスタンス
 * @param groundY - レール上端のy座標（仮想ピクセル）
 */
export const drawTrain = (p: p5, groundY: number) => {
  const bodyW = TRAIN_HALF_W * 2;
  const bodyH = 60;
  const wheelR = 14;
  const bodyY = groundY - bodyH - wheelR * 2;
  const left = TRAIN_X - TRAIN_HALF_W;

  p.fill(...TRAIN_BODY_COLOR_RGB);
  p.stroke(20, 60, 140);
  p.strokeWeight(2);
  p.rect(left, bodyY, bodyW, bodyH, 4, 4, 0, 0);

  p.noStroke();
  p.fill(200, 230, 255);
  for (let i = 1; i <= 4; i++) {
    p.rect(left + (bodyW / 5) * i - 11, bodyY + 10, 22, 18, 3);
  }
  // 進行方向（右）を前照灯で示す
  p.fill(255, 255, 150);
  p.ellipse(left + bodyW - 6, bodyY + bodyH - 10, 10, 8);

  p.fill(60);
  p.stroke(40);
  p.strokeWeight(2);
  p.circle(left + 30, groundY + wheelR - 2, wheelR * 2);
  p.circle(left + bodyW - 30, groundY + wheelR - 2, wheelR * 2);
  p.noStroke();
};

/**
 * 現在の速さ・経過時間・加速度と、左右の向きの目安を描画する。
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
  p.fill(0, 0, 0, 140);
  p.rect(10, 10, 280, 96, 8);
  p.fill(255);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(22);
  p.text(`速さ v = ${velocity.toFixed(1)} m/s`, 24, 34);
  p.text(`経過時間 t = ${elapsed.toFixed(1)} s`, 24, 62);
  p.textSize(18);
  p.text(
    `加速度 a = ${acceleration > 0 ? "+" : ""}${acceleration.toFixed(1)} m/s²`,
    24,
    90
  );
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  p.fill(0, 0, 0, 160);
  p.text("← 負の向き　　正の向き →", V_W / 2, 20);
};
