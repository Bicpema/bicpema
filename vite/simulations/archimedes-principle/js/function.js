// function.jsはその他のメソッド管理専用のファイルです。

/**
 * 水槽を等角投影法で描画する。
 * @param {number} cx 水槽の中心X座標
 * @param {number} cy 水槽の底面Y座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankH 水槽の高さ
 * @param {number} tankD 水槽の奥行き（楕円比）
 * @param {number} wallThickness 壁の厚み
 */
function drawTank(cx, cy, tankW, tankH, tankD, wallThickness) {
  const halfW = tankW / 2;
  const wallColor = color(200, 210, 220, 180);
  const wallEdgeColor = color(150, 165, 180);
  const floorColor = color(180, 195, 210, 200);

  stroke(wallEdgeColor);
  strokeWeight(1.5);

  // 底面
  fill(floorColor);
  beginShape();
  vertex(cx - halfW, cy);
  vertex(cx + halfW, cy);
  vertex(cx + halfW + tankD, cy - tankD);
  vertex(cx - halfW + tankD, cy - tankD);
  endShape(CLOSE);

  // 右側面
  fill(wallColor);
  beginShape();
  vertex(cx + halfW, cy);
  vertex(cx + halfW, cy - tankH);
  vertex(cx + halfW + tankD, cy - tankD - tankH);
  vertex(cx + halfW + tankD, cy - tankD);
  endShape(CLOSE);

  // 左側面（やや暗く）
  fill(color(160, 175, 190, 180));
  beginShape();
  vertex(cx - halfW, cy);
  vertex(cx - halfW, cy - tankH);
  vertex(cx - halfW + tankD, cy - tankD - tankH);
  vertex(cx - halfW + tankD, cy - tankD);
  endShape(CLOSE);

  // 奥面
  fill(color(190, 205, 215, 160));
  beginShape();
  vertex(cx - halfW + tankD, cy - tankD);
  vertex(cx - halfW + tankD, cy - tankD - tankH);
  vertex(cx + halfW + tankD, cy - tankD - tankH);
  vertex(cx + halfW + tankD, cy - tankD);
  endShape(CLOSE);

  // 手前面（透明）
  noFill();
  stroke(wallEdgeColor);
  strokeWeight(2);
  beginShape();
  vertex(cx - halfW, cy);
  vertex(cx - halfW, cy - tankH);
  vertex(cx + halfW, cy - tankH);
  vertex(cx + halfW, cy);
  endShape(CLOSE);

  noStroke();
}

/**
 * 水を描画する。
 * @param {number} cx 水槽の中心X座標
 * @param {number} waterSurfaceY 水面のY座標
 * @param {number} tankBottomY 水槽の底面Y座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankD 水槽の奥行き
 */
function drawWater(cx, waterSurfaceY, tankBottomY, tankW, tankD) {
  const halfW = tankW / 2;
  const waterColor = color(70, 130, 200, 140);
  const waterSurfaceColor = color(100, 160, 230, 180);

  noStroke();

  // 水の本体（手前面）
  fill(waterColor);
  rect(cx - halfW, waterSurfaceY, tankW, tankBottomY - waterSurfaceY);

  // 水の奥面
  fill(color(50, 110, 180, 120));
  beginShape();
  vertex(cx - halfW + tankD, waterSurfaceY - tankD);
  vertex(cx - halfW + tankD, tankBottomY - tankD);
  vertex(cx + halfW + tankD, tankBottomY - tankD);
  vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  endShape(CLOSE);

  // 水の右側面
  fill(color(60, 120, 190, 130));
  beginShape();
  vertex(cx + halfW, waterSurfaceY);
  vertex(cx + halfW, tankBottomY);
  vertex(cx + halfW + tankD, tankBottomY - tankD);
  vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  endShape(CLOSE);

  // 水面（上面）
  fill(waterSurfaceColor);
  beginShape();
  vertex(cx - halfW, waterSurfaceY);
  vertex(cx + halfW, waterSurfaceY);
  vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  vertex(cx - halfW + tankD, waterSurfaceY - tankD);
  endShape(CLOSE);
}

/**
 * 等角投影法で円柱を描画する。
 * @param {Cylinder} cylinder 円柱オブジェクト
 * @param {number} waterSurfaceY 水面のY座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankD 水槽の奥行き
 * @param {number} cx 水槽の中心X座標
 */
function drawCylinder(cylinder, waterSurfaceY, tankW, tankD, cx) {
  const r = cylinder.r;
  const h = cylinder.h;
  const cylCx = cylinder.cx;
  const cylBottomY = cylinder.cy;
  const cylTopY = cylBottomY - h;

  const ellipseRatio = 0.35;
  const ew = r * 2;
  const eh = ew * ellipseRatio;

  const brownSide = color(139, 90, 43);
  const brownTop = color(165, 115, 60);
  const brownDark = color(100, 62, 18);
  const brownEdge = color(80, 50, 15);

  stroke(brownEdge);
  strokeWeight(1);

  // 側面（四角形で近似）
  // 水中の部分（やや暗め）
  const subY = max(cylTopY, waterSurfaceY);
  if (subY < cylBottomY) {
    // 水中部分
    fill(color(110, 72, 26, 220));
    noStroke();
    rect(cylCx - r, subY, ew, cylBottomY - subY);
    stroke(brownEdge);
    strokeWeight(1);
  }
  // 水上部分
  if (cylTopY < waterSurfaceY) {
    fill(brownSide);
    noStroke();
    rect(cylCx - r, cylTopY, ew, min(waterSurfaceY, cylBottomY) - cylTopY);
    stroke(brownEdge);
    strokeWeight(1);
  }

  // 底面楕円（常に描画）
  fill(brownDark);
  stroke(brownEdge);
  strokeWeight(1);
  ellipse(cylCx, cylBottomY, ew, eh);

  // 上面楕円（水中にある場合は描画しない）
  if (cylTopY <= waterSurfaceY) {
    fill(brownTop);
    stroke(brownEdge);
    strokeWeight(1);
    ellipse(cylCx, cylTopY, ew, eh);
  }

  noStroke();
}

/**
 * 情報テキストを描画する。
 * @param {Cylinder} cylinder 円柱オブジェクト
 * @param {number} waterSurfaceY 水面のY座標
 */
function drawInfoText(cylinder, waterSurfaceY) {
  const subFrac = cylinder.getSubmergedFraction(waterSurfaceY);
  const pct = Math.round(subFrac * 100);

  // 水中体積比ラベルを更新
  const label = document.getElementById("submergedRatioLabel");
  if (label) {
    label.textContent = `水中体積比: ${pct}%`;
  }
}
