import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";

let backgroundDiv,
  startButton,
  stopButton,
  resetButton,
  slopeAngleButtonLabel,
  slopeAngleButton,
  weightButtonLabel,
  weightButton,
  gravityButtonLabel,
  gravityButton,
  sortButton1,
  sortButton2,
  sortButton3;
const NAV_HEIGHT = 60;
const CONTROL_PANEL_HEIGHT_DIVISOR = 10; // 操作パネルの高さ = windowHeight / この値
const BUTTON_COLUMN_DIVISOR = 8; // 操作パネルを何等分してボタンを配置するか
const DEFAULT_SLOPE_ANGLE = 20; // 坂の角度の初期値[°]
const SLOPE_ANGLE_MIN = 0;
const SLOPE_ANGLE_MAX = 89.9;
const INPUT_STEP = 0.1;
const DEFAULT_WEIGHT = 15; // 質量の初期値[kg]
const WEIGHT_MIN = 0;
const WEIGHT_MAX = 20;
const DEFAULT_GRAVITY = 9.8; // 重力加速度の初期値[m/s^2]
const GRAVITY_MIN = 0;
const GRAVITY_MAX = 20;
function controlPanelHeight() {
  return windowHeight / CONTROL_PANEL_HEIGHT_DIVISOR;
}
function buttonColumnWidth() {
  return windowWidth / BUTTON_COLUMN_DIVISOR;
}
function canvasHeight() {
  return windowHeight - NAV_HEIGHT - controlPanelHeight();
}
let count = 0;
let SLOPE_WID = 0;
let GROUND_HEI = 0;
let MATERIAL_WID = 0;
let MATERIAL_HEI = 0;
let REFERENCE_POINT = 0;
let MINIMUM_UNIT = 0;
let clickedCount;
let resetCount;
let material;
function buttonCreation() {
  backgroundDiv = createElement("div");
  startButton = createButton("スタート");
  stopButton = createButton("ストップ");
  resetButton = createButton("リセット");
  slopeAngleButtonLabel = createElement("label", "坂の角度[°]");
  slopeAngleButton = createInput(DEFAULT_SLOPE_ANGLE, "number");
  weightButtonLabel = createElement("label", "質量[kg]");
  weightButton = createInput(DEFAULT_WEIGHT, "number");
  gravityButtonLabel = createElement("label", "重力加速度[m/s^2]");
  gravityButton = createInput(DEFAULT_GRAVITY, "number");
  sortButton1 = createButton(1).mousePressed(sortButtonAction1);
  sortButton2 = createButton(2).mousePressed(sortButtonAction2);
  sortButton3 = createButton(3).mousePressed(sortButtonAction3);
}
function materialSet() {
  material = new Material(weightButton.value(), 1);
}
//ボタンのイベント登録・表示状態の初期化（初回セットアップ専用。リサイズ時に再登録するとリスナーが重複するため呼ばない）
//sortButton1〜3はbuttonCreation()で生成時にmousePressedを登録済み
function buttonEvents() {
  startButton.mousePressed(moveButtonAction);
  stopButton.mousePressed(moveButtonAction).hide();
  resetButton.mousePressed(resetButtonAction);
}
//canvasサイズに依存するボタンの配置（リサイズ時にも呼ぶため、イベント登録や表示状態は変更しない）
function buttonSettings() {
  const controlTop = NAV_HEIGHT + height;
  const controlHeight = controlPanelHeight();
  const buttonWidth = buttonColumnWidth();
  backgroundDiv.size(width, controlHeight).style("background-color", "white");
  startButton
    .size(buttonWidth, controlHeight)
    .position(0, controlTop)
    .addClass(
      "cursor-pointer rounded border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
    )
    .parent(backgroundDiv);
  stopButton
    .size(buttonWidth, controlHeight)
    .position(0, controlTop)
    .addClass(
      "cursor-pointer rounded border border-red-600 bg-white text-red-600 hover:bg-red-50"
    )
    .parent(backgroundDiv);
  resetButton
    .size(buttonWidth, controlHeight)
    .position(buttonWidth, controlTop)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    )
    .parent(backgroundDiv);
  slopeAngleButtonLabel
    .size(buttonWidth, controlHeight)
    .position(2 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  slopeAngleButton
    .size(buttonWidth, controlHeight)
    .position(3 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", SLOPE_ANGLE_MIN)
    .attribute("max", SLOPE_ANGLE_MAX)
    .attribute("step", INPUT_STEP);
  weightButtonLabel
    .size(buttonWidth, controlHeight)
    .position(4 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  weightButton
    .size(buttonWidth, controlHeight)
    .position(5 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", WEIGHT_MIN)
    .attribute("max", WEIGHT_MAX)
    .attribute("step", INPUT_STEP);
  gravityButtonLabel
    .size(buttonWidth, controlHeight)
    .position(6 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  gravityButton
    .size(buttonWidth, controlHeight)
    .position(7 * buttonWidth, controlTop)
    .parent(backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", GRAVITY_MIN)
    .attribute("max", GRAVITY_MAX)
    .attribute("step", INPUT_STEP);
  sortButton1
    .size(buttonWidth, controlHeight)
    .position(width - 3 * buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
  sortButton2
    .size(buttonWidth, controlHeight)
    .position(width - 2 * buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
  sortButton3
    .size(buttonWidth, controlHeight)
    .position(width - buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
}
function sortButtonAction1() {
  material.sort = 1;
}
function sortButtonAction2() {
  material.sort = 2;
}
function sortButtonAction3() {
  material.sort = 3;
}
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
function resetButtonAction() {
  initSettings();
  materialSet();
  clickedCount = false;
  resetCount = true;
  startButton.show();
  stopButton.hide();
}
function setup() {
  fullScreen();
  buttonCreation();
  initSettings();
  materialSet();
  buttonSettings();
  buttonEvents();
}
let isFirstDraw = true;

function draw() {
  if (isFirstDraw) {
    isFirstDraw = false;
    hideLoadingSpinner();
  }

  background(255);
  slope();
  calculate();
  material.materialWeight = weightButton.value();
  material._draw();
}
function arrow(a, b, n) {
  if (n == "gravity") {
    triangle(
      a,
      b,
      a - MINIMUM_UNIT / 2,
      b - MINIMUM_UNIT / 2,
      a + MINIMUM_UNIT / 2,
      b - MINIMUM_UNIT / 2
    );
  } else if (n == "vertical") {
    triangle(
      a,
      b,
      a +
        (MINIMUM_UNIT / 2) *
          (sin(radians(slopeAngleButton.value())) -
            cos(radians(slopeAngleButton.value()))),
      b -
        (MINIMUM_UNIT / 2) *
          (cos(radians(slopeAngleButton.value())) +
            sin(radians(slopeAngleButton.value()))),
      a +
        (MINIMUM_UNIT / 2) *
          (sin(radians(slopeAngleButton.value())) +
            cos(radians(slopeAngleButton.value()))),
      b +
        (MINIMUM_UNIT / 2) *
          (-cos(radians(slopeAngleButton.value())) +
            sin(radians(slopeAngleButton.value())))
    );
  } else if (n == "holizonal") {
    triangle(
      a,
      b,
      a -
        (MINIMUM_UNIT / 2) *
          (sin(radians(slopeAngleButton.value())) +
            cos(radians(slopeAngleButton.value()))),
      b +
        (MINIMUM_UNIT / 2) *
          (cos(radians(slopeAngleButton.value())) -
            sin(radians(slopeAngleButton.value()))),
      a -
        (MINIMUM_UNIT / 2) *
          (-sin(radians(slopeAngleButton.value())) +
            cos(radians(slopeAngleButton.value()))),
      b -
        (MINIMUM_UNIT / 2) *
          (cos(radians(slopeAngleButton.value())) +
            sin(radians(slopeAngleButton.value())))
    );
  } else if (n == "normal") {
    triangle(
      a,
      b,
      a -
        (MINIMUM_UNIT / 2) *
          (sin(radians(slopeAngleButton.value())) +
            cos(radians(slopeAngleButton.value()))),
      b +
        (MINIMUM_UNIT / 2) *
          (cos(radians(slopeAngleButton.value())) -
            sin(radians(slopeAngleButton.value()))),
      a +
        (MINIMUM_UNIT / 2) *
          (cos(radians(slopeAngleButton.value())) -
            sin(radians(slopeAngleButton.value()))),
      b +
        (MINIMUM_UNIT / 2) *
          (sin(radians(slopeAngleButton.value())) +
            cos(radians(slopeAngleButton.value())))
    );
  }
}
function calculate() {
  if (clickedCount == true) {
    count++;
  }
  material.materialY =
    GROUND_HEI -
    ((5 * width) / 6 - material.materialX) *
      tan(radians(slopeAngleButton.value()));
}
function dashedLine(aX, aY, bX, bY, w) {
  stroke(0);
  strokeWeight(w);
  drawingContext.setLineDash([10, 5, 2, 5]);
  line(aX, aY, bX, bY);
  drawingContext.setLineDash([]);
  strokeWeight(5);
}
function rectMaterial(a, b, sort, w) {
  stroke(0);
  fill(255);
  quad(
    a,
    b,
    a + MATERIAL_HEI * sin(radians(slopeAngleButton.value())),
    b - MATERIAL_HEI * cos(radians(slopeAngleButton.value())),
    a +
      MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
      MATERIAL_HEI * sin(radians(slopeAngleButton.value())),
    b +
      MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
      MATERIAL_HEI * cos(radians(slopeAngleButton.value())),
    a + MATERIAL_WID * cos(radians(slopeAngleButton.value())),
    b + MATERIAL_WID * sin(radians(slopeAngleButton.value()))
  );
  fill(0);
  let ARROW_LENGTH = w * gravityButton.value();
  if (sort == 1) {
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      1
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
      1
    );
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))),
      1
    );
    line(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value())))
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
      "vertical"
    );
    line(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value())))
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))),
      "holizonal"
    );
  }
  if (sort == 2) {
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
      1
    );
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))),
      1
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))),
      "holizonal"
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
      "vertical"
    );
    line(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 -
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
      1
    );
    dashedLine(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH *
          sin(radians(slopeAngleButton.value())) *
          cos(radians(slopeAngleButton.value())),
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))),
      1
    );
  }
  if (sort == 3) {
    line(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2,
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH
    );
    arrow(
      a +
        (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
          MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
          2,
      b +
        (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
          MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
          2 +
        ARROW_LENGTH,
      "gravity"
    );
  }
  stroke(255, 0, 0);
  fill(255, 0, 0);
  line(
    a +
      (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
        MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
        2 -
      (MATERIAL_HEI / 2) * sin(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * cos(radians(slopeAngleButton.value())),
    b +
      (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
        MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
        2 +
      (MATERIAL_HEI / 2) * cos(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * sin(radians(slopeAngleButton.value())),
    a +
      (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
        MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
        2 -
      (MATERIAL_HEI / 2) * sin(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * cos(radians(slopeAngleButton.value())) +
      ARROW_LENGTH *
        cos(radians(slopeAngleButton.value())) *
        sin(radians(slopeAngleButton.value())),
    b +
      (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
        MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
        2 +
      (MATERIAL_HEI / 2) * cos(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * sin(radians(slopeAngleButton.value())) -
      ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value())))
  );
  arrow(
    a +
      (MATERIAL_WID * cos(radians(slopeAngleButton.value())) +
        MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) /
        2 -
      (MATERIAL_HEI / 2) * sin(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * cos(radians(slopeAngleButton.value())) +
      ARROW_LENGTH *
        cos(radians(slopeAngleButton.value())) *
        sin(radians(slopeAngleButton.value())),
    b +
      (MATERIAL_WID * sin(radians(slopeAngleButton.value())) -
        MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) /
        2 +
      (MATERIAL_HEI / 2) * cos(radians(slopeAngleButton.value())) -
      (MINIMUM_UNIT / 2) * sin(radians(slopeAngleButton.value())) -
      ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))),
    "normal"
  );
}
//canvasサイズに依存するレイアウト値の再計算（リサイズ時にも呼ぶため、シミュレーションの状態は変更しない）
function updateLayout() {
  SLOPE_WID = (2 * width) / 3;
  GROUND_HEI = (9 * height) / 10;
  MATERIAL_WID = width / 12;
  MATERIAL_HEI = height / 8;
  REFERENCE_POINT = (width - SLOPE_WID) / 2;
  MINIMUM_UNIT = width / 100;
  textSize(2 * MINIMUM_UNIT);
  textAlign(CENTER);
  strokeWeight(5);
}
function initSettings() {
  count = 0;
  updateLayout();
  clickedCount = false;
  resetCount = true;
}
function slope() {
  fill(255);
  stroke(0);
  triangle(
    REFERENCE_POINT,
    GROUND_HEI - SLOPE_WID * tan(radians(slopeAngleButton.value())),
    REFERENCE_POINT,
    GROUND_HEI,
    REFERENCE_POINT + SLOPE_WID,
    GROUND_HEI
  );
  fill(0);
  strokeWeight(2);
  text(
    nf(slopeAngleButton.value(), 1, 1),
    REFERENCE_POINT + SLOPE_WID - SLOPE_WID / 10,
    GROUND_HEI - 5
  );
  noFill();
  strokeWeight(5);
  arc(
    REFERENCE_POINT + SLOPE_WID,
    GROUND_HEI,
    SLOPE_WID / 10,
    SLOPE_WID / 10,
    PI,
    PI + radians(slopeAngleButton.value())
  );
  line(
    REFERENCE_POINT + SLOPE_WID,
    GROUND_HEI,
    REFERENCE_POINT +
      SLOPE_WID +
      2 * MATERIAL_HEI * sin(radians(slopeAngleButton.value())),
    GROUND_HEI - 2 * MATERIAL_HEI * cos(radians(slopeAngleButton.value()))
  );
}
class Material {
  constructor(m_w, s) {
    this.materialX = REFERENCE_POINT;
    this.materialY =
      GROUND_HEI - SLOPE_WID * tan(radians(slopeAngleButton.value()));
    this.materialWeight = m_w;
    this.sort = s;
  }
  _draw() {
    if (clickedCount == true) {
      const { dx, dy } = window.normalForcePhysics.computeSlideDisplacement(
        gravityButton.value(),
        slopeAngleButton.value(),
        count
      );
      this.materialX += dx;
      this.materialY += dy;
    }
    if (
      this.materialX >=
      REFERENCE_POINT +
        SLOPE_WID -
        MATERIAL_WID * cos(radians(slopeAngleButton.value()))
    ) {
      this.materialX =
        REFERENCE_POINT +
        SLOPE_WID -
        MATERIAL_WID * cos(radians(slopeAngleButton.value()));
      this.materialY =
        GROUND_HEI - MATERIAL_WID * sin(radians(slopeAngleButton.value()));
    }
    rectMaterial(
      this.materialX,
      this.materialY,
      this.sort,
      this.materialWeight
    );
  }
}
function windowResized() {
  resizeScreen();
  updateLayout();
  buttonSettings();
}
function fullScreen() {
  let p5Canvas = document.getElementById("p5Canvas");
  let canvas = createCanvas(windowWidth, canvasHeight());
  canvas.parent(p5Canvas);
}
function resizeScreen() {
  resizeCanvas(windowWidth, canvasHeight());
}

window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
new p5();
