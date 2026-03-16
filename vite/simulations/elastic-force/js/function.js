// 仮想キャンバスの寸法
const V_W = 1000;
const V_H = 562;

// スケール: 1 m = 400 px
const PX_PER_M = 400;

// 壁のレイアウト
const WALL_X = 55;
const WALL_W = 80;
const WALL_TOP = 60;
const WALL_BOTTOM = 502;
const ATTACH_X = WALL_X + WALL_W;

// バネの自然長・制限値（px）
const NATURAL_LENGTH = 280;
const MIN_SPRING_LENGTH = 50;
const MAX_SPRING_LENGTH = 680;

// バネ取り付けY座標（上・中・下）
const SPRING_Y_POSITIONS = [175, 281, 387];

/**
 * 壁を描画する
 */
function drawWall() {
  // 壁の本体（明るいグレー・黒枠）
  fill(235);
  stroke(0);
  strokeWeight(2);
  rect(WALL_X, WALL_TOP, WALL_W, WALL_BOTTOM - WALL_TOP);

  // 「壁」ラベル（壁の左側）
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(22);
  text("壁", WALL_X - 24, (WALL_TOP + WALL_BOTTOM) / 2);
}
