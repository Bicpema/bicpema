// settingInit関数
// シミュレーションそのものの設定を行う関数
export const FPS = 30;
export let canvasController;
export function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
export let velocityInput,
  resetButton,
  playPauseButton,
  toggleModal,
  closeModal,
  settingsModal;
export function elementSelectInit() {
  velocityInput = select("#velocityInput");
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
export function elementPositionInit() {
  velocityInput.input(onVelocityChange);
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

// valueInit関数
// 初期値を設定するための関数
export let ball;
export function valueInit() {
  const initialVelocity = parseFloat(velocityInput.value());
  ball = new Ball(initialVelocity);
}
