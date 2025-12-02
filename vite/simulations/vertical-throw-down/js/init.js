// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
const FPS = 30;
let canvasController;
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
// グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。
//   let graph, graphCanvas;
let heightSlider, heightValue, resetButton, playPauseButton;
function elementSelectInit() {
  //   graph = select("#graph");
  //   graphCanvas = select("#graphCanvas");
  heightSlider = select("#heightSlider");
  heightValue = select("#heightValue");
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  heightSlider.input(onHeightChange);
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
}

// valueInit関数
// 初期値を設定するための関数
let ball;
function valueInit() {
  const initialHeight = parseFloat(heightSlider.value());
  ball = new Ball(initialHeight, 0);
}
