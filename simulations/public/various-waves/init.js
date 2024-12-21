const FPS = 30;
let canvasController, deviceJudge;
function settingInit() {
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
  deviceJudge = new BicpemaDeviceJudge();
  canvasController = new BicpemaCanvasController(true, false);
}
// DOM要素を格納する変数
let buttonsParent, launchButton, controlButton, resetButton, waveColabAddButton, waveColabRemoveButton, timer;
function elementSelectInit() {
  buttonsParent = select("#buttonsParent");
  launchButton = select("#launchButton").mousePressed(launchButtonFunction);
  controlButton = select("#controlButton").mousePressed(controlButtonFunction);
  resetButton = select("#resetButton").mousePressed(resetButtonFunction);
  waveColabAddButton = select("#waveColabAddButton").mousePressed(waveColabAddButtonFunction);
  waveColabRemoveButton = select("#waveColabRemoveButton").mousePressed(waveColabRemoveButtonFunction);
  timer = select("#timer");
}

function slementPositionInit() {
  buttonsParent.position((windowWidth - width) / 2, height + 60);
}

// 初期値やシミュレーションの設定
let waveArr;
let waveNum;
let moveIs;
let waveColabNum = 0;
let waveColabArr = [];
let time;
const canvasHeight = 562.5;
const canvasWidth = 1000;

function valueInit() {
  waveArr = [];
  moveIs = false;
  waveNum = 0;
  time = 0;
}
