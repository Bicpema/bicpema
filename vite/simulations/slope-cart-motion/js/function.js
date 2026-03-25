// function.js - 描画処理専用のファイルです。

import { state } from "./state.js";

// ============================================================
// レイアウト定数（仮想座標系: 1000×562）
// ============================================================

/** 仮想キャンバスの幅 */
export const V_W = 1000;
/** 仮想キャンバスの高さ */
export const V_H = 562;
/** 物理座標→ピクセル変換スケール（1m = 400px） */
export const PX_PER_M = 400;
/** 斜面の物理的長さ (m) */
export const SLOPE_LENGTH_M = 1.1;

// 斜面の左端（上端・スタート側）のx座標（斜面長さを水平中央揃え）
/** 斜面左端のx座標 */
const SLOPE_LX = Math.round((V_W - SLOPE_LENGTH_M * PX_PER_M) / 2);
/** 地面のy座標 */
const GROUND_Y = 390;

// 記録テープ表示領域
/** 記録テープ中心のy座標 */
const TAPE_CY = 480;
/** 記録テープの高さ */
const TAPE_H = 55;
/** テープの目盛り原点x（斜面左端と一致させる） */
const TAPE_ORIGIN_X = SLOPE_LX;
/** 記録テープの左端x座標 */
const TAPE_LX = TAPE_ORIGIN_X - 20;
/** 記録テープの右端x座標（斜面長さと同じ縮尺） */
const TAPE_RX = TAPE_ORIGIN_X + SLOPE_LENGTH_M * PX_PER_M;

// ============================================================
// 描画ヘルパー関数
// ============================================================

/**
 * 指定角度に対する斜面左端（上端）座標を返す。
 * 右端が常に GROUND_Y に接するよう左端 Y を逆算する。
 * @param {number} angleDeg - 傾斜角 (度)
 * @returns {{x: number, y: number}}
 */
function getSlopeLeft(angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const lenPx = SLOPE_LENGTH_M * PX_PER_M;
  return {
    x: SLOPE_LX,
    y: GROUND_Y - lenPx * Math.sin(theta),
  };
}

/**
 * 指定角度に対する斜面右端（下端）座標を返す。
 * 常に GROUND_Y に接する。
 * @param {number} angleDeg - 傾斜角 (度)
 * @returns {{x: number, y: number}}
 */
function getSlopeRight(angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const lenPx = SLOPE_LENGTH_M * PX_PER_M;
  return {
    x: SLOPE_LX + lenPx * Math.cos(theta),
    y: GROUND_Y,
  };
}

/**
 * 斜面を描画する。
 * @param {*} p - p5インスタンス
 * @param {number} angleDeg - 傾斜角 (度)
 */
export function drawSlope(p, angleDeg) {
  const left = getSlopeLeft(angleDeg);
  const right = getSlopeRight(angleDeg);

  // 支柱（左上端の支え構造）
  drawSupportStructure(p, left.x, left.y);

  // 斜面の板（太い線）
  p.stroke(60);
  p.strokeWeight(8);
  p.line(left.x, left.y, right.x, right.y);

  // 板の上面ハイライト
  p.stroke(140);
  p.strokeWeight(2);
  p.line(left.x, left.y, right.x, right.y);

  // 右端（ゴール位置）のストッパー
  drawStopper(p, right.x, right.y, angleDeg);

  // 地面画像
  drawGround(p, left.x - 80, right.x + 150);

  // 方向矢印（右端）
  drawDirectionArrow(p, right.x, right.y, angleDeg);
}

/**
 * 地面画像をタイル状に描画する。
 * @param {*} p - p5インスタンス
 * @param {number} xStart - 開始x座標
 * @param {number} xEnd - 終了x座標
 */
function drawGround(p, xStart, xEnd) {
  if (!state.groundImage) {
    // フォールバック: 単純なライン
    p.stroke(110);
    p.strokeWeight(2);
    p.line(xStart, GROUND_Y, xEnd, GROUND_Y);
    return;
  }
  const tileH = 45;
  const tileW = state.groundImage.width > 0 ? state.groundImage.width : 64;
  p.imageMode(p.CORNER);
  for (let x = xStart; x < xEnd; x += tileW) {
    const w = Math.min(tileW, xEnd - x);
    p.image(state.groundImage, x, GROUND_Y, w, tileH);
  }
  p.imageMode(p.CENTER);
}

/**
 * 左上端の支持台を描画する。
 * @param {*} p - p5インスタンス
 * @param {number} px - 支持台の中心x座標
 * @param {number} py - 支持台の頂点y座標
 */
function drawSupportStructure(p, px, py) {
  p.stroke(70);
  p.strokeWeight(4);

  // 左脚
  p.line(px, py, px - 40, GROUND_Y);
  // 右脚
  p.line(px, py, px + 40, GROUND_Y);
  // 中間横架（クロスバー）
  const crossY = py + (GROUND_Y - py) * 0.5;
  p.line(px - 22, crossY, px + 22, crossY);
}

/**
 * 斜面右端（ゴール側）のストッパーを描画する。
 * @param {*} p - p5インスタンス
 * @param {number} tx - 右端x座標
 * @param {number} ty - 右端y座標
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawStopper(p, tx, ty, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  // 斜面法線方向（上側）: 左上→右下の斜面に対して上向き法線 = (sin(theta), -cos(theta))
  const nx = Math.sin(theta);
  const ny = -Math.cos(theta);

  p.stroke(70);
  p.strokeWeight(5);
  p.line(tx, ty, tx + nx * 28, ty + ny * 28);
}

/**
 * 方向矢印を描画する（斜面右端）。
 * @param {*} p - p5インスタンス
 * @param {number} rx - 右端x座標
 * @param {number} ry - 右端y座標
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawDirectionArrow(p, rx, ry, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(theta);
  const dy = Math.sin(theta);
  const arrowLen = 50;

  const x1 = rx + dx * 15;
  const y1 = ry + dy * 15;
  const x2 = rx + dx * (15 + arrowLen);
  const y2 = ry + dy * (15 + arrowLen);

  p.stroke(80);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);

  // 矢印頭
  const ah = 12;
  const ax = x2 - dx * ah;
  const ay = y2 - dy * ah;
  p.line(x2, y2, ax - dy * (ah / 2), ay + dx * (ah / 2));
  p.line(x2, y2, ax + dy * (ah / 2), ay - dx * (ah / 2));
}

/**
 * 斜面上の台車を描画する。
 * @param {*} p - p5インスタンス
 * @param {SlopeCart} cart - 台車オブジェクト
 * @param {number} angleDeg - 傾斜角 (度)
 */
export function drawCartOnSlope(p, cart, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const left = getSlopeLeft(angleDeg);

  // 台車の斜面上での位置計算
  // s=0 のとき左端ストッパーに接する位置から右下方向へ移動
  const centerS = cart.s * PX_PER_M + cart.CART_W / 2;
  const cx = left.x + centerS * Math.cos(theta);
  const cy = left.y + centerS * Math.sin(theta);

  p.push();
  p.translate(cx, cy);
  p.rotate(theta); // 斜面に合わせてCW回転（左上→右下）

  const bodyBottom = -cart.WHEEL_R * 2;
  const bodyTop = bodyBottom - cart.CART_H;
  const bodyCenterY = bodyTop + cart.CART_H / 2;

  p.imageMode(p.CENTER);
  p.noStroke();
  p.image(state.cartImage, 0, bodyCenterY + 18, cart.CART_W, cart.CART_H);

  p.pop();
}

/**
 * 記録テープとマーク（点）を描画する。
 * @param {*} p - p5インスタンス
 * @param {number[]} marks - 各記録時刻における変位 (m) の配列
 * @param {number} recInterval - 記録間隔 (s)
 */
export function drawRecordingTape(p, marks, recInterval) {
  // テープ背景
  p.fill(255);
  p.stroke(160);
  p.strokeWeight(2);
  p.rect(TAPE_LX, TAPE_CY - TAPE_H / 2, TAPE_RX - TAPE_LX, TAPE_H, 6);

  // ラベル
  p.fill(100);
  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(13);
  p.text("記録テープ", TAPE_LX + 10, TAPE_CY - TAPE_H / 2 + 12);

  // 記録間隔の表示
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(11);
  p.fill(130);
  p.text(
    "記録間隔 " + recInterval + " s",
    TAPE_RX - 10,
    TAPE_CY - TAPE_H / 2 + 12
  );

  // 始点ライン
  p.stroke(80);
  p.strokeWeight(2);
  p.line(
    TAPE_ORIGIN_X,
    TAPE_CY - TAPE_H / 2 + 5,
    TAPE_ORIGIN_X,
    TAPE_CY + TAPE_H / 2 - 5
  );

  // 各記録点の描画
  for (let i = 0; i < marks.length; i++) {
    const xPos = TAPE_ORIGIN_X + marks[i] * PX_PER_M;
    if (xPos > TAPE_RX - 8) break;

    // 縦線（目盛り）
    p.stroke(100);
    p.strokeWeight(1);
    p.line(xPos, TAPE_CY - TAPE_H / 2 + 5, xPos, TAPE_CY - TAPE_H / 2 + 22);

    // 点
    p.fill(20);
    p.noStroke();
    p.circle(xPos, TAPE_CY + 6, 7);
  }
}

/**
 * 情報パネルを描画する（左上）。
 * @param {*} p - p5インスタンス
 * @param {SlopeCart} cart - 台車オブジェクト
 */
export function drawInfoPanel(p, cart) {
  const PANEL_W = 310;
  const PANEL_H = 152;
  const LEFT_X = 26;
  const RIGHT_X = LEFT_X + PANEL_W - 16;
  const START_Y = 18;
  const LINE_H = 26;

  // 背景
  p.fill(0, 0, 0, 170);
  p.noStroke();
  p.rect(14, 14, PANEL_W, PANEL_H, 9);

  p.fill(190, 215, 255);
  p.noStroke();
  p.textSize(15);

  const t = cart.time.toFixed(2);
  const s = cart.s.toFixed(3);
  const v = cart.v.toFixed(2);
  const a = cart.accel.toFixed(2);

  const rows = [
    ["時刻  t", t + " s"],
    ["変位  s", s + " m"],
    ["速度  v", v + " m/s"],
    ["加速度 a", a + " m/s²"],
    ["傾斜角 θ", cart.angleDeg + " °"],
  ];

  rows.forEach(([label, value], i) => {
    const y = START_Y + i * LINE_H;
    p.textAlign(p.LEFT, p.TOP);
    p.text(label, LEFT_X, y);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(value, RIGHT_X, y);
  });
}
