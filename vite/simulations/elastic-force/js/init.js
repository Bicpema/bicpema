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
let springConstantInput,
  springConstantDisplay,
  resetButton,
  toggleModal,
  closeModal,
  settingsModal;
function elementSelectInit() {
  springConstantInput = select("#springConstantInput");
  springConstantDisplay = select("#springConstantDisplay");
  resetButton = select("#resetButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  springConstantInput.input(onSpringConstantChange);
  resetButton.mousePressed(onReset);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

// valueInit関数
// 初期値を設定するための関数
let springs;
function valueInit() {
  const k = parseInt(springConstantInput.value());
  springs = SPRING_Y_POSITIONS.map(
    (y) => new Spring(ATTACH_X, y, NATURAL_LENGTH, k)
  );
}
