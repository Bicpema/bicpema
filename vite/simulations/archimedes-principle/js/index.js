import { BicpemaCanvasController, Cylinder } from './class.js';
import { drawTank, drawWater, drawCylinder, drawInfoText } from './function.js';
import { updateStartButton, updateDensityLabel } from './elementFunction.js';

const FPS = 60;
const BASE_W = 1000;
const BASE_H = 562.5;
const TANK_CX = 500;
const TANK_BOTTOM_Y = 460;
const TANK_W = 520;
const TANK_H = 340;
const TANK_D = 80;
const WATER_FILL_RATIO = 0.9;
const CYL_R = 60;
const CYL_H = 100;

let canvasController;
let waterSurfaceY;
let cylinder;
let running = false;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
  noLoop();
}

function elementSelectInit() {
  const startBtn = document.getElementById('startButton');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      running = !running;
      updateStartButton(running);
      if (running) loop();
      else noLoop();
    });
  }
  const resetBtn = document.getElementById('resetButton');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      valueInit();
      if (!running) redraw();
    });
  }
  const densitySlider = document.getElementById('densitySlider');
  if (densitySlider) {
    densitySlider.addEventListener('input', () => {
      const density = parseFloat(densitySlider.value);
      updateDensityLabel(density);
      if (cylinder) {
        cylinder.density = density;
        cylinder.vy = 0;
        if (!running) {
          if (density <= 1.0) cylinder.cy = waterSurfaceY + CYL_H * density;
          else cylinder.cy = TANK_BOTTOM_Y;
        }
      }
      if (!running) redraw();
    });
  }
}

function valueInit() {
  waterSurfaceY = TANK_BOTTOM_Y - TANK_H * WATER_FILL_RATIO;
  const densitySlider = document.getElementById('densitySlider');
  const density = densitySlider ? parseFloat(densitySlider.value) : 1.0;
  let initBottomY;
  if (density <= 1.0) {
    initBottomY = waterSurfaceY + CYL_H * density;
  } else {
    initBottomY = TANK_BOTTOM_Y;
  }
  cylinder = new Cylinder(TANK_CX, initBottomY, CYL_R, CYL_H, density);
  updateDensityLabel(density);
}

window.setup = function() {
  settingInit();
  elementSelectInit();
  valueInit();
  redraw();
}

window.draw = function() {
  scale(width / BASE_W);
  background(30);
  drawWater(TANK_CX, waterSurfaceY, TANK_BOTTOM_Y, TANK_W, TANK_D);
  drawCylinder(cylinder, waterSurfaceY, TANK_W, TANK_D, TANK_CX);
  drawTank(TANK_CX, TANK_BOTTOM_Y, TANK_W, TANK_H, TANK_D, 8);
  drawInfoText(cylinder, waterSurfaceY);
  cylinder.update(waterSurfaceY, TANK_BOTTOM_Y, running);
  if (cylinder.dragging) {
    cylinder.cy = (mouseY / (height / BASE_H)) + cylinder.dragOffsetY;
    cylinder.cy = constrain(cylinder.cy, waterSurfaceY - CYL_H, TANK_BOTTOM_Y);
  }
}

window.mousePressed = function() {
  const scaleX = BASE_W / width;
  const scaleY = BASE_H / height;
  const mx = mouseX * scaleX;
  const my = mouseY * scaleY;
  if (cylinder.isOver(mx, my)) {
    cylinder.dragging = true;
    cylinder.dragOffsetY = cylinder.cy - my;
    cylinder.vy = 0;
    if (!running) loop();
  }
}

window.mouseReleased = function() {
  if (cylinder.dragging) {
    cylinder.dragging = false;
    cylinder.vy = 0;
    if (!running) {
      running = true;
      updateStartButton(running);
      loop();
    }
  }
}

window.windowResized = function() {
  canvasController.resizeScreen();
}
