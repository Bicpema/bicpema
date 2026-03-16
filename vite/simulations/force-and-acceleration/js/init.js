// init.jsは初期処理専用のファイルです。

const FPS = 60;
let canvasController;

/**
 * シミュレーションそのものの設定を行う関数
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(16);
}

let massInput, resetButton, toggleModal, closeModal, settingsModal;

/**
 * 仮想DOMを読み込むための関数
 */
function elementSelectInit() {
  massInput = select("#massInput");
  resetButton = select("#resetButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 */
function elementPositionInit() {
  massInput.input(onMassChange);
  resetButton.mousePressed(onReset);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

let cart;

/**
 * 初期値を設定するための関数
 */
function valueInit() {
  const mass = parseFloat(massInput.value());
  cart = new Cart(250, mass);
}
