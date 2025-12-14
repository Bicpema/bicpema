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
let spring1Input, spring2Input, spring3Input, applySettingsButton;
function elementSelectInit() {
  graph = select("#graph");
  graphCanvas = select("#graphCanvas");
  toggleGraphButton = select("#toggleGraphButton");
  spring1Input = select("#spring1Input");
  spring2Input = select("#spring2Input");
  spring3Input = select("#spring3Input");
  applySettingsButton = select("#applySettingsButton");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  toggleGraphButton.mousePressed(toggleGraph);
  applySettingsButton.mousePressed(applySettings);
}

// valueInit関数
// 初期値を設定するための関数
let springs = [];
let draggedSpring = null;
let graphVisible = false;

// 物理定数
const WALL_X = 100;
const NATURAL_LENGTH = 150;

function valueInit() {
  // 3つのバネを作成（壁から横に並べる）
  // 初期バネ定数は入力フィールドの値から取得
  const k1 = parseFloat(spring1Input.value());
  const k2 = parseFloat(spring2Input.value());
  const k3 = parseFloat(spring3Input.value());
  
  springs.push(new Spring(WALL_X, 150, NATURAL_LENGTH, k1, 1));
  springs.push(new Spring(WALL_X, 300, NATURAL_LENGTH, k2, 2));
  springs.push(new Spring(WALL_X, 450, NATURAL_LENGTH, k3, 3));
}
