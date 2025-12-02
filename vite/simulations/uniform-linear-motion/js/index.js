const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = (1000 * 9) / 16;

let YELLOW_CAR_IMG;
let RED_CAR_IMAGE;

/**
 * 画像の読み込みを行う。
 */
function preload() {
  YELLOW_CAR_IMG = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FyCar.png?alt=media&token=fa3ee043-5471-41d7-bb7f-93ac1eca46f1"
  );
  RED_CAR_IMAGE = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FrCar.png?alt=media&token=7caf11af-6f62-4437-89b8-d5787c7accb8"
  );
}

/**
 * グラフの切り替え変数
 *
 * true:X-Tグラフ / false:V-Tグラフ
 *
 * @type {boolean}
 */
let graphData;

let CANVAS_CONTROLLER;

function setup() {
  CANVAS_CONTROLLER = new BicpemaCanvasController();
  CANVAS_CONTROLLER.fullScreen();

  elInit();
  elSetting();
  imgInit();
  initValue();

  textSize(14);
  textAlign(CENTER);
  frameRate(60);

  graphData = true;
}

function draw() {
  // レスポンシブ処理
  scale(width / 1000);

  background(0);

  // 地面の描画
  fill(30);
  noStroke();
  rect(0, CANVAS_HEIGHT / 2 - 50, 1000, 25);
  rect(0, CANVAS_HEIGHT - 50, 1000, 25);

  /**
   * スケールを表示するかを切り返すcheckbox要素
   * @type p5.Element
   */
  const SCALE_CHECK_BOX = select("#scaleCheckBox");

  if (SCALE_CHECK_BOX.checked()) {
    drawScale(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, 50);
    drawScale(0, CANVAS_HEIGHT, CANVAS_WIDTH, 50);
  }

  RED_CAR.update();
  YELLOW_CAR.update();
  RED_CAR.drawTrajectory();
  YELLOW_CAR.drawTrajectory();
  RED_CAR.drawCar();
  YELLOW_CAR.drawCar();

  graphDraw();
}

function windowResized() {
  CANVAS_CONTROLLER.resizeScreen();
  elSetting();
  initValue();
}
