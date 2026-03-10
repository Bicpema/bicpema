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
 */
function elementPositionInit() {
  boatSpeedInput.input(onBoatSpeedChange);
  riverSpeedInput.input(onRiverSpeedChange);
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

// シミュレーション変数
let boat;
let waterParticles = [];
let person;

/**
 * 初期値を設定してオブジェクトを生成する。
 */
function valueInit() {
  const boatSpeed = parseFloat(boatSpeedInput.value());
  const riverSpeed = parseFloat(riverSpeedInput.value());

  boat = new Boat(boatSpeed, riverSpeed);
  person = new Person(870, RIVER_BOTTOM + 108);

  // 水の粒子を生成する
  waterParticles = [];
  for (let i = 0; i < 38; i++) {
    waterParticles.push(
      new WaterParticle(
        random(0, V_W),
        random(FAR_BANK_BOTTOM + 10, RIVER_BOTTOM - 20)
      )
    );
  }
}
