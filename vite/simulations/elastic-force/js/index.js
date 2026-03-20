import { Spring, BicpemaCanvasController } from './class.js';
import { V_W, V_H, ATTACH_X, NATURAL_LENGTH, SPRING_Y_POSITIONS, drawWall } from './function.js';

const FPS = 30;
let canvasController;
let springConstantInput, springConstantDisplay, resetButton, toggleModal, closeModal, settingsModal;
let springs;
let font;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
}

function elementSelectInit() {
  springConstantInput = select('#springConstantInput');
  springConstantDisplay = select('#springConstantDisplay');
  resetButton = select('#resetButton');
  toggleModal = select('#toggleModal');
  closeModal = select('#closeModal');
  settingsModal = select('#settingsModal');
}

function elementPositionInit() {
  springConstantInput.input(() => {
    const k = parseInt(springConstantInput.value());
    springConstantDisplay.html(`${k} N/m`);
    for (const spring of springs) spring.updateK(k);
  });
  resetButton.mousePressed(() => {
    for (const spring of springs) spring.reset();
  });
  toggleModal.mousePressed(() => {
    settingsModal.style('display', settingsModal.style('display') === 'none' ? 'block' : 'none');
  });
  closeModal.mousePressed(() => settingsModal.style('display', 'none'));
}

function initFont() {
  loadFont(
    'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580',
    (f) => { font = f; textFont(font); }
  );
}

function valueInit() {
  const k = parseInt(springConstantInput.value());
  springs = SPRING_Y_POSITIONS.map((y) => new Spring(ATTACH_X, y, NATURAL_LENGTH, k));
}

window.setup = function() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  initFont();
}

window.draw = function() {
  background(255);
  scale(width / V_W);
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_H;
  for (const spring of springs) {
    if (spring.isDragging) spring.drag(vmx);
  }
  drawWall();
  for (const spring of springs) {
    const hovered = !spring.isDragging && spring.isOverHandle(vmx, vmy);
    spring.display(hovered);
  }
  const anyInteracting = springs.some((s) => s.isOverHandle(vmx, vmy)) || springs.some((s) => s.isDragging);
  cursor(anyInteracting ? 'grab' : 'default');
}

window.mousePressed = function() {
  const vmx = (mouseX / width) * V_W;
  const vmy = (mouseY / width) * V_H;
  for (const spring of springs) {
    if (spring.isOverHandle(vmx, vmy)) { spring.startDrag(vmx); break; }
  }
}

window.mouseReleased = function() {
  for (const spring of springs) spring.stopDrag();
}

window.windowResized = function() {
  canvasController.resizeScreen();
  elementPositionInit();
}
