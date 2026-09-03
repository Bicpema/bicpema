import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";

//ボタンのインスタンス
let startButton;
let stopButton;
let resetButton;

//ヘッダー分(NAV_HEIGHT固定)を除いた、実際に使用できる高さ
let usableHeight;

const NAV_HEIGHT = 60; // ヘッダーの高さ[px]
const CANVAS_HEIGHT_RATIO = 7 / 10; // usableHeightのうち、canvasに使う割合
const CONTROL_PANEL_HEIGHT_RATIO = 3 / 10; // usableHeightのうち、操作パネルに使う割合
const BUTTON_COLUMN_DIVISOR = 8; // 操作パネルを何等分してボタンを配置するか
const CONTROL_ROW_DIVISOR = 10; // 操作パネル内の1行の高さ = usableHeight / この値
const DEFAULT_SPEED = 75; // 速度の初期値[m/s]
const DEFAULT_ANGLE_1 = 30; // 赤玉の角度初期値[°]
const DEFAULT_ANGLE_2 = 60; // 青玉の角度初期値[°]
const DEFAULT_WEIGHT = 10; // 質量の初期値[kg]
const GROUND_LEVEL_RATIO = 9 / 10; // 地面のy座標 = height * この値
const BALL_RADIUS_DIVISOR = 50; // ボールの半径 = width / この値
const BALL_START_X = 50; // ボールの発射位置のx座標
const GRAVITY = 9.8; // 重力加速度[m/s^2]
const SPEED_INPUT_STEP = 0.1;
const FPS = 60;

//地面のy座標を計算する手続き
function groundLevel() {
  return height * GROUND_LEVEL_RATIO;
}

//canvasの高さを計算する手続き（setup・windowResized共通）
function updateUsableHeight() {
  usableHeight = windowHeight - NAV_HEIGHT;
}

//フルスクリーンにする手続き（初回セットアップ専用）
function fullScreen() {
  updateUsableHeight();
  let p5Canvas = document.getElementById("p5Canvas");
  let canvas = createCanvas(windowWidth, usableHeight * CANVAS_HEIGHT_RATIO);
  canvas.parent(p5Canvas);
}

//ウィンドウがリサイズされた時の手続き（canvasは作り直さずリサイズのみ行う）
function windowResized() {
  updateUsableHeight();
  resizeCanvas(windowWidth, usableHeight * CANVAS_HEIGHT_RATIO);
  updateLayout();
  buttonSettings();
}

let speedButton1, speedButton2;
let angleButton1, angleButton2;
let weightButton1, weightButton2;
let heightButton1, heightButton2;
let konstantButton1, konstantButton2;
let backgroundDiv;
let ballExpla1, ballExpla2;
let speedExpla, angleExpla, weightExpla, heightExpla, konstantExpla;

//ボタンの生成
function buttonCreation() {
  backgroundDiv = createElement("div").parent(
    document.getElementById("p5Canvas")
  );
  startButton = createButton("スタート");
  stopButton = createButton("ストップ");
  resetButton = createButton("リセット");
  ballExpla1 = createElement("label", "赤玉");
  ballExpla2 = createElement("label", "青玉");
  speedExpla = createElement("label", "速度[m/s]");
  speedButton1 = createInput(DEFAULT_SPEED, "number");
  speedButton2 = createInput(DEFAULT_SPEED, "number");
  angleExpla = createElement("label", "角度[°]");
  angleButton1 = createInput(DEFAULT_ANGLE_1, "number");
  angleButton2 = createInput(DEFAULT_ANGLE_2, "number");
  weightExpla = createElement("label", "質量[kg]");
  weightButton1 = createInput(DEFAULT_WEIGHT, "number");
  weightButton2 = createInput(DEFAULT_WEIGHT, "number");
  heightExpla = createElement("label", "高さ[m]");
  heightButton1 = createInput(0, "number");
  heightButton2 = createInput(0, "number");
  konstantExpla = createElement("label", "空気抵抗係数");
  konstantButton1 = createInput(0, "number");
  konstantButton2 = createInput(0, "number");
}

//基本的なボタンの初期設定の手続き
//ボタンのイベント登録・表示状態の初期化（初回セットアップ専用。リサイズ時に再登録するとリスナーが重複するため呼ばない）
function buttonEvents() {
  startButton.mousePressed(moveButtonAction);
  stopButton.mousePressed(moveButtonAction).hide();
  resetButton.mousePressed(resetButtonAction);
}
//canvasサイズに依存するボタンの配置（リサイズ時にも呼ぶため、イベント登録や表示状態は変更しない）
function buttonSettings() {
  backgroundDiv
    .size(width, usableHeight * CONTROL_PANEL_HEIGHT_RATIO)
    .style("background-color", "white");
  startButton
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(0, height)
    .addClass(
      "cursor-pointer rounded border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
    )
    .parent(backgroundDiv);
  stopButton
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(0, height)
    .addClass(
      "cursor-pointer rounded border border-red-600 bg-white text-red-600 hover:bg-red-50"
    )
    .parent(backgroundDiv);
  resetButton
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(windowWidth / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    )
    .parent(backgroundDiv);
  ballExpla1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (2 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  ballExpla2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (2 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  speedExpla
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((3 * windowWidth) / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  speedButton1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (3 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("step", SPEED_INPUT_STEP)
    .parent(backgroundDiv);
  speedButton2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (3 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  angleExpla
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((4 * windowWidth) / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  angleButton1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (4 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  angleButton2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (4 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  weightExpla
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((5 * windowWidth) / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  weightButton1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (5 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  weightButton2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (5 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  heightExpla
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((6 * windowWidth) / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  heightButton1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (6 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  heightButton2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (6 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  konstantExpla
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((7 * windowWidth) / BUTTON_COLUMN_DIVISOR, height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  konstantButton1
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (7 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
  konstantButton2
    .size(
      windowWidth / BUTTON_COLUMN_DIVISOR,
      usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (7 * windowWidth) / BUTTON_COLUMN_DIVISOR,
      height + (2 * usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(backgroundDiv);
}

//スタートストップボタンの手続き
function moveButtonAction() {
  if (clickedCount == false) {
    clickedCount = true;
    resetCount = false;
    startButton.hide();
    stopButton.show();
  } else {
    clickedCount = false;
    startButton.show();
    stopButton.hide();
  }
}

//リセットボタンの手続き
function resetButtonAction() {
  initSettings();
  clickedCount = false;
  resetCount = true;
  startButton.show();
  stopButton.hide();
}

let radi;
let clickedCount, resetCount;
let count;
let pg;
let b1, b2;

//canvasサイズに依存するレイアウト値の再計算（リサイズ時にも呼ぶため、シミュレーションの状態は変更しない）
function updateLayout() {
  radi = width / BALL_RADIUS_DIVISOR;
  if (pg) {
    pg.resizeCanvas(width, height);
  } else {
    pg = createGraphics(width, height);
  }
  textSize(width / 100);
  textAlign(CENTER, CENTER);
}
function initSettings() {
  updateLayout();
  clickedCount = false;
  resetCount = true;
  count = 0;
  b1 = new Ball(
    BALL_START_X,
    groundLevel() - radi - heightButton1.value(),
    speedButton1.value(),
    angleButton1.value(),
    weightButton1.value(),
    groundLevel() - radi - heightButton1.value(),
    konstantButton1.value(),
    1
  );
  b2 = new Ball(
    BALL_START_X,
    groundLevel() - radi - heightButton2.value(),
    speedButton2.value(),
    angleButton2.value(),
    weightButton2.value(),
    groundLevel() - radi - heightButton2.value(),
    konstantButton2.value(),
    2
  );
}

//setup関数
function setup() {
  fullScreen();
  buttonCreation();
  initSettings();
  buttonSettings();
  buttonEvents();
}

//draw関数
let isFirstDraw = true;

function draw() {
  if (isFirstDraw) {
    isFirstDraw = false;
    hideLoadingSpinner();
  }

  if (clickedCount == true) {
    count += 10;
  } else if (resetCount == true) {
    b1 = new Ball(
      BALL_START_X,
      groundLevel() - radi,
      speedButton1.value(),
      angleButton1.value(),
      weightButton1.value(),
      groundLevel() - radi - heightButton1.value(),
      konstantButton1.value(),
      1
    );
    b2 = new Ball(
      BALL_START_X,
      groundLevel() - radi,
      speedButton2.value(),
      angleButton2.value(),
      weightButton2.value(),
      groundLevel() - radi - heightButton2.value(),
      konstantButton2.value(),
      2
    );
  }
  backGround();
  b1._draw();
  b2._draw();
}

//背景色の手続き
function backGround() {
  background(255);
  if (clickedCount == true) {
    pg.fill(255, 0, 0);
    pg.ellipse(b1.posx, b1.posy, 5, 5);
    pg.fill(0, 0, 255);
    pg.ellipse(b2.posx, b2.posy, 5, 5);
  }
  if (resetCount == true) {
    pg.fill(255);
    pg.rect(0, 0, width, height);
  }
  image(pg, 0, 0);
  stroke(0, 100);
  for (let i = 0; i < groundLevel(); i += 10) {
    if (i % 100 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(
      BALL_START_X,
      groundLevel() - radi - i,
      width,
      groundLevel() - radi - i
    );
  }
  for (let i = 0; i < width; i += 10) {
    if (i % 100 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(i + BALL_START_X, 0, i + BALL_START_X, groundLevel() - radi);
  }
  fill(100, 150);
  rect(0, height - height / 10, width, height / 10);
  fill(0);
  for (let i = 0; i < width - BALL_START_X; i += 100) {
    text(i, BALL_START_X + i, groundLevel() + 10);
  }
  for (let i = 0; i < groundLevel(); i += 100) {
    text(i, 20, groundLevel() - i - radi);
  }
}

//ボールオブジェクト
class Ball {
  constructor(x, y, s, t, w, y0, k, n) {
    this.posx = x;
    this.posy = y;
    this.speed = s;
    this.theta = t;
    this.weight = w;
    this.konstant = k;
    this.number = n;
    this.posx0 = BALL_START_X;
    this.posy0 = y0;
    this.gravity = GRAVITY;
    this.fps = FPS;
  }
  _draw() {
    if (clickedCount == true) {
      if (this.posy >= groundLevel() - radi && this.posx != BALL_START_X) {
        this.posy = groundLevel() - radi;
      } else {
        const { x, y } =
          window.projectileMotionPhysics.computeDragProjectilePosition({
            t: count / this.fps,
            speed: this.speed,
            angleDeg: this.theta,
            mass: this.weight,
            k: this.konstant,
            gravity: this.gravity,
            posx0: this.posx0,
            posy0: this.posy0,
          });
        this.posx = x;
        this.posy = y;
      }
    } else if (resetCount == true) {
      this.posx = this.posx0;
      this.posy = this.posy0;
    }
    if (this.number == 1) {
      fill(255, 0, 0, 100);
    }
    if (this.number == 2) {
      fill(0, 0, 255, 100);
    }
    strokeWeight(1);
    ellipse(this.posx, this.posy, radi * 2, radi * 2);
    if (clickedCount == false) {
      strokeWeight(3);
      line(
        this.posx,
        this.posy,
        this.posx + 100 * cos(radians(-this.theta)),
        this.posy + 100 * sin(radians(-this.theta))
      );
    }
  }
}

window.windowResized = windowResized;
window.setup = setup;
window.draw = draw;
new p5();
