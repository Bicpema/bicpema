import { Ball, BicpemaCanvasController } from './class.js';

const FPS = 30;
let canvasController;
let velocityInput, resetButton, playPauseButton, toggleModal, closeModal, settingsModal;
let ball;
let font, groundImage, ballImage;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

function elementSelectInit() {
  velocityInput = select('#velocityInput');
  resetButton = select('#resetButton');
  playPauseButton = select('#playPauseButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
}

function elementPositionInit() {
  velocityInput.input(() => {
    let v = parseFloat(velocityInput.value());
    if (isNaN(v) || v < 5) { v = 5; velocityInput.value(5); }
    else if (v > 50) { v = 50; velocityInput.value(50); }
    if (!ball.isMoving) ball.reset(v);
  });
  resetButton.mousePressed(() => {
    ball.reset(parseFloat(velocityInput.value()));
    playPauseButton.html('開始');
  });
  playPauseButton.mousePressed(() => {
    if (ball.isMoving) {
      ball.stop();
      playPauseButton.html('再開');
    } else {
      if (ball.height <= 0 && ball.time > 0) ball.reset(parseFloat(velocityInput.value()));
      ball.start();
      playPauseButton.html('一時停止');
    }
  });
  toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  closeModal.mousePressed(() => settingsModal.style('display', 'none'));
}

function valueInit() {
  ball = new Ball(parseFloat(velocityInput.value()));
}

window.preload = function() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(255,255,255,0.9);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:20px;z-index:9999;font-size:24px;font-family:sans-serif;`;
  const spinner = document.createElement('div');
  spinner.style.cssText = `width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;`;
  const style = document.createElement('style');
  style.textContent = `@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
  document.head.appendChild(style);
  const loadingText = document.createElement('div');
  loadingText.textContent = '読み込み中です...';
  loadingDiv.appendChild(spinner);
  loadingDiv.appendChild(loadingText);
  document.body.appendChild(loadingDiv);
  font = loadFont('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580');
  groundImage = loadImage('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fground.png?alt=media&token=b86c838e-5bb3-4ff5-9e1a-befd7f8c5810');
  ballImage = loadImage('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FbrownBall.png?alt=media&token=573180c7-0aff-40cd-b31c-51b5e83dda2e');
}

window.setup = function() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) loadingDiv.remove();
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

window.draw = function() {
  background(255);
  ball.update(1 / FPS);
  scale(width / 1000);
  ball.display((1000 * height) / width);
}

window.windowResized = function() {
  canvasController.resizeScreen();
  elementPositionInit();
}
