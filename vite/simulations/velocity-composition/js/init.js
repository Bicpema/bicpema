// init.js は初期処理専用のファイルです。

/** フレームレート */
const FPS = 30;
let canvasController;

/**
 * シミュレーションのキャンバスを設定する。
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) {
    textFont(font);
  }
  textSize(16);
}

// DOM 要素の参照
let boatSpeedInput, riverSpeedInput;
let boatSpeedValue, riverSpeedValue;
let resetButton, playPauseButton;
let toggleModal, closeModal, settingsModal;

/**
 * DOM 要素を取得する。
 */
function elementSelectInit() {
  boatSpeedInput = select("#boatSpeedInput");
  riverSpeedInput = select("#riverSpeedInput");
  boatSpeedValue = select("#boatSpeedValue");
  riverSpeedValue = select("#riverSpeedValue");
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

/**
 * DOM 要素にイベントハンドラを設定する。
 * null チェックを行い、要素が存在しない場合はスキップする。
 */
function elementPositionInit() {
  if (boatSpeedInput) boatSpeedInput.input(onBoatSpeedChange);
  if (riverSpeedInput) riverSpeedInput.input(onRiverSpeedChange);
  if (resetButton) resetButton.mousePressed(onReset);
  if (playPauseButton) playPauseButton.mousePressed(onPlayPause);
  if (toggleModal) toggleModal.mousePressed(onToggleModal);
  if (closeModal) closeModal.mousePressed(onCloseModal);
}

// シミュレーション変数
let boat;
let waterParticles = [];
let person;

/**
 * 初期値を設定してオブジェクトを生成する。
 */
function valueInit() {
  const boatSpeed = boatSpeedInput ? parseFloat(boatSpeedInput.value()) : 5;
  const riverSpeed = riverSpeedInput ? parseFloat(riverSpeedInput.value()) : 3;

  boat = new Boat(boatSpeed, riverSpeed);
  // 観測者：右寄りの岸に配置
  person = new Person(880, RIVER_BOTTOM + 100);

  // 水の粒子を生成する（川全体にランダム配置）
  waterParticles = [];
  for (let i = 0; i < 40; i++) {
    waterParticles.push(
      new WaterParticle(random(0, V_W), random(20, RIVER_BOTTOM - 20))
    );
  }
}

