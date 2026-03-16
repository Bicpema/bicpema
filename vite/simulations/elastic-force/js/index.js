// preload関数
// setup関数よりも前に一度だけ呼び出される。
// フォントは非同期で読み込み、起動をブロックしない

// フォントを非同期で読み込む（利用可能になったら適用する）
function loadFontAsync() {
  loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (f) => {
      font = f;
      textFont(font);
    }
  );
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  loadFontAsync();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  background(255);
  scale(width / V_W);

  // 仮想マウス座標（スケール変換後）
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_H;

  // ドラッグ中のバネを更新
  for (const spring of springs) {
    if (spring.isDragging) {
      spring.drag(vmx);
    }
  }

  // 壁を描画
  drawWall();

  // 各バネを描画
  for (const spring of springs) {
    const hovered = !spring.isDragging && spring.isOverHandle(vmx, vmy);
    spring.display(hovered);
  }

  // カーソル変更
  const anyInteracting =
    springs.some((s) => s.isOverHandle(vmx, vmy)) ||
    springs.some((s) => s.isDragging);
  cursor(anyInteracting ? "grab" : "default");
}

// mousePressed関数
function mousePressed() {
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_H;
  for (const spring of springs) {
    if (spring.isOverHandle(vmx, vmy)) {
      spring.startDrag(vmx);
      break;
    }
  }
}

// mouseReleased関数
function mouseReleased() {
  for (const spring of springs) {
    spring.stopDrag();
  }
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
