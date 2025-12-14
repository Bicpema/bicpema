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
let graph, graphCanvas, toggleGraphButton;
function elementSelectInit() {
  graph = select("#graph");
  graphCanvas = select("#graphCanvas");
  toggleGraphButton = select("#toggleGraphButton");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  toggleGraphButton.mousePressed(toggleGraph);
}

// valueInit関数
// 初期値を設定するための関数
let springs = [];
let draggedSpring = null;
let graphVisible = false;

function valueInit() {
  // 3つのバネを作成（壁から横に並べる）
  const wallX = 100;
  const naturalLength = 150;
  const springConstant = 0.5;
  
  springs.push(new Spring(wallX, 150, naturalLength, springConstant));
  springs.push(new Spring(wallX, 300, naturalLength, springConstant));
  springs.push(new Spring(wallX, 450, naturalLength, springConstant));
}
