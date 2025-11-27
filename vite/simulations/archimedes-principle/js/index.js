// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

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

  // 説明テキストを描画
  drawInstructions();

  // 水槽を描画
  drawWaterTank();

  // 物理演算を更新
  for (let obj of objects) {
    obj.updatePhysics(waterY, waterDensity);
  }

  // ドラッグ中の物体を更新
  const scaledMouseX = mouseX / (width / 1000);
  const scaledMouseY = mouseY / (width / 1000);
  for (let obj of objects) {
    obj.updateDrag(scaledMouseX, scaledMouseY);
  }

  // 全ての物体を描画
  for (let obj of objects) {
    obj.display(waterY);
  }

  // 密度UIを更新
  updateDensityUI();

  // drawGraph();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
