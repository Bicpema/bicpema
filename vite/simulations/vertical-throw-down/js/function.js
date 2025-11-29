/**
 * ビルを描画する。
 * @param {number} x ビルの左上x座標
 * @param {number} y ビルの上端y座標
 * @param {number} w ビルの幅
 * @param {number} h ビルの高さ
 */
const drawBuilding = (x, y, w, h) => {
  // ビルの本体
  fill(80, 80, 100);
  noStroke();
  rect(x, y, w, h);

  // 窓を描画
  fill(200, 200, 150);
  const windowWidth = w * 0.15;
  const windowHeight = h * 0.04;
  const windowMarginX = w * 0.1;
  const windowMarginY = h * 0.03;
  const windowsPerRow = 3;
  const windowRows = Math.floor(h / (windowHeight + windowMarginY * 2));

  for (let row = 1; row < windowRows; row++) {
    for (let col = 0; col < windowsPerRow; col++) {
      const wx = x + windowMarginX + col * (windowWidth + windowMarginX);
      const wy = y + windowMarginY + row * (windowHeight + windowMarginY);
      rect(wx, wy, windowWidth, windowHeight);
    }
  }

  // ビルの屋上
  fill(60, 60, 80);
  rect(x - 5, y - 10, w + 10, 15);
};

/**
 * 地面を描画する。
 * @param {number} y 地面のy座標
 * @param {number} w キャンバスの幅
 */
const drawGround = (y, w) => {
  fill(50, 120, 50);
  noStroke();
  rect(0, y, w, 100);

  // 地面のテクスチャ
  fill(40, 100, 40);
  for (let i = 0; i < w; i += 20) {
    rect(i, y, 2, 5);
  }
};

/**
 * スケールを描画する。
 * @param {number} x スケールのx座標
 * @param {number} topY スケールの上端y座標
 * @param {number} bottomY スケールの下端y座標
 * @param {number} buildingHeight ビルの高さ（メートル）
 */
const drawScale = (x, topY, bottomY, buildingHeight) => {
  stroke(255);
  strokeWeight(2);
  line(x, topY, x, bottomY);

  // 目盛りを描画
  const scaleHeight = bottomY - topY;
  const numMarks = 5;
  const markInterval = buildingHeight / numMarks;
  const pixelInterval = scaleHeight / numMarks;

  textSize(12);
  textAlign(LEFT, CENTER);
  fill(255);
  noStroke();

  for (let i = 0; i <= numMarks; i++) {
    const markY = topY + i * pixelInterval;
    const markValue = i * markInterval;

    stroke(255);
    strokeWeight(1);
    line(x - 5, markY, x + 5, markY);

    noStroke();
    text(`${markValue.toFixed(0)}m`, x + 10, markY);
  }
};

/**
 * 情報パネルを描画する。
 * @param {number} time 経過時間（秒）
 * @param {number} velocity 現在の速度（m/s）
 * @param {number} height 現在の高さ（m）
 * @param {number} x パネルのx座標
 * @param {number} y パネルのy座標
 */
const drawInfoPanel = (time, velocity, height, x, y) => {
  fill(0, 0, 0, 180);
  noStroke();
  rect(x, y, 180, 100, 10);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`経過時間: ${time.toFixed(2)} s`, x + 10, y + 10);
  text(`速度: ${velocity.toFixed(2)} m/s`, x + 10, y + 35);
  text(`落下距離: ${height.toFixed(2)} m`, x + 10, y + 60);
};
