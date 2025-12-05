// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
const FPS = 30;
let canvasController;
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
let boatVelocityInput,
  riverVelocityInput,
  resetButton,
  toggleModal,
  closeModal,
  settingsModal;
function elementSelectInit() {
  boatVelocityInput = select("#boatVelocityInput");
  riverVelocityInput = select("#riverVelocityInput");
  resetButton = select("#resetButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  boatVelocityInput.input(onBoatVelocityChange);
  riverVelocityInput.input(onRiverVelocityChange);
  resetButton.mousePressed(onReset);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

// valueInit関数
// 初期値を設定するための関数
let boat;
let riverVelocity;
function valueInit() {
  const initialBoatVelocity = parseFloat(boatVelocityInput.value());
  riverVelocity = parseFloat(riverVelocityInput.value());
  boat = new Boat(initialBoatVelocity);
  boat.start(); // 自動的に開始
}
