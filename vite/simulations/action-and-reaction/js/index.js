// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// preload関数
// setup関数よりも前に一度だけ呼び出される。
function preload() {
  font = loadFont("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580");
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
  
  // タイトルと説明
  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text('作用反作用の法則', 20, 20);
  textSize(14);
  text('本をドラッグして移動、ダブルクリックで質量を編集できます。', 20, 50);
  pop();
  
  // 机を描画
  drawTable();
  
  // 物理演算を更新（ドラッグしていない本のみ）
  for (let book of books) {
    book.updatePhysics(tableY, books);
  }
  
  // ドラッグ中の本を更新
  const scaledMouseX = mouseX / (width / 1000);
  const scaledMouseY = mouseY / (width / 1000);
  for (let book of books) {
    book.updateDrag(scaledMouseX, scaledMouseY, tableY, books);
  }
  
  // 全ての本を描画（力の矢印も含む）
  for (let book of books) {
    book.display();
    book.updateUIPosition(); // UIの位置を更新
    const booksBelow = book.getBooksBelow(books);
    book.displayForces(tableY, booksBelow);
  }
  
  // drawGraph();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
