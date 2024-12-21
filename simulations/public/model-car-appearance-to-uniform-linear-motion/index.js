const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = (1000 * 9) / 16;

let YELLOW_CAR_IMG;
let RED_CAR_IMAGE;

/**
 * 画像の読み込みを行う。
 */
function preload() {
  YELLOW_CAR_IMG = loadImage("/assets/img/yCar.png");
  RED_CAR_IMAGE = loadImage("/assets/img/rCar.png");
}

let CANVAS_CONTROLLER;
let moveIs;

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

  drawScale(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, 50);
  drawScale(0, CANVAS_HEIGHT, CANVAS_WIDTH, 50);

  if (moveIs) {
    RED_CAR.update();
    YELLOW_CAR.update();
  }
  RED_CAR.drawTrajectory();
  YELLOW_CAR.drawTrajectory();
  RED_CAR.drawCar();
  YELLOW_CAR.drawCar();
}

function windowResized() {
  CANVAS_CONTROLLER.resizeScreen();
  elSetting();
  initValue();
}
