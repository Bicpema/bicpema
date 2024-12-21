function setup() {
  settingInit();
  deviceJudge.judge();
  canvasController.fullScreen();
  elementSelectInit();
  slementPositionInit();
  valueInit();
}

function draw() {
  scale(width / 1000);
  background(255);
  if (moveIs) {
    // 波の数だけ繰り返す
    for (let num = 0; num < waveNum; num++) {
      // 波の速度だけ繰り返す
      for (let speed = 0; speed < waveArr[num].frequency.value() * waveArr[num].waveLength.value(); speed++) {
        waveArr[num]._update();
      }
      waveArr[num]._draw();
    }
    time += 1;
    timer.html(nf(time / FPS, 2, 2));
  }
  for (let num = 0; num < waveNum; num++) {
    waveArr[num]._draw();
  }
  drawGrid();
  drawScale();
  deviceJudge.rotateInstruction("horizontal");
}

function windowResized() {
  canvasController.resizeScreen();
  slementPositionInit();
  valueInit();
}
