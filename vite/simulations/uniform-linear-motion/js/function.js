/**
 * スケールの表示をする。
 *
 * @param {*} x スケールのx座標
 * @param {*} y スケールのy座標
 * @param {number} w スケールの幅
 * @param {number} h スケールの高さ
 */
const drawScale = (x, y, w, h) => {
  fill(255);
  rect(x, y - h, w, h);
  fill(0);
  stroke(0);
  strokeWeight(1);
  for (let i = 0; i <= w; i += 5) {
    if (i % 50 == 0) {
      line(i, y - h, i, y - 30);
      text(i / 50, i, y - 10);
    } else {
      line(i, y - h, i, y - 40);
    }
  }
};
