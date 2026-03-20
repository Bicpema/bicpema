import { SlopeCart, BicpemaCanvasController } from './class.js';
import { V_W, SLOPE_LENGTH_M, drawSlope, drawCartOnSlope, drawRecordingTape, drawInfoPanel } from './function.js';
import { updateGraph } from './graph.js';

const FPS = 30;
let canvasController;
let font;
let isPlaying = false;
let tapeMarks = [];
let vtData = [];
let slopeDeg = 30;
let recInterval = 0.1;
let graphVisible = false;
let cart;
let resetButton, playPauseButton, toggleModal, closeModal, settingsModal, angleInput, intervalInput;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(15);
}

function doReset() {
  cart.reset();
  tapeMarks = [];
  vtData = [];
  isPlaying = false;
  playPauseButton.html('▶ 開始');
  updateGraph(cart, vtData, graphVisible, SLOPE_LENGTH_M);
}

function elementSelectInit() {
  resetButton = select('#resetButton');
  playPauseButton = select('#playPauseButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
  angleInput = select('#angleInput');
  intervalInput = select('#intervalInput');

  resetButton.mousePressed(doReset);
  playPauseButton.mousePressed(() => {
    if (cart.isAtBottom) { doReset(); isPlaying = true; playPauseButton.html('⏸ 停止'); return; }
    isPlaying = !isPlaying;
    playPauseButton.html(isPlaying ? '⏸ 停止' : '▶ 再開');
  });
  toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  closeModal.mousePressed(() => {
    settingsModal.style('display', 'none');
    const newAngle = parseInt(angleInput.value());
    const newInterval = parseFloat(intervalInput.value());
    if (newAngle >= 10 && newAngle <= 40) { slopeDeg = newAngle; cart.setAngle(newAngle); }
    recInterval = newInterval;
    doReset();
  });

  const graphToggleParent = createDiv().id('graphToggleParent').parent(select('#p5Container'));
  const graphDiv = createDiv('<canvas id="graphCanvas"></canvas>').id('graph').parent(select('#p5Container')).style('display', 'none');
  const graphToggleBtn = createButton('v-tグラフを表示').id('graphToggleButton').class('btn btn-secondary').parent(graphToggleParent);
  graphToggleBtn.mousePressed(() => {
    graphVisible = !graphVisible;
    if (graphVisible) {
      graphDiv.style('display', 'block');
      graphToggleBtn.html('v-tグラフを非表示');
      updateGraph(cart, vtData, graphVisible, SLOPE_LENGTH_M);
    } else {
      graphDiv.style('display', 'none');
      graphToggleBtn.html('v-tグラフを表示');
    }
  });
}

function elementPositionInit() {}

function valueInit() {
  cart = new SlopeCart(slopeDeg, SLOPE_LENGTH_M);
}

window.preload = function() {
  font = loadFont('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580');
}

window.setup = function() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

window.draw = function() {
  scale(width / V_W);
  background(245);

  if (isPlaying) {
    cart.update(1 / FPS);
    while ((tapeMarks.length + 1) * recInterval <= cart.time) {
      const t = (tapeMarks.length + 1) * recInterval;
      const s = 0.5 * cart.accel * t * t;
      if (s > cart.slopeLengthM) break;
      tapeMarks.push(s);
      vtData.push({ x: t, y: cart.accel * t });
    }
    if (cart.isAtBottom) {
      isPlaying = false;
      playPauseButton.html('▶ 開始');
      if (graphVisible) updateGraph(cart, vtData, graphVisible, SLOPE_LENGTH_M);
    }
  }

  drawSlope(slopeDeg);
  drawCartOnSlope(cart, slopeDeg);
  drawRecordingTape(tapeMarks, recInterval);
  drawInfoPanel(cart);

  if (isPlaying && graphVisible) {
    updateGraph(cart, vtData, graphVisible, SLOPE_LENGTH_M);
  }
}

window.windowResized = function() {
  canvasController.resizeScreen();
  elementPositionInit();
}
