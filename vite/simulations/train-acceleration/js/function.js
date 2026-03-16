// function.js はその他のメソッド管理専用のファイルです。

/**
 * 線路（レールと枕木）を描画する。
 * @param {number} groundY 地面上部のy座標（仮想ピクセル）
 * @param {number} trackOffset 線路スクロールオフセット（仮想ピクセル）
 * @param {number} vw 仮想キャンバス幅
 */
const drawTrack = (groundY, trackOffset, vw) => {
  const TIE_SPACING = 40;
  const TIE_W = 30;
  const TIE_H = 8;
  const RAIL_H = 6;
  const RAIL_Y1 = groundY + 4;
  const RAIL_Y2 = groundY + 16;

  // 枕木
  fill(120, 80, 40);
  noStroke();
  // trackOffset が負になった場合も正の剰余に正規化し、枕木が途切れないようにする
  const offset = ((trackOffset % TIE_SPACING) + TIE_SPACING) % TIE_SPACING;
  for (let x = -TIE_SPACING + (TIE_SPACING - offset); x < vw + TIE_SPACING; x += TIE_SPACING) {
    rect(x - TIE_W / 2, groundY, TIE_W, TIE_H);
  }

  // レール（上）
  fill(160);
  noStroke();
  rect(0, RAIL_Y1, vw, RAIL_H);

  // レール（下）
  rect(0, RAIL_Y2, vw, RAIL_H);
};

/**
 * 電車を描画する。
 * @param {number} trainX 電車の中心x座標（仮想ピクセル）
 * @param {number} groundY 地面上部のy座標（仮想ピクセル）
 */
const drawTrain = (trainX, groundY) => {
  const BODY_W = TRAIN_HALF_W * 2;
  const BODY_H = 60;
  const WHEEL_R = 14;
  const WHEEL_OFFSET = 30;
  const BODY_Y = groundY - BODY_H - WHEEL_R * 2;
  const ROOF_H = 14;
  const WIN_W = 22;
  const WIN_H = 18;

  // 車体
  fill(30, 100, 200);
  stroke(20, 60, 140);
  strokeWeight(2);
  rect(trainX - BODY_W / 2, BODY_Y, BODY_W, BODY_H, 4, 4, 0, 0);

  // 屋根
  fill(20, 70, 160);
  noStroke();
  rect(trainX - BODY_W / 2, BODY_Y - ROOF_H, BODY_W, ROOF_H, 6, 6, 0, 0);

  // 窓
  fill(200, 230, 255);
  noStroke();
  const winY = BODY_Y + 10;
  const numWindows = 4;
  const winSpacing = BODY_W / (numWindows + 1);
  for (let i = 1; i <= numWindows; i++) {
    rect(trainX - BODY_W / 2 + winSpacing * i - WIN_W / 2, winY, WIN_W, WIN_H, 3);
  }

  // 前面ライト（右側）
  fill(255, 255, 150);
  noStroke();
  ellipse(trainX + BODY_W / 2 - 6, BODY_Y + BODY_H - 10, 10, 8);

  // 後面ライト（左側）
  fill(255, 80, 80);
  noStroke();
  ellipse(trainX - BODY_W / 2 + 6, BODY_Y + BODY_H - 10, 10, 8);

  // 車輪（左）
  fill(60);
  stroke(40);
  strokeWeight(2);
  circle(trainX - BODY_W / 2 + WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 2);
  fill(100);
  noStroke();
  circle(trainX - BODY_W / 2 + WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 0.5);

  // 車輪（右）
  fill(60);
  stroke(40);
  strokeWeight(2);
  circle(trainX + BODY_W / 2 - WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 2);
  fill(100);
  noStroke();
  circle(trainX + BODY_W / 2 - WHEEL_OFFSET, groundY + WHEEL_R, WHEEL_R * 0.5);
};

/**
 * 速さと経過時間の情報パネルを描画する。
 * @param {number} v 速さ (m/s)
 * @param {number} t 経過時間 (s)
 * @param {number} a 加速度 (m/s²)
 */
const drawInfoPanel = (v, t, a) => {
  // パネル背景
  fill(0, 0, 0, 180);
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  rect(16, 16, 250, 100, 8);

  fill(255);
  noStroke();
  if (font) textFont(font);
  textAlign(LEFT, TOP);

  textSize(22);
  text(`速さ  v = ${v.toFixed(2)} m/s`, 30, 26);
  text(`時間  t = ${t.toFixed(1)} s`, 30, 58);

  textSize(16);
  fill(200);
  const aDir = a >= 0 ? "+" : "";
  text(`加速度 a = ${aDir}${a.toFixed(1)} m/s²`, 30, 94);
};
