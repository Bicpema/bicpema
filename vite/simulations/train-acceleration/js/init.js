// init.js は初期処理専用のファイルです。

/** フレームレート */
const FPS = 60;
/** 仮想キャンバス幅 */
const V_W = 1000;
/** 仮想ピクセル/メートル（1m = 50 仮想px） */
const PX_PER_METER = 50;
/** 電車の半幅（仮想ピクセル） */
const TRAIN_HALF_W = 100;

let canvasController;
let font = null;

/**
 * キャンバスとp5.jsの基本設定を行う。
 */
function settingInit() {
  canvasController = new BicpemaCanvasController();
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(16);
}

/**
 * DOM要素を取得し、イベントを設定する。
 */
function elementSelectInit() {
  select("#playPauseButton").mousePressed(onPlayPause);
  select("#toggleModal").mousePressed(onToggleModal);
  select("#closeModal").mousePressed(onCloseModal);
  select("#resetButton").mousePressed(onReset);
  select("#accelerationInput").input(onAccelerationChange);
}

/**
 * DOM要素の位置設定（リサイズ時も呼ばれる）。
 */
function elementPositionInit() {}

/**
 * シミュレーション変数の初期化。
 */
function valueInit() {
  isPlaying = false;
  elapsedTime = 0;
  lastGraphUpdate = 0;
  maxObservedVelocity = 0;
  acceleration = parseFloat(select("#accelerationInput").value()) || 2.0;
  train = new Train(V_W / 3);
  vtData = [{ x: 0, y: 0 }];
}
