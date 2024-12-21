// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
const FPS = 30;
let canvasController, deviceJudge;
function settingInit() {
  deviceJudge = new BicpemaDeviceJudge();
  canvasController = new BicpemaCanvasController(true, false);
  deviceJudge.judge();
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
function elementSelectInit() {
  //   graph = select("#graph");
  //   graphCanvas = select("#graphCanvas");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {}

// valueInit関数
// 初期値を設定するための関数
function valueInit() {}
