function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

function draw() {
  // 背景を描画
  background(30, 30, 40);
  
  // 電車を更新
  const deltaTime = 1 / FPS;
  train.update(deltaTime);
  
  // 地面を描画
  fill(60, 60, 70);
  noStroke();
  rect(0, height / 2 + 10, width, 20);
  
  // 中央線を描画
  stroke(100, 100, 120);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  
  // 電車を描画
  train.draw();
  
  // 速度と時間の表示を更新
  velocityDisplay.html(`速度: ${train.velocity.toFixed(2)} m/s`);
  timeDisplay.html(`経過時間: ${train.time.toFixed(2)} s`);
  
  // グラフを描画
  drawGraph();
  
  // 電車が画面外に出たら位置をリセット（ループ）
  if (train.x > width + 50) {
    train.x = -50;
  } else if (train.x < -50) {
    train.x = width + 50;
  }
}

function windowResized() {
  const NAV_BAR = select("#navBar");
  const w = windowWidth;
  const h = (windowHeight - NAV_BAR.height) / 2;
  resizeCanvas(w, h);
  elementPositionInit();
  
  // 電車の位置を調整
  if (train) {
    train.y = h / 2 - 30;
  }
}
