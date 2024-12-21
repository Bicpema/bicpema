// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// preload関数
// setup関数よりも前に一度だけ呼び出される。
let img1, img2, img3, img4, img5, img6, img7;

function preload() {
  font = loadFont("/assets/fonts/ZenMaruGothic-Regular.ttf");
  img1 = loadImage("/simulations/alpha-quartz/peak1.1.gif")
  img2 = loadImage("/simulations/alpha-quartz/peak2.1.gif")
  img3 = loadImage("/simulations/alpha-quartz/peak3.1.gif")
  img4 = loadImage("/simulations/alpha-quartz/peak4.1.gif")
  img5 = loadImage("/simulations/alpha-quartz/peak5.1.gif")
  img6 = loadImage("/simulations/alpha-quartz/計算と実験比較.2.jpg")
  img7 = loadImage("/simulations/alpha-quartz/SiとO.png")
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
  background(255);
  textAlign(LEFT);
  textSize(50);

  //各画像を配置するコマンド

  image(img1, 0, 1000 * 9 / 32 + 70, 250, 200);
  rect(10, 490, 50, 50);
  text("a.", 20, 400, 250, 200)
  image(img2, 250, 1000 * 9 / 32 + 70, 250, 200);
  rect(10 + 250, 490, 50, 50);
  text("b.", 20 + 250, 400, 250, 200)
  image(img3, 500, 1000 * 9 / 32 + 70, 250, 200);
  rect(10 + 500, 490, 50, 50);
  text("c.", 20 + 500, 400, 250, 200)
  image(img4, 750, 1000 * 9 / 32 + 70, 250, 200);
  rect(10 + 750, 490, 50, 50);
  text("d.", 20 + 750, 400, 250, 200)
  image(img5, 750, 70 + 50, 250, 200);
  rect(10 + 750, 220 + 50, 50, 50);
  text("e.", 20 + 750, 130 + 50, 250, 200)
  image(img6, 0, 0, 750, 360);
  image(img7, 770, 0, 180, 150);

  // drawGraph();
  deviceJudge.rotateInstruction();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
