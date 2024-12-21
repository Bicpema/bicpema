// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// preload関数
// setup関数よりも前に一度だけ呼び出される。
let img
function preload() {
  font = loadFont("/assets/fonts/ZenMaruGothic-Regular.ttf");
  img = loadImage("/simulations/carbonate_mineral/炭酸塩鉱物.jpg")
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  image(img, 0, 0, width, height);
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  scale(width / 1000);
  //background(0);
  // drawGraph();
  deviceJudge.rotateInstruction();
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
