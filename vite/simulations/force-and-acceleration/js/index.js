// index.jsはメインのメソッドを呼び出すためのファイルです。

/** キャンバスの論理幅 */
const W = 1000;
/** キャンバスの論理高さ（16:9） */
const H = (W * 9) / 16;
/** 地面のy座標（論理ピクセル） */
const GROUND_Y = H - 50;
/** 1ピクセルあたり何Nの力か（N/px）*/
const FORCE_SCALE = 0.05;
/** 1メートルあたりのピクセル数 */
const PIXELS_PER_METER = 60;

let font = null;

/**
 * セットアップ関数
 */
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  // フォントを非同期で読み込む（失敗してもシミュレーションは動作する）
  loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (f) => {
      font = f;
    },
    () => {}
  );
}

/**
 * ドロー関数
 * 毎フレーム呼び出される。
 */
function draw() {
  scale(width / W);
  background(255);

  // マウス座標を論理座標に変換
  const logMX = mouseX * (W / width);

  // マウスが押されていて台車の右端より右にある場合に力を加える
  if (mouseIsPressed) {
    const drag = max(0, logMX - cart.rightEdge);
    cart.force = drag * FORCE_SCALE;
  } else {
    cart.force = 0;
  }

  cart.update(1 / FPS, PIXELS_PER_METER);

  // 台車が右端を越えたら自動リセット
  if (cart.x > W + 200) {
    cart.reset();
  }

  // 地面・レールを描画
  drawTrack();

  // 台車を描画
  cart.display(GROUND_Y);

  // 力の矢印を描画
  const arrowY = GROUND_Y - cart.WHEEL_R * 2 - cart.BODY_H / 2;
  if (cart.force > 0) {
    drawForceArrow(cart.rightEdge, arrowY, logMX, arrowY);
  } else if (cart.velocity === 0) {
    drawDragHint(cart.rightEdge, arrowY);
  }

  // 情報パネルを描画
  drawInfoPanel(cart.force, cart.acceleration, cart.mass, cart.velocity);
}

/**
 * ウィンドウリサイズ時の処理
 */
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}

/**
 * 地面とレールを描画する。
 */
function drawTrack() {
  // 地面
  fill(200);
  noStroke();
  rect(0, GROUND_Y, W, H - GROUND_Y);

  // レール上面ライン
  stroke(100);
  strokeWeight(3);
  line(0, GROUND_Y, W, GROUND_Y);
}

/**
 * 力の矢印を描画する。
 * @param {number} x1 矢印の始点x
 * @param {number} y  矢印のy座標
 * @param {number} x2 矢印の終点x（マウス位置）
 */
function drawForceArrow(x1, y, x2) {
  if (x2 <= x1 + 5) return;

  const arrowSize = 18;

  // 矢印の線
  stroke(200, 40, 40);
  strokeWeight(5);
  line(x1, y, x2 - arrowSize, y);

  // 矢尻
  fill(200, 40, 40);
  noStroke();
  triangle(x2, y, x2 - arrowSize, y - arrowSize / 2, x2 - arrowSize, y + arrowSize / 2);

  // 「F」ラベル
  fill(200, 40, 40);
  noStroke();
  if (font) textFont(font);
  textSize(22);
  textAlign(CENTER, BOTTOM);
  text("F", (x1 + x2) / 2, y - 8);
}

/**
 * ドラッグ操作のヒントを描画する。
 * @param {number} x 台車の右端x
 * @param {number} y ヒントのy座標
 */
function drawDragHint(x, y) {
  // 点線の矢印
  stroke(160);
  strokeWeight(2);
  drawingContext.setLineDash([8, 6]);
  line(x + 10, y, x + 160, y);
  drawingContext.setLineDash([]);

  fill(160);
  noStroke();
  const aSize = 14;
  triangle(
    x + 170,
    y,
    x + 170 - aSize,
    y - aSize / 2,
    x + 170 - aSize,
    y + aSize / 2
  );

  // ヒントテキスト
  fill(120);
  noStroke();
  if (font) textFont(font);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text("右にドラッグして引っ張る", x + 10, y - 10);
}

/**
 * 情報パネルを描画する。
 * @param {number} F  現在の力 (N)
 * @param {number} a  現在の加速度 (m/s²)
 * @param {number} m  質量 (kg)
 * @param {number} v  現在の速度 (m/s)
 */
function drawInfoPanel(F, a, m, v) {
  // 背景
  fill(0, 0, 0, 180);
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  rect(20, 20, 290, 150, 10);

  fill(255);
  noStroke();
  if (font) textFont(font);
  textAlign(LEFT, TOP);

  textSize(26);
  text(`F = ${F.toFixed(2)} N`, 38, 34);
  text(`a = ${a.toFixed(2)} m/s²`, 38, 74);

  textSize(20);
  fill(200);
  text(`m = ${m.toFixed(1)} kg`, 38, 116);
  text(`v = ${v.toFixed(2)} m/s`, 175, 116);
}
