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
  background(245);
  scale(width / V_W);

  // 仮想マウス座標（スケール変換後）
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_W * (V_H / V_W);

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
    drawNaturalLengthLabel(spring);
    spring.display(hovered);
  }

  // フックの法則を表示
  const k = parseInt(springConstantInput.value());
  drawHookesLaw(k);

  // カーソル変更
  const anyHover = springs.some((s) => s.isOverHandle(vmx, vmy));
  cursor(anyHover || springs.some((s) => s.isDragging) ? "grab" : "default");
}

// mousePressed関数
function mousePressed() {
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_W * (V_H / V_W);
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
