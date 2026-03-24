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

// 斜面の下端座標（固定）
/** 斜面下端のx座標 */
const SLOPE_BX = 190;
/** 斜面下端のy座標 */
const SLOPE_BY = 340;

// 記録テープ表示領域
/** 記録テープ中心のy座標 */
const TAPE_CY = 460;
/** 記録テープの高さ */
const TAPE_H = 55;
/** 記録テープの左端x座標 */
const TAPE_LX = 25;
/** 記録テープの右端x座標 */
const TAPE_RX = 975;
/** テープの目盛り原点x */
const TAPE_ORIGIN_X = 90;

// ============================================================
// 描画ヘルパー関数
// ============================================================

/**
 * 指定角度に対する斜面上端座標を返す。
 * @param {number} angleDeg - 傾斜角 (度)
 * @returns {{x: number, y: number}}
 */
function getSlopeTop(angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  const lenPx = SLOPE_LENGTH_M * PX_PER_M;
  return {
    x: SLOPE_BX + lenPx * Math.cos(theta),
    y: SLOPE_BY - lenPx * Math.sin(theta),
  };
}

/**
 * 斜面を描画する。
 * @param {*} p - p5インスタンス
 * @param {number} angleDeg - 傾斜角 (度)
 */
export function drawSlope(p, angleDeg) {
  const top = getSlopeTop(angleDeg);

  // 斜面の板（太い線）
  p.stroke(60);
  p.strokeWeight(8);
  p.line(SLOPE_BX, SLOPE_BY, top.x, top.y);

  // 板の上面ハイライト
  p.stroke(140);
  p.strokeWeight(2);
  p.line(SLOPE_BX, SLOPE_BY, top.x, top.y);

  // 支柱（下端の支え構造）
  drawSupportStructure(p, SLOPE_BX, SLOPE_BY);

  // 上端のストッパー
  drawStopper(p, top.x, top.y, angleDeg);
}

/**
 * 下端の支持台を描画する。
 * @param {*} p - p5インスタンス
 * @param {number} px - 支持台の中心x座標
 * @param {number} py - 支持台の中心y座標
 */
function drawSupportStructure(p, px, py) {
  const groundY = py + 68;

  p.stroke(70);
  p.strokeWeight(4);

  // 左脚
  p.line(px, py, px - 40, groundY);
  // 右脚
  p.line(px, py, px + 40, groundY);
  // 横架（クロスバー）
  p.line(px - 25, py + 42, px + 25, py + 42);

  // 地面ライン
  p.stroke(110);
  p.strokeWeight(2);
  p.line(px - 70, groundY + 4, px + 700, groundY + 4);
}

/**
 * 斜面上端のストッパーを描画する。
 * @param {*} p - p5インスタンス
 * @param {number} tx - 上端x座標
 * @param {number} ty - 上端y座標
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawStopper(p, tx, ty, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  // 斜面法線方向（上側）
  const nx = -Math.sin(theta);
  const ny = -Math.cos(theta);

  p.stroke(70);
  p.strokeWeight(5);
  p.line(tx, ty, tx + nx * 28, ty + ny * 28);
}

/**
 * 斜面上の台車を描画する。
 * @param {*} p - p5インスタンス
 * @param {SlopeCart} cart - 台車オブジェクト
 * @param {number} angleDeg - 傾斜角 (度)
 */
export function drawCartOnSlope(p, cart, angleDeg) {
  const top = getSlopeTop(angleDeg);
  const theta = (angleDeg * Math.PI) / 180;

  // 台車の斜面上での位置計算
  // s=0 のとき先端（坂上側端）が斜面上端ストッパーに接する位置
  const centerS = cart.s * PX_PER_M + cart.CART_W / 2;
  // 変換点は台車底面中心（車軸ライン直下の斜面面上）
  const cx = top.x - centerS * Math.cos(theta);
  const cy = top.y + centerS * Math.sin(theta);

  p.push();
  p.translate(cx, cy);
  p.rotate(-theta); // 斜面に合わせて回転（p5.jsはCW正）

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
  // 背景
  p.fill(0, 0, 0, 170);
  p.noStroke();
  p.rect(14, 14, 295, 130, 9);

  // テキスト
  p.fill(190, 215, 255);
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(15);

  const t = cart.time.toFixed(2);
  const s = cart.s.toFixed(3);
  const v = cart.v.toFixed(2);
  const a = cart.accel.toFixed(2);

  p.text("時刻  t  = " + t + " s", 26, 22);
  p.text("変位  s  = " + s + " m", 26, 48);
  p.text("速度  v  = " + v + " m/s", 26, 74);
  p.text("加速度 a = " + a + " m/s²", 26, 100);
  p.text("傾斜角 θ = " + cart.angleDeg + " °", 26, 126);
}
