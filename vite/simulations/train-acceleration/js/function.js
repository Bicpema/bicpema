// function.js はその他のメソッド管理専用のファイルです。

import { state } from "./state.js";

/** 電車の半幅（仮想ピクセル） */
export const TRAIN_HALF_W = 100;

/**
 * 線路（レールと枕木）を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} groundY 地面上部のy座標（仮想ピクセル）
 * @param {number} trackOffset 線路スクロールオフセット（仮想ピクセル）
 * @param {number} vw 仮想キャンバス幅
 */
export const drawTrack = (p, groundY, trackOffset, vw) => {
  const TIE_SPACING = 40;
  const TIE_W = 30;
  const TIE_H = 8;
  const RAIL_H = 6;
  const RAIL_Y1 = groundY + 4;
  const RAIL_Y2 = groundY + 16;

  // 枕木
  p.fill(120, 80, 40);
  p.noStroke();
  // trackOffset が負になった場合も正の剰余に正規化し、枕木が途切れないようにする
  const offset = ((trackOffset % TIE_SPACING) + TIE_SPACING) % TIE_SPACING;
  for (let x = -TIE_SPACING + (TIE_SPACING - offset); x < vw + TIE_SPACING; x += TIE_SPACING) {
    p.rect(x - TIE_W / 2, groundY, TIE_W, TIE_H);
  }

  // レール（上）
  p.fill(160);
  p.noStroke();
  p.rect(0, RAIL_Y1, vw, RAIL_H);

  // レール（下）
  p.rect(0, RAIL_Y2, vw, RAIL_H);
};

/**
 * 電車を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} trainX 電車の中心x座標（仮想ピクセル）
 * @param {number} groundY 地面上部のy座標（仮想ピクセル）
 */
export const drawTrain = (p, trainX, groundY) => {
  const BODY_W = TRAIN_HALF_W * 2;
  const BODY_H = 60;
  const WHEEL_R = 14;
  const WHEEL_OFFSET = 30;
  const BODY_Y = groundY - BODY_H - WHEEL_R * 2;
  const ROOF_H = 14;
  const WIN_W = 22;
  const WIN_H = 18;

  // 車体
  p.fill(30, 100, 200);
  p.stroke(20, 60, 140);
  p.strokeWeight(2);
  p.rect(trainX - BODY_W / 2, BODY_Y, BODY_W, BODY_H, 4, 4, 0, 0);

  // 屋根
  p.fill(20, 70, 160);
  p.noStroke();
  p.rect(trainX - BODY_W / 2, BODY_Y - ROOF_H, BODY_W, ROOF_H, 6, 6, 0, 0);

  // 窓
  p.fill(200, 230, 255);
  p.noStroke();
  const winY = BODY_Y + 10;
  const numWindows = 4;
  const winSpacing = BODY_W / (numWindows + 1);
  for (let i = 1; i <= numWindows; i++) {
    p.rect(trainX - BODY_W / 2 + winSpacing * i - WIN_W / 2, winY, WIN_W, WIN_H, 3);
  }

  // 前面ライト（右側）
  p.fill(255, 255, 150);
  p.noStroke();
  p.ellipse(trainX + BODY_W / 2 - 6, BODY_Y + BODY_H - 10, 10, 8);

  // 後面ライト（左側）
  p.fill(255, 80, 80);
  p.noStroke();
  p.ellipse(trainX - BODY_W / 2 + 6, BODY_Y + BODY_H - 10, 10, 8);

  // 車輪（左）
  p.fill(60);
  p.stroke(40);
  p.strokeWeight(2);
  p.circle(trainX - BODY_W / 2 + WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 2);
  p.fill(100);
  p.noStroke();
  p.circle(trainX - BODY_W / 2 + WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 0.5);

  // 車輪（右）
  p.fill(60);
  p.stroke(40);
  p.strokeWeight(2);
  p.circle(trainX + BODY_W / 2 - WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 2);
  p.fill(100);
  p.noStroke();
  p.circle(trainX + BODY_W / 2 - WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 0.5);
};

/**
 * 速さと経過時間の情報パネルを描画する。
 * @param {*} p p5インスタンス。
 * @param {number} v 速さ (m/s)
 * @param {number} t 経過時間 (s)
 * @param {number} a 加速度 (m/s²)
 */
export const drawInfoPanel = (p, v, t, a) => {
  // パネル背景
  p.fill(0, 0, 0, 180);
  p.stroke(255, 255, 255, 60);
  p.strokeWeight(1);
  p.rect(16, 16, 250, 100, 8);

  p.fill(255);
  p.noStroke();
  if (state.font) p.textFont(state.font);
  p.textAlign(p.LEFT, p.TOP);

  p.textSize(22);
  p.text(`速さ  v = ${v.toFixed(2)} m/s`, 30, 26);
  p.text(`時間  t = ${t.toFixed(1)} s`, 30, 58);

  p.textSize(16);
  p.fill(200);
  const aDir = a >= 0 ? "+" : "";
  p.text(`加速度 a = ${aDir}${a.toFixed(1)} m/s²`, 30, 94);
};
