// init.jsは初期処理専用のファイルです。

import {
  state,
  NAV_HEIGHT,
  CONTROL_PANEL_HEIGHT_DIVISOR,
  BUTTON_COLUMN_DIVISOR,
  DEFAULT_SLOPE_ANGLE,
  SLOPE_ANGLE_MIN,
  SLOPE_ANGLE_MAX,
  INPUT_STEP,
  DEFAULT_WEIGHT,
  WEIGHT_MIN,
  WEIGHT_MAX,
  DEFAULT_GRAVITY,
  GRAVITY_MIN,
  GRAVITY_MAX,
} from "./state.js";
import { Material } from "./class.js";

/**
 * 操作パネルの高さを求める。
 * @param {*} p p5インスタンス
 */
export function controlPanelHeight(p) {
  return p.windowHeight / CONTROL_PANEL_HEIGHT_DIVISOR;
}

/**
 * 操作パネルのボタン1列分の幅を求める。
 * @param {*} p p5インスタンス
 */
export function buttonColumnWidth(p) {
  return p.windowWidth / BUTTON_COLUMN_DIVISOR;
}

/**
 * canvasの高さ（操作パネルの高さを差し引いた高さ）を求める。
 * @param {*} p p5インスタンス
 */
export function canvasHeight(p) {
  return p.windowHeight - NAV_HEIGHT - controlPanelHeight(p);
}

/**
 * canvasを生成し、#p5Canvasに配置する。
 * @param {*} p p5インスタンス
 */
export function fullScreen(p) {
  const p5Canvas = document.getElementById("p5Canvas");
  const canvas = p.createCanvas(p.windowWidth, canvasHeight(p));
  canvas.parent(p5Canvas);
}

/**
 * canvasを現在のウィンドウサイズに合わせて再生成する。
 * @param {*} p p5インスタンス
 */
export function resizeScreen(p) {
  p.resizeCanvas(p.windowWidth, canvasHeight(p));
}

/**
 * DOM要素の生成を行う（初回セットアップ専用）。
 * sortButton1〜3はここでmousePressedを登録する。
 * @param {*} p p5インスタンス
 * @param {object} handlers 表示パターン切り替えボタンのイベントハンドラ
 * @param {() => void} handlers.sortButtonAction1
 * @param {() => void} handlers.sortButtonAction2
 * @param {() => void} handlers.sortButtonAction3
 */
export function buttonCreation(
  p,
  { sortButtonAction1, sortButtonAction2, sortButtonAction3 }
) {
  state.backgroundDiv = p.createElement("div");
  state.startButton = p.createButton("スタート");
  state.stopButton = p.createButton("ストップ");
  state.resetButton = p.createButton("リセット");
  state.slopeAngleButtonLabel = p.createElement("label", "坂の角度[°]");
  state.slopeAngleButton = p.createInput(DEFAULT_SLOPE_ANGLE, "number");
  state.weightButtonLabel = p.createElement("label", "質量[kg]");
  state.weightButton = p.createInput(DEFAULT_WEIGHT, "number");
  state.gravityButtonLabel = p.createElement("label", "重力加速度[m/s^2]");
  state.gravityButton = p.createInput(DEFAULT_GRAVITY, "number");
  state.sortButton1 = p.createButton(1).mousePressed(sortButtonAction1);
  state.sortButton2 = p.createButton(2).mousePressed(sortButtonAction2);
  state.sortButton3 = p.createButton(3).mousePressed(sortButtonAction3);
}

/**
 * 坂を滑る物体を生成する。
 * @param {*} p p5インスタンス
 */
export function materialSet(p) {
  state.material = new Material(p, state.weightButton.value(), 1);
}

/**
 * ボタンのイベント登録・表示状態の初期化を行う（初回セットアップ専用。
 * リサイズ時に再登録するとリスナーが重複するため呼ばない）。
 * @param {*} p p5インスタンス
 * @param {object} handlers スタート/ストップ/リセットボタンのイベントハンドラ
 * @param {() => void} handlers.moveButtonAction
 * @param {(p: *) => void} handlers.resetButtonAction
 */
export function buttonEvents(p, { moveButtonAction, resetButtonAction }) {
  state.startButton.mousePressed(moveButtonAction);
  state.stopButton.mousePressed(moveButtonAction).hide();
  state.resetButton.mousePressed(() => resetButtonAction(p));
}

/**
 * canvasサイズに依存するボタンの配置を行う（リサイズ時にも呼ぶため、
 * イベント登録や表示状態は変更しない）。
 * @param {*} p p5インスタンス
 */
export function buttonSettings(p) {
  const controlTop = NAV_HEIGHT + p.height;
  const controlHeight = controlPanelHeight(p);
  const buttonWidth = buttonColumnWidth(p);
  state.backgroundDiv
    .size(p.width, controlHeight)
    .style("background-color", "white");
  state.startButton
    .size(buttonWidth, controlHeight)
    .position(0, controlTop)
    .addClass(
      "cursor-pointer rounded border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
    )
    .parent(state.backgroundDiv);
  state.stopButton
    .size(buttonWidth, controlHeight)
    .position(0, controlTop)
    .addClass(
      "cursor-pointer rounded border border-red-600 bg-white text-red-600 hover:bg-red-50"
    )
    .parent(state.backgroundDiv);
  state.resetButton
    .size(buttonWidth, controlHeight)
    .position(buttonWidth, controlTop)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    )
    .parent(state.backgroundDiv);
  state.slopeAngleButtonLabel
    .size(buttonWidth, controlHeight)
    .position(2 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  state.slopeAngleButton
    .size(buttonWidth, controlHeight)
    .position(3 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", SLOPE_ANGLE_MIN)
    .attribute("max", SLOPE_ANGLE_MAX)
    .attribute("step", INPUT_STEP);
  state.weightButtonLabel
    .size(buttonWidth, controlHeight)
    .position(4 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  state.weightButton
    .size(buttonWidth, controlHeight)
    .position(5 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", WEIGHT_MIN)
    .attribute("max", WEIGHT_MAX)
    .attribute("step", INPUT_STEP);
  state.gravityButtonLabel
    .size(buttonWidth, controlHeight)
    .position(6 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    );
  state.gravityButton
    .size(buttonWidth, controlHeight)
    .position(7 * buttonWidth, controlTop)
    .parent(state.backgroundDiv)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("min", GRAVITY_MIN)
    .attribute("max", GRAVITY_MAX)
    .attribute("step", INPUT_STEP);
  state.sortButton1
    .size(buttonWidth, controlHeight)
    .position(p.width - 3 * buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
  state.sortButton2
    .size(buttonWidth, controlHeight)
    .position(p.width - 2 * buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
  state.sortButton3
    .size(buttonWidth, controlHeight)
    .position(p.width - buttonWidth, NAV_HEIGHT)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    );
}

/**
 * canvasサイズに依存するレイアウト値の再計算を行う（リサイズ時にも呼ぶため、
 * シミュレーションの状態は変更しない）。
 * @param {*} p p5インスタンス
 */
export function updateLayout(p) {
  state.slopeWidth = (2 * p.width) / 3;
  state.groundHeight = (9 * p.height) / 10;
  state.materialWidth = p.width / 12;
  state.materialHeight = p.height / 8;
  state.referencePoint = (p.width - state.slopeWidth) / 2;
  state.minimumUnit = p.width / 100;
  p.textSize(2 * state.minimumUnit);
  p.textAlign(p.CENTER);
  p.strokeWeight(5);
}

/**
 * シミュレーションの初期設定を行う。
 * @param {*} p p5インスタンス
 */
export function initSettings(p) {
  state.count = 0;
  updateLayout(p);
  state.clickedCount = false;
  state.resetCount = true;
}
