// function.js はユーティリティ関数管理専用のファイルです。

/**
 * 矢印を描画する。
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印の色
 */
export function drawArrow(fromX, fromY, toX, toY, col) {
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

/**
 * 矢印とラベルをまとめて描画する。
 * 矢印がゼロ長のときはラベルのみを始点の右に表示する。
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印とラベルの色
 * @param {string} label 表示するテキスト
 */
export function drawArrowWithLabel(fromX, fromY, toX, toY, col, label) {
  drawArrow(fromX, fromY, toX, toY, col);
  noStroke();
  fill(col);
  textSize(12);
  if (Math.abs(toX - fromX) < 2) {
    // ゼロ長：始点の右にテキストを表示
    textAlign(LEFT, CENTER);
    text(label, fromX + 5, fromY);
  } else if (toX < fromX) {
    // 左向き矢印：先端の左にテキストを表示
    textAlign(RIGHT, CENTER);
    text(label, toX - 5, fromY);
  } else {
    // 右向き矢印：先端の右にテキストを表示
    textAlign(LEFT, CENTER);
    text(label, toX + 5, fromY);
  }
}
