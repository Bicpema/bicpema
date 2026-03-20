import { Train, BicpemaCanvasController } from './class.js';
import { drawTrack, drawTrain, drawInfoPanel } from './function.js';
import { initChart, updateChart } from './graph.js';

const FPS = 60;
const V_W = 1000;
const PX_PER_METER = 50;
const TRAIN_HALF_W = 100;
const GRAPH_UPDATE_INTERVAL = 0.1;

let canvasController;
let font = null;
let isPlaying;
let elapsedTime;
let acceleration;
let train;
let vtData;
let lastGraphUpdate;
let maxObservedVelocity = 0;

function settingInit() {
  canvasController = new BicpemaCanvasController();
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(16);
}

function elementSelectInit() {
  select('#playPauseButton').mousePressed(onPlayPause);
  select('#toggleModal').mousePressed(onToggleModal);
  select('#closeModal').mousePressed(onCloseModal);
  select('#resetButton').mousePressed(onReset);
  select('#accelerationInput').input(onAccelerationChange);
}

function updatePlayPauseButton() {
  const btn = select('#playPauseButton');
  if (isPlaying) {
    btn.html('⏸ 一時停止');
    btn.removeClass('btn-primary');
    btn.addClass('btn-warning');
  } else {
    btn.html('▶ 開始');
    btn.removeClass('btn-warning');
    btn.addClass('btn-primary');
  }
}

function onPlayPause() { isPlaying = !isPlaying; updatePlayPauseButton(); }
function onReset() {
  isPlaying = false; updatePlayPauseButton();
  elapsedTime = 0; lastGraphUpdate = 0; maxObservedVelocity = 0;
  train.reset(); vtData = [{ x: 0, y: 0 }]; updateChart(vtData, maxObservedVelocity);
}
function onToggleModal() {
  const modal = select('#settingsModal');
  modal.style('display', modal.style('display') === 'none' ? 'block' : 'none');
}
function onCloseModal() { select('#settingsModal').style('display', 'none'); }
function onAccelerationChange() {
  const val = parseFloat(select('#accelerationInput').value());
  if (!isNaN(val)) acceleration = val;
}

function valueInit() {
  isPlaying = false; elapsedTime = 0; lastGraphUpdate = 0; maxObservedVelocity = 0;
  acceleration = parseFloat(select('#accelerationInput').value()) || 2.0;
  train = new Train(V_W / 3);
  vtData = [{ x: 0, y: 0 }];
}

window.setup = function() {
  loadFont(
    'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580',
    (f) => { font = f; },
    () => {}
  );
  settingInit();
  elementSelectInit();
  valueInit();
  initChart(vtData);
}

window.draw = function() {
  scale(width / V_W);
  const VH = V_W * (height / width);
  const GROUND_Y = VH * 0.72;

  if (isPlaying) {
    const dt = 1 / FPS;
    elapsedTime += dt;
    train.update(dt, acceleration, PX_PER_METER, V_W);
    lastGraphUpdate += dt;
    if (lastGraphUpdate >= GRAPH_UPDATE_INTERVAL) {
      lastGraphUpdate = 0;
      const v = parseFloat(train.velocity.toFixed(3));
      if (v > maxObservedVelocity) maxObservedVelocity = v;
      vtData.push({ x: parseFloat(elapsedTime.toFixed(2)), y: v });
      updateChart(vtData, maxObservedVelocity);
    }
  }

  background(135, 206, 235);
  fill(80, 130, 60); noStroke();
  rect(0, GROUND_Y + 28, V_W, VH - GROUND_Y - 28);
  drawTrack(GROUND_Y, train.trackOffset, V_W);
  drawTrain(train.x, GROUND_Y);
  drawInfoPanel(train.velocity, elapsedTime, acceleration);
}

window.windowResized = function() {
  canvasController.resizeScreen();
}
