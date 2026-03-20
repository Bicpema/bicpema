import { Cart, BicpemaCanvasController } from './class.js';

const FPS = 60;
const W = 1000;
const H = (W * 9) / 16;
const GROUND_Y = H - 50;
const FORCE_SCALE = 0.05;
const PIXELS_PER_METER = 60;

let canvasController;
let massInput, resetButton, toggleModal, closeModal, settingsModal;
let cart;
let font = null;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(16);
}

function elementSelectInit() {
  massInput = select('#massInput');
  resetButton = select('#resetButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
}

function elementPositionInit() {
  massInput.input(() => {
    let m = parseFloat(massInput.value());
    if (isNaN(m) || m < 0.5) { m = 0.5; massInput.value(0.5); }
    else if (m > 5) { m = 5; massInput.value(5); }
    cart.mass = m;
    cart.reset();
  });
  resetButton.mousePressed(() => cart.reset());
  toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  closeModal.mousePressed(() => settingsModal.style('display', 'none'));
}

function valueInit() {
  cart = new Cart(250, parseFloat(massInput.value()));
}

window.setup = function() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  loadFont(
    'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580',
    (f) => { font = f; },
    () => {}
  );
}

window.draw = function() {
  scale(width / W);
  background(255);

  const logMX = mouseX * (W / width);

  if (mouseIsPressed) {
    const drag = max(0, logMX - cart.rightEdge);
    cart.force = drag * FORCE_SCALE;
  } else {
    cart.force = 0;
  }

  cart.update(1 / FPS, PIXELS_PER_METER);

  if (cart.x > W + 200) cart.reset();

  drawTrack();
  cart.display(GROUND_Y);

  const arrowY = GROUND_Y - cart.WHEEL_R * 2 - cart.BODY_H / 2;
  if (cart.force > 0) {
    drawForceArrow(cart.rightEdge, arrowY, logMX, arrowY);
  } else if (cart.velocity === 0) {
    drawDragHint(cart.rightEdge, arrowY);
  }

  drawInfoPanel(cart.force, cart.acceleration, cart.mass, cart.velocity);
}

window.windowResized = function() {
  canvasController.resizeScreen();
  elementPositionInit();
}

function drawTrack() {
  fill(200); noStroke();
  rect(0, GROUND_Y, W, H - GROUND_Y);
  stroke(100); strokeWeight(3);
  line(0, GROUND_Y, W, GROUND_Y);
}

function drawForceArrow(x1, y, x2) {
  if (x2 <= x1 + 5) return;
  const arrowSize = 18;
  stroke(200, 40, 40); strokeWeight(5);
  line(x1, y, x2 - arrowSize, y);
  fill(200, 40, 40); noStroke();
  triangle(x2, y, x2 - arrowSize, y - arrowSize / 2, x2 - arrowSize, y + arrowSize / 2);
  fill(200, 40, 40); noStroke();
  if (font) textFont(font);
  textSize(22); textAlign(CENTER, BOTTOM);
  text('F', (x1 + x2) / 2, y - 8);
}

function drawDragHint(x, y) {
  stroke(160); strokeWeight(2);
  drawingContext.setLineDash([8, 6]);
  line(x + 10, y, x + 160, y);
  drawingContext.setLineDash([]);
  fill(160); noStroke();
  const aSize = 14;
  triangle(x + 170, y, x + 170 - aSize, y - aSize / 2, x + 170 - aSize, y + aSize / 2);
  fill(120); noStroke();
  if (font) textFont(font);
  textSize(18); textAlign(LEFT, BOTTOM);
  text('右にドラッグして引っ張る', x + 10, y - 10);
}

function drawInfoPanel(F, a, m, v) {
  fill(0, 0, 0, 180); stroke(255, 255, 255, 60); strokeWeight(1);
  rect(20, 20, 290, 150, 10);
  fill(255); noStroke();
  if (font) textFont(font);
  textAlign(LEFT, TOP);
  textSize(26);
  text(`F = ${F.toFixed(2)} N`, 38, 34);
  text(`a = ${a.toFixed(2)} m/s²`, 38, 74);
  textSize(20); fill(200);
  text(`m = ${m.toFixed(1)} kg`, 38, 116);
  text(`v = ${v.toFixed(2)} m/s`, 175, 116);
}
