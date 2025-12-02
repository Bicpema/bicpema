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
let velocityInput,
  resetButton,
  playPauseButton,
  toggleModal,
  closeModal,
  settingsModal;
function elementSelectInit() {
  velocityInput = select("#velocityInput");
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  velocityInput.input(onVelocityChange);
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

// valueInit関数
// 初期値を設定するための関数
let ball;
function valueInit() {
  const initialVelocity = parseFloat(velocityInput.value());
  ball = new Ball(initialVelocity);
}
