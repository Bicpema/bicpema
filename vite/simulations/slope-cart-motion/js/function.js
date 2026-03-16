// function.js - 描画処理専用のファイルです。

// ============================================================
// レイアウト定数（仮想座標系: 1000×562）
// ============================================================

/** 仮想キャンバスの幅 */
const V_W = 1000;
/** 仮想キャンバスの高さ */
const V_H = 562;
/** 物理座標→ピクセル変換スケール（1m = 400px） */
const PX_PER_M = 400;
/** 斜面の物理的長さ (m) */
const SLOPE_LENGTH_M = 1.1;

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
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawSlope(angleDeg) {
  const top = getSlopeTop(angleDeg);

  // 斜面の板（太い線）
  stroke(60);
  strokeWeight(8);
  line(SLOPE_BX, SLOPE_BY, top.x, top.y);

  // 板の上面ハイライト
  stroke(140);
  strokeWeight(2);
  line(SLOPE_BX, SLOPE_BY, top.x, top.y);

  // 支柱（下端の支え構造）
  drawSupportStructure(SLOPE_BX, SLOPE_BY);

  // 上端のストッパー
  drawStopper(top.x, top.y, angleDeg);
}

/**
 * 下端の支持台を描画する。
 * @param {number} px - 支持台の中心x座標
 * @param {number} py - 支持台の中心y座標
 */
function drawSupportStructure(px, py) {
  const groundY = py + 68;

  stroke(70);
  strokeWeight(4);

  // 左脚
  line(px, py, px - 55, groundY);
  // 右脚
  line(px, py, px + 18, groundY);
  // 横架（クロスバー）
  line(px - 40, py + 42, px + 12, py + 42);

  // 地面ライン
  stroke(110);
  strokeWeight(2);
  line(px - 70, groundY + 4, px + 30, groundY + 4);
}

/**
 * 斜面上端のストッパーを描画する。
 * @param {number} tx - 上端x座標
 * @param {number} ty - 上端y座標
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawStopper(tx, ty, angleDeg) {
  const theta = (angleDeg * Math.PI) / 180;
  // 斜面法線方向（上側）
  const nx = -Math.sin(theta);
  const ny = -Math.cos(theta);

  stroke(70);
  strokeWeight(5);
  line(tx, ty, tx + nx * 28, ty + ny * 28);
}

/**
 * 斜面上の台車を描画する。
 * @param {SlopeCart} cart - 台車オブジェクト
 * @param {number} angleDeg - 傾斜角 (度)
 */
function drawCartOnSlope(cart, angleDeg) {
  const top = getSlopeTop(angleDeg);
  const theta = (angleDeg * Math.PI) / 180;

  // 台車の斜面上での位置計算
  // s=0 のとき先端（坂上側端）が斜面上端ストッパーに接する位置
  const centerS = cart.s * PX_PER_M + cart.CART_W / 2;
  // 変換点は台車底面中心（車軸ライン直下の斜面面上）
  const cx = top.x - centerS * Math.cos(theta);
  const cy = top.y + centerS * Math.sin(theta);

  push();
  translate(cx, cy);
  rotate(-theta); // 斜面に合わせて回転（p5.jsはCW正）

  // 車輪（斜面面に接するy=0基準、車輪中心はy=-WHEEL_R）
  const wy = -cart.WHEEL_R;
  fill(55);
  stroke(30);
  strokeWeight(1);
  circle(-cart.CART_W / 2 + 18, wy, cart.WHEEL_R * 2);
  circle(cart.CART_W / 2 - 18, wy, cart.WHEEL_R * 2);
  // ハブ
  fill(180);
  noStroke();
  circle(-cart.CART_W / 2 + 18, wy, cart.WHEEL_R * 0.5);
  circle(cart.CART_W / 2 - 18, wy, cart.WHEEL_R * 0.5);

  // 台車ボディ（車輪の上）
  const bodyBottom = -cart.WHEEL_R * 2;
  const bodyTop = bodyBottom - cart.CART_H;
  fill(210, 215, 240);
  stroke(50);
  strokeWeight(2);
  rect(-cart.CART_W / 2, bodyTop, cart.CART_W, cart.CART_H, 5);

  // ハイライト（上面）
  fill(240, 242, 255);
  noStroke();
  rect(-cart.CART_W / 2 + 4, bodyTop + 4, cart.CART_W - 8, 7, 2);

  // 台車ラベル
  fill(30);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text("台車", 0, bodyTop + cart.CART_H / 2);

  pop();
}

/**
 * 記録テープとマーク（点）を描画する。
 * @param {number[]} marks - 各記録時刻における変位 (m) の配列
 * @param {number} recInterval - 記録間隔 (s)
 */
function drawRecordingTape(marks, recInterval) {
  // テープ背景
  fill(255);
  stroke(160);
  strokeWeight(2);
  rect(
    TAPE_LX,
    TAPE_CY - TAPE_H / 2,
    TAPE_RX - TAPE_LX,
    TAPE_H,
    6
  );

  // ラベル
  fill(100);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text("記録テープ", TAPE_LX + 10, TAPE_CY - TAPE_H / 2 + 12);

  // 記録間隔の表示
  textAlign(RIGHT, CENTER);
  textSize(11);
  fill(130);
  text("記録間隔 " + recInterval + " s", TAPE_RX - 10, TAPE_CY - TAPE_H / 2 + 12);

  // 始点ライン
  stroke(80);
  strokeWeight(2);
  line(
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
    stroke(100);
    strokeWeight(1);
    line(xPos, TAPE_CY - TAPE_H / 2 + 5, xPos, TAPE_CY - TAPE_H / 2 + 22);

    // 点
    fill(20);
    noStroke();
    circle(xPos, TAPE_CY + 6, 7);
  }
}

/**
 * 情報パネルを描画する（左上）。
 * @param {SlopeCart} cart - 台車オブジェクト
 */
function drawInfoPanel(cart) {
  // 背景
  fill(0, 0, 0, 170);
  noStroke();
  rect(14, 14, 295, 130, 9);

  // テキスト
  fill(190, 215, 255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);

  const t = cart.time.toFixed(2);
  const s = cart.s.toFixed(3);
  const v = cart.v.toFixed(2);
  const a = cart.accel.toFixed(2);

  text("時刻  t  = " + t + " s", 26, 22);
  text("変位  s  = " + s + " m", 26, 48);
  text("速度  v  = " + v + " m/s", 26, 74);
  text("加速度 a = " + a + " m/s²", 26, 100);
  text("傾斜角 θ = " + cart.angleDeg + " °", 26, 126);
}
