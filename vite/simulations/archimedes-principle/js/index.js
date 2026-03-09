// index.jsはメインのメソッドを呼び出すためのファイルです。

function setup() {
  settingInit();
  elementSelectInit();
  valueInit();
  redraw();
}

function draw() {
  // レスポンシブ処理（1000×562.5 基準座標系へスケール）
  scale(width / BASE_W);

  background(30);

  // 水を描画（水槽の前面に描く）
  drawWater(TANK_CX, waterSurfaceY, TANK_BOTTOM_Y, TANK_W, TANK_D);

  // 水中の円柱部分（水面より下）を描画
  drawCylinder(cylinder, waterSurfaceY, TANK_W, TANK_D, TANK_CX);

  // 水槽の枠を描画（手前の縁が円柱の前に来る）
  drawTank(TANK_CX, TANK_BOTTOM_Y, TANK_W, TANK_H, TANK_D, 8);

  // 情報テキストを更新
  drawInfoText(cylinder, waterSurfaceY);

  // 物理更新
  cylinder.update(waterSurfaceY, TANK_BOTTOM_Y, running);

  // ドラッグ処理
  if (cylinder.dragging) {
    cylinder.cy = (mouseY / (height / BASE_H)) + cylinder.dragOffsetY;
    // 水面のさらに上まで持ち上げられるように制限を緩める
    cylinder.cy = constrain(
      cylinder.cy,
      waterSurfaceY - CYL_H,
      TANK_BOTTOM_Y
    );
  }
}

function mousePressed() {
  // スケール変換を逆算してキャンバス座標に変換
  const scaleX = BASE_W / width;
  const scaleY = BASE_H / height;
  const mx = mouseX * scaleX;
  const my = mouseY * scaleY;

  if (cylinder.isOver(mx, my)) {
    cylinder.dragging = true;
    cylinder.dragOffsetY = cylinder.cy - my;
    cylinder.vy = 0;
    if (!running) {
      loop();
    }
  }
}

function mouseReleased() {
  if (cylinder.dragging) {
    cylinder.dragging = false;
    cylinder.vy = 0;
    if (!running) {
      // ドラッグ解放後はシミュレーションを実行して落下させる
      running = true;
      updateStartButton(running);
      loop();
    }
  }
}

function windowResized() {
  canvasController.resizeScreen();
}
