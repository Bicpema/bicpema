// function.js はユーティリティ関数管理専用のファイルです。

/**
 * 矢印を描画する。
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印の色
 */
function drawArrow(fromX, fromY, toX, toY, col) {
  const headSize = 11;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  stroke(col);
  strokeWeight(3);
  fill(col);
  line(fromX, fromY, toX, toY);

  const angle = atan2(dy, dx);
  push();
  translate(toX, toY);
  rotate(angle);
  triangle(0, 0, -headSize, headSize / 2, -headSize, -headSize / 2);
  pop();
}
