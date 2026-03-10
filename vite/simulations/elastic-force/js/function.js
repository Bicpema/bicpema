// 仮想キャンバスの寸法
const V_W = 1000;
const V_H = 562;

// スケール: 500 px = 1 m
const PX_PER_M = 500;

// 壁のレイアウト
const WALL_X = 60;
const WALL_W = 75;
const WALL_TOP = 55;
const WALL_BOTTOM = 507;
const ATTACH_X = WALL_X + WALL_W;

// バネの自然長・制限値（px）
const NATURAL_LENGTH = 290;
const MIN_SPRING_LENGTH = 60;
const MAX_SPRING_LENGTH = 650;

// バネ取り付けY座標（上・中・下）
const SPRING_Y_POSITIONS = [175, 281, 387];

/**
 * 壁を描画する
 */
function drawWall() {
  // 壁の本体（グレーのブロック）
  fill(170);
  noStroke();
  rect(WALL_X, WALL_TOP, WALL_W, WALL_BOTTOM - WALL_TOP);

  // 壁のストライプ（斜線）
  stroke(130);
  strokeWeight(1.5);
  const stripeSpacing = 18;
  for (
    let y = WALL_TOP - WALL_W;
    y < WALL_BOTTOM + WALL_W;
    y += stripeSpacing
  ) {
    line(WALL_X, y, WALL_X + WALL_W, y + WALL_W);
  }

  // 壁の輪郭線
  stroke(100);
  strokeWeight(2);
  noFill();
  rect(WALL_X, WALL_TOP, WALL_W, WALL_BOTTOM - WALL_TOP);

  // 「壁」ラベル
  fill(50);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  text("壁", WALL_X - 22, (WALL_TOP + WALL_BOTTOM) / 2);
}

/**
 * 自然長を示す点線の長さラベルを描画する
 * @param {Spring} spring バネオブジェクト
 */
function drawNaturalLengthLabel(spring) {
  const naturalEndX = spring.attachX + spring.naturalLength;
  const y = spring.attachY;

  // 端点マーカー（縦線）
  stroke(160);
  strokeWeight(1.5);
  line(spring.attachX, y - 12, spring.attachX, y + 12);
  line(naturalEndX, y - 12, naturalEndX, y + 12);

  // 「自然長」ラベル
  fill(130);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(13);
  text("自然長", (spring.attachX + naturalEndX) / 2, y - 14);
}

/**
 * Hookeの法則の数式を画面右上に描画する
 * @param {number} k ばね定数
 */
function drawHookesLaw(k) {
  const boxX = 680;
  const boxY = 30;
  const boxW = 290;
  const boxH = 70;

  fill(240, 245, 255, 220);
  stroke(180, 180, 230);
  strokeWeight(1.5);
  rect(boxX, boxY, boxW, boxH, 8);

  fill(30);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  text("フックの法則: F = k |x|", boxX + 12, boxY + 10);
  textSize(14);
  fill(80);
  text(`ばね定数 k = ${k} N/m`, boxX + 12, boxY + 36);
}
