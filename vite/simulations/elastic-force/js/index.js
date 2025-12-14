// preload関数
// setup関数よりも前に一度だけ呼び出される。
function preload() {
  font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
  );
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  scale(width / 1000);
  background(0);
  
  // 壁を描画
  drawWall();
  
  // すべてのバネを描画
  for (let spring of springs) {
    spring.draw();
  }
  
  // 説明テキスト
  push();
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("バネの端（青い点）をドラッグして引っ張ってください", 120, 20);
  text("黄色の矢印が弾性力を示しています", 120, 45);
  pop();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}

// mousePressed関数
// マウスがクリックされた際に呼び出される
function mousePressed() {
  const scaleFactor = width / 1000;
  const mx = mouseX / scaleFactor;
  const my = mouseY / scaleFactor;
  
  for (let spring of springs) {
    if (spring.isNearEnd(mx, my)) {
      spring.startDrag();
      draggedSpring = spring;
      break;
    }
  }
}

// mouseDragged関数
// マウスがドラッグされた際に呼び出される
function mouseDragged() {
  if (draggedSpring) {
    const scaleFactor = width / 1000;
    const mx = mouseX / scaleFactor;
    const my = mouseY / scaleFactor;
    draggedSpring.updateDrag(mx, my);
    
    // グラフが表示されている場合は更新
    if (graphVisible) {
      updateGraph();
    }
  }
}

// mouseReleased関数
// マウスが離された際に呼び出される
function mouseReleased() {
  if (draggedSpring) {
    draggedSpring.stopDrag();
    draggedSpring = null;
  }
}
