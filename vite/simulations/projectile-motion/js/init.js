// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";

/** ヘッダーの高さ[px] */
export const NAV_HEIGHT = 60;
/**
 * pixelDensityの上限値。高DPI環境での過大な描画負荷を避けるために設定する。
 * 詳細はdocs/docs/simulation/index.mdの「パフォーマンス方針」を参照。
 */
export const MAX_PIXEL_DENSITY = 2;
/** usableHeightのうち、canvasに使う割合 */
export const CANVAS_HEIGHT_RATIO = 7 / 10;
/** usableHeightのうち、操作パネルに使う割合 */
export const CONTROL_PANEL_HEIGHT_RATIO = 3 / 10;
/** 操作パネルを何等分してボタンを配置するか */
export const BUTTON_COLUMN_DIVISOR = 8;
/** 操作パネル内の1行の高さ = usableHeight / この値 */
export const CONTROL_ROW_DIVISOR = 10;
/** 速度の初期値[m/s] */
export const DEFAULT_SPEED = 75;
/** 赤玉の角度初期値[°] */
export const DEFAULT_ANGLE_1 = 30;
/** 青玉の角度初期値[°] */
export const DEFAULT_ANGLE_2 = 60;
/** 質量の初期値[kg] */
export const DEFAULT_WEIGHT = 10;
/** 地面のy座標 = height * この値 */
export const GROUND_LEVEL_RATIO = 9 / 10;
/** ボールの半径 = width / この値 */
export const BALL_RADIUS_DIVISOR = 50;
/** ボールの発射位置のx座標 */
export const BALL_START_X = 50;
/** 重力加速度[m/s^2] */
export const GRAVITY = 9.8;
export const SPEED_INPUT_STEP = 0.1;
export const FPS = 60;

/**
 * 地面のy座標を計算する。
 * @param {*} p p5インスタンス
 */
export function groundLevel(p) {
  return p.height * GROUND_LEVEL_RATIO;
}

/**
 * canvasの高さを計算する（setup・windowResized共通）。
 * @param {*} p p5インスタンス
 */
export function updateUsableHeight(p) {
  state.usableHeight = p.windowHeight - NAV_HEIGHT;
}

/**
 * フルスクリーンのcanvasを生成する（初回セットアップ専用）。
 * @param {*} p p5インスタンス
 */
export function fullScreen(p) {
  p.pixelDensity(Math.min(p.displayDensity(), MAX_PIXEL_DENSITY));
  updateUsableHeight(p);
  const p5Canvas = p.select("#p5Canvas");
  const canvas = p.createCanvas(
    p.windowWidth,
    state.usableHeight * CANVAS_HEIGHT_RATIO
  );
  canvas.parent(p5Canvas);
}

/**
 * 操作パネルの仮想DOM要素を生成する（初回セットアップ専用）。
 * @param {*} p p5インスタンス
 */
export function elementSelectInit(p) {
  state.backgroundDiv = p.createElement("div").parent(p.select("#p5Canvas"));
  state.startButton = p.createButton("スタート");
  state.stopButton = p.createButton("ストップ");
  state.resetButton = p.createButton("リセット");
  state.ballExpla1 = p.createElement("label", "赤玉");
  state.ballExpla2 = p.createElement("label", "青玉");
  state.speedExpla = p.createElement("label", "速度[m/s]");
  state.speedButton1 = p.createInput(DEFAULT_SPEED, "number");
  state.speedButton2 = p.createInput(DEFAULT_SPEED, "number");
  state.angleExpla = p.createElement("label", "角度[°]");
  state.angleButton1 = p.createInput(DEFAULT_ANGLE_1, "number");
  state.angleButton2 = p.createInput(DEFAULT_ANGLE_2, "number");
  state.weightExpla = p.createElement("label", "質量[kg]");
  state.weightButton1 = p.createInput(DEFAULT_WEIGHT, "number");
  state.weightButton2 = p.createInput(DEFAULT_WEIGHT, "number");
  state.heightExpla = p.createElement("label", "高さ[m]");
  state.heightButton1 = p.createInput(0, "number");
  state.heightButton2 = p.createInput(0, "number");
  state.konstantExpla = p.createElement("label", "空気抵抗係数");
  state.konstantButton1 = p.createInput(0, "number");
  state.konstantButton2 = p.createInput(0, "number");
}

/**
 * canvasサイズに依存する操作パネルの配置を行う
 * （リサイズ時にも呼ぶため、イベント登録や表示状態は変更しない）。
 * @param {*} p p5インスタンス
 */
export function elementPositionInit(p) {
  state.backgroundDiv
    .size(p.width, state.usableHeight * CONTROL_PANEL_HEIGHT_RATIO)
    .style("background-color", "white");
  state.startButton
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(0, p.height)
    .addClass(
      "cursor-pointer rounded border border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
    )
    .parent(state.backgroundDiv);
  state.stopButton
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(0, p.height)
    .addClass(
      "cursor-pointer rounded border border-red-600 bg-white text-red-600 hover:bg-red-50"
    )
    .parent(state.backgroundDiv);
  state.resetButton
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight * CONTROL_PANEL_HEIGHT_RATIO
    )
    .position(p.windowWidth / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "cursor-pointer rounded border border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100"
    )
    .parent(state.backgroundDiv);
  state.ballExpla1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (2 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.ballExpla2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (2 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.speedExpla
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((3 * p.windowWidth) / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.speedButton1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (3 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .attribute("step", SPEED_INPUT_STEP)
    .parent(state.backgroundDiv);
  state.speedButton2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (3 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.angleExpla
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((4 * p.windowWidth) / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.angleButton1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (4 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.angleButton2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (4 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.weightExpla
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((5 * p.windowWidth) / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.weightButton1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (5 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.weightButton2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (5 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.heightExpla
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((6 * p.windowWidth) / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.heightButton1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (6 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.heightButton2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (6 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.konstantExpla
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position((7 * p.windowWidth) / BUTTON_COLUMN_DIVISOR, p.height)
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.konstantButton1
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (7 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
  state.konstantButton2
    .size(
      p.windowWidth / BUTTON_COLUMN_DIVISOR,
      state.usableHeight / CONTROL_ROW_DIVISOR
    )
    .position(
      (7 * p.windowWidth) / BUTTON_COLUMN_DIVISOR,
      p.height + (2 * state.usableHeight) / CONTROL_ROW_DIVISOR
    )
    .addClass(
      "rounded border border-neutral-300 bg-neutral-50 text-neutral-900"
    )
    .parent(state.backgroundDiv);
}
