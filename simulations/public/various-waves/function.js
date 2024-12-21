// 背景の設定
function drawGrid() {
  fill(0);
  strokeWeight(1);
  stroke(68, 122, 191);
  let max_time = canvasWidth;
  for (let x = 60; x <= max_time; x += 60) line(x, 0, x, canvasHeight);
  for (let y = canvasHeight / 2; y > 0; y -= 60) line(60, y, max_time, y);
  for (let y = canvasHeight / 2; y < canvasHeight; y += 60) line(60, y, max_time, y);
}

// スケールの設定
function drawScale() {
  fill(255);
  noStroke();
  rect(0, 0, 60, canvasHeight);
  strokeWeight(1);
  let max_amp = 60 * (Math.floor(canvasHeight / 60) / 2);
  let max_time = canvasWidth;
  noStroke();
  fill(0);
  for (let x = 300; x <= max_time; x += 300) text(x / 60, x + 60, canvasHeight / 2 + 20);
  for (let y = canvasHeight / 2 - 60; y > 0; y -= 60) text(int((canvasHeight / 2 - y) / 60), 30, y + 8);
  for (let y = canvasHeight / 2 + 60; y < canvasHeight; y += 60) text(int(canvasHeight / 120) - int(y / 60), 30, y + 8);
  text("O", 60 - 30, canvasHeight / 2 + 7);
  text("y", 60 - 30, 20);
  text("x", max_time - 15, canvasHeight / 2 + 30);
  stroke(0);
  strokeWeight(3);
  line(max_time, canvasHeight / 2, max_time - 12, canvasHeight / 2 - 12);
  line(max_time, canvasHeight / 2, max_time - 12, canvasHeight / 2 + 12);
  line(60, canvasHeight / 2 - max_amp, 48, canvasHeight / 2 - max_amp + 12);
  line(60, canvasHeight / 2 - max_amp, 72, canvasHeight / 2 - max_amp + 12);
  line(60, canvasHeight / 2 - max_amp, 60, canvasHeight / 2 + max_amp);
  line(60, canvasHeight / 2, max_time, canvasHeight / 2);
}
