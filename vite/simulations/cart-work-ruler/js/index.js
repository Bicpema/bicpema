import { BicpemaCanvasController } from './class.js';
import { V_W, PM, CART_W, CART_START_X, CART_CONTACT_X, RULER_INIT_LEFT, BOOK_LEFT_X, drawGround, drawCart, drawRuler, drawBook, drawVelocityArrow, drawForceArrow, drawPenetrationLine, drawInfoPanel } from './function.js';
import { updatePhysics } from './logic.js';

const FPS = 60;
let canvasController;
let font;
let massInput, velocityInput, forceInput;
let resetButton, playPauseButton, toggleModal, closeModal, settingsModal;
let mass_kg, v0_ms, force_N;
let approachX_px, velocity_ms, penetration_m, phase, isRunning;
let bookImage;

const RULER_INIT_LENGTH = BOOK_LEFT_X - RULER_INIT_LEFT;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

function elementSelectInit() {
  massInput = select('#massInput');
  velocityInput = select('#velocityInput');
  forceInput = select('#forceInput');
  resetButton = select('#resetButton');
  playPauseButton = select('#playPauseButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
}

function valueInit() {
  mass_kg = parseFloat(massInput.value());
  v0_ms = parseFloat(velocityInput.value());
  force_N = parseFloat(forceInput.value());
  approachX_px = CART_START_X;
  velocity_ms = v0_ms;
  penetration_m = 0;
  phase = 'idle';
  isRunning = false;
  playPauseButton.html('▶ 開始');
  playPauseButton.removeAttribute('disabled');
}

function elementPositionInit() {
  resetButton.mousePressed(valueInit);
  playPauseButton.mousePressed(() => {
    if (phase === 'stopped') return;
    if (phase === 'idle') {
      phase = 'approach';
      isRunning = true;
      playPauseButton.html('⏸ 一時停止');
    } else if (isRunning) {
      isRunning = false;
      playPauseButton.html('▶ 再開');
    } else {
      isRunning = true;
      playPauseButton.html('⏸ 一時停止');
    }
  });
  toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  closeModal.mousePressed(() => settingsModal.style('display', 'none'));
}

window.preload = function() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(255,255,255,0.95);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:20px;z-index:9999;font-size:24px;font-family:sans-serif;`;
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
  bookImage = loadImage('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/book2.png?alt=media&token=5a1cd40b-af41-424e-90a3-7372fe30957b');
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
  scale(width / V_W);
  background(252);

  if (isRunning) {
    const params = {
      v0_ms, force_N, mass_kg, pm: PM,
      rulerInitLeft: RULER_INIT_LEFT, cartW: CART_W,
      cartContactX: CART_CONTACT_X,
      rulerInitLength: RULER_INIT_LENGTH,
    };
    const state = { phase, approachX_px, velocity_ms, penetration_m };
    const next = updatePhysics(state, params, 1 / FPS);
    phase = next.phase;
    approachX_px = next.approachX_px;
    velocity_ms = next.velocity_ms;
    penetration_m = next.penetration_m;

    if (phase === 'stopped') {
      isRunning = false;
      playPauseButton.html('終了');
      playPauseButton.attribute('disabled', '');
    }
  }

  let cartLeftX;
  if (phase === 'idle') cartLeftX = CART_START_X;
  else if (phase === 'approach') cartLeftX = approachX_px;
  else cartLeftX = CART_CONTACT_X + penetration_m * PM;

  const rulerLeftX = RULER_INIT_LEFT + penetration_m * PM;

  drawGround();
  drawBook();
  drawRuler(rulerLeftX);
  drawCart(cartLeftX);

  if (phase === 'approach' || phase === 'contact') drawVelocityArrow(cartLeftX, velocity_ms);
  if (phase === 'contact') drawForceArrow(cartLeftX, force_N);
  if (phase === 'contact' || phase === 'stopped') drawPenetrationLine(penetration_m);

  drawInfoPanel(force_N, penetration_m, mass_kg, velocity_ms, v0_ms, phase);
}

window.windowResized = function() {
  canvasController.resizeScreen();
  elementPositionInit();
}
