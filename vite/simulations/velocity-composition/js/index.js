import { BicpemaCanvasController, WaterParticle, Boat, Person } from './class.js';
import { drawArrowWithLabel } from './function.js';

const FPS = 30;
const V_W = 1000;
const V_H = 562;
const RIVER_BOTTOM = 320;
const BOAT_Y = 160;

let canvasController;
let font;
let boatSpeedInput, riverSpeedInput, boatSpeedValue, riverSpeedValue;
let resetButton, playPauseButton, toggleModal, closeModal, settingsModal;
let boat;
let waterParticles = [];
let person;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(16);
}

function updateBoatSpeedLabel(val) {
  if (!boatSpeedValue) return;
  if (Math.abs(val) < 0.05) boatSpeedValue.html('0.0 m/s（停止）');
  else if (val > 0) boatSpeedValue.html(`${val.toFixed(1)} m/s ← 下流`);
  else boatSpeedValue.html(`${Math.abs(val).toFixed(1)} m/s → 上流`);
}

function elementSelectInit() {
  boatSpeedInput = select('#boatSpeedInput');
  riverSpeedInput = select('#riverSpeedInput');
  boatSpeedValue = select('#boatSpeedValue');
  riverSpeedValue = select('#riverSpeedValue');
  resetButton = select('#resetButton');
  playPauseButton = select('#playPauseButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
}

function elementPositionInit() {
  if (boatSpeedInput) boatSpeedInput.input(() => {
    const val = parseFloat(boatSpeedInput.value());
    updateBoatSpeedLabel(val);
    boat.boatSpeed = val;
  });
  if (riverSpeedInput) riverSpeedInput.input(() => {
    const val = parseFloat(riverSpeedInput.value());
    if (riverSpeedValue) riverSpeedValue.html(val.toFixed(1));
    boat.riverSpeed = val;
  });
  if (resetButton) resetButton.mousePressed(() => {
    boat.reset(parseFloat(boatSpeedInput.value()), parseFloat(riverSpeedInput.value()));
    if (playPauseButton) playPauseButton.html('開始');
  });
  if (playPauseButton) playPauseButton.mousePressed(() => {
    if (boat.isMoving) { boat.isMoving = false; playPauseButton.html('再開'); }
    else { boat.isMoving = true; playPauseButton.html('一時停止'); }
  });
  if (toggleModal) toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  if (closeModal) closeModal.mousePressed(() => settingsModal.style('display', 'none'));
}

function valueInit() {
  const boatSpeed = boatSpeedInput ? parseFloat(boatSpeedInput.value()) : 5;
  const riverSpeed = riverSpeedInput ? parseFloat(riverSpeedInput.value()) : 3;
  boat = new Boat(boatSpeed, riverSpeed);
  person = new Person(880, RIVER_BOTTOM + 100);
  waterParticles = [];
  for (let i = 0; i < 40; i++) {
    waterParticles.push(new WaterParticle(random(0, V_W), random(20, RIVER_BOTTOM - 20)));
  }
}

function drawScene() {
  background(28, 98, 165);
  fill(155, 125, 70); noStroke(); rect(0, 0, V_W, 20);
  fill(70, 130, 50); noStroke(); rect(0, 0, V_W, 9);
  fill(82, 155, 62); noStroke(); rect(0, RIVER_BOTTOM, V_W, V_H - RIVER_BOTTOM);
  stroke(110, 180, 225); strokeWeight(3);
  line(0, RIVER_BOTTOM, V_W, RIVER_BOTTOM);
  line(0, 20, V_W, 20);
  noStroke(); fill(255, 255, 255, 210); textSize(18); textAlign(LEFT, CENTER);
  text('← 川の流れ', 28, 38);
  fill(255, 255, 200); textSize(20); textAlign(LEFT, CENTER);
  text('原っぱ', 28, RIVER_BOTTOM + 52);
  drawLegend();
}

function drawLegend() {
  const lx = 28, ly = RIVER_BOTTOM - 108, lineH = 24;
  fill(0, 0, 0, 150); noStroke(); rect(lx - 8, ly - 10, 250, 80, 6);
  textSize(13); textAlign(LEFT, CENTER);
  fill(230, 60, 60); text('━━ v川: 川の速度（常に左向き）', lx, ly + lineH * 0);
  fill(30, 210, 60); text('━━ v船: 船の速度（水に対して）', lx, ly + lineH * 1);
  fill(60, 130, 255); text('━━ v合: 岸から観測した合成速度', lx, ly + lineH * 2);
}

function drawInfoPanel() {
  if (!boat) return;
  const px = V_W - 16, py = V_H - 16, panelW = 260, panelH = 100, lineH = 24;
  fill(0, 0, 0, 160); noStroke(); rect(px - panelW, py - panelH, panelW, panelH, 6);
  textSize(13); textAlign(LEFT, CENTER);
  const dirChar = (v) => Math.abs(v) < 0.05 ? '（静止）' : v > 0 ? '←' : '→';
  const cs = boat.compositeSpeed;
  fill(230, 60, 60); text(`v川: ${boat.riverSpeed.toFixed(1)} m/s ←`, px - panelW + 10, py - panelH + lineH * 0.6);
  fill(30, 210, 60); text(`v船: ${Math.abs(boat.boatSpeed).toFixed(1)} m/s ${dirChar(boat.boatSpeed)}`, px - panelW + 10, py - panelH + lineH * 1.7);
  fill(60, 130, 255); text(`v合: ${Math.abs(cs).toFixed(1)} m/s ${dirChar(cs)}`, px - panelW + 10, py - panelH + lineH * 2.8);
}

window.preload = function() {
  font = loadFont(
    'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580',
    () => {}, () => { font = null; }
  );
}

window.setup = function() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

window.draw = function() {
  scale(width / V_W);
  drawScene();
  if (!boat || !person) return;
  const dt = 1 / FPS;
  for (const p of waterParticles) { p.update(dt); p.draw(); }
  boat.update(dt);
  boat.draw();
  person.draw();
  drawInfoPanel();
}

window.windowResized = function() {
  canvasController.resizeScreen();
}
