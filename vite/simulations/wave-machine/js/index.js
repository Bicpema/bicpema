import { IncidentWave } from "./incident-wave.js";
import { ReflectedWave } from "./reflected-wave.js";
import { Medium } from "./medium.js";

// 合成波の点の数
const MEDIUM_QUANTITY = 100;
// 合成波
let mediums = new Array(MEDIUM_QUANTITY);
// 器具とボタンの画像を格納する変数
let stopper, button;

function preload() {
  stopper = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2Fstopper.png?alt=media&token=c0470026-cb1a-42c5-b814-539ea0961917",
  );
  button = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FredButton.png?alt=media&token=519d5552-ac04-4fc2-8863-b8bc5e2fd174",
  );
}

function fullScreen() {
  let parent = document.getElementById("p5Canvas");
  let p5Canvas = createCanvas(windowWidth, (9 * windowHeight) / 10);
  p5Canvas.parent(parent);
}

function decelerationButtonFunction() {
  speed -= 1;
}
function accelerationButtonFunction() {
  speed += 1;
}

// 波の射出ボタンが押されているかどうかを判定する二値
let buttonClickedIs;
// 器具で固定しているかどうかを判定する二値
let fixedIs;
// 波が進行する速度
let speed = 0;
// 入射波と反射波
let incidentWaves;
let reflectedWaves;
// 器具のx方向とy方向の長さ
let stopperX = 0;
let stopperY = 0;
function initValue() {
  stopper.resize(100, 0);
  button.resize(50, 50);
  buttonClickedIs = true;
  fixedIs = true;
  speed = 1;
  incidentWaves = new Array();
  reflectedWaves = new Array();

  for (let i = 0; i < MEDIUM_QUANTITY; i++) {
    // mediums[i] = new Medium(x座標, y座標, 番号(0~MEDIUM_QUANTITY), 入射波配列, 反射波配列, 媒質数)
    mediums[i] = new Medium(
      (i * (width - 200)) / MEDIUM_QUANTITY,
      0,
      i,
      incidentWaves,
      reflectedWaves,
      MEDIUM_QUANTITY,
    );
  }

  stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
  stopperY = height / 2 - stopper.height / 8;
}

function setup() {
  fullScreen();
  initValue();
}

function stopperFunction() {
  // 器具を一定の座標内に位置させると、強制的に位置を整える
  if (
    stopperX > width - 100 - stopper.width &&
    stopperY > height / 2 - stopper.height / 4 &&
    stopperY < height / 2 + stopper.height / 4
  ) {
    stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
    stopperY = height / 2 - stopper.height / 8;
    fixedIs = true;
  } else {
    fixedIs = false;
  }

  // 器具の移動
  if (mouseIsPressed) {
    if (
      stopperX < mouseX &&
      mouseX < stopperX + stopper.width &&
      stopperY < mouseY &&
      mouseY < stopperY + stopper.height
    ) {
      stopperX = mouseX - stopper.width / 2;
      stopperY = mouseY - stopper.height / 2;
    }
  }
}

function buttonFunction() {
  if (mouseIsPressed) {
    if (
      buttonClickedIs == true &&
      dist(100, height / 2 + button.height, mouseX, mouseY) < button.height / 2
    ) {
      for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        incidentWaves.push(
          new IncidentWave(
            (i * (width - 200)) / MEDIUM_QUANTITY,
            100,
            incidentWaves.length,
            i,
            true,
          ),
        );
      }
      for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        reflectedWaves.push(
          new ReflectedWave(
            (i * (width - 200)) / MEDIUM_QUANTITY,
            100,
            reflectedWaves.length,
            MEDIUM_QUANTITY - i - 2,
            true,
            MEDIUM_QUANTITY,
          ),
        );
      }
    }
  }
}

function imageFunction() {
  tint(255);
  if (
    mouseIsPressed &&
    dist(100, height / 2 + button.height, mouseX, mouseY) < button.height / 2
  ) {
    tint(255, 200, 200, 200);
  }
  image(button, 100 - button.width / 2, height / 2 + button.height / 2);
  tint(255);
  image(stopper, stopperX, stopperY);
}

function draw() {
  background(100);
  if (buttonClickedIs == true) {
    for (let i = 0; i < incidentWaves.length; i++) {
      incidentWaves[i].calculate(speed);
    }
    for (let i = 0; i < reflectedWaves.length; i++) {
      reflectedWaves[i].calculate(speed, fixedIs);
    }
    for (let i = 0; i < MEDIUM_QUANTITY; i++) {
      mediums[i].calculate();
    }
  }
  for (let i = 0; i < MEDIUM_QUANTITY; i++) {
    mediums[i].display();
  }
  buttonFunction();
  stopperFunction();
  imageFunction();
}

function windowResized() {
  fullScreen();
  initValue();
}

// p5.jsのグローバルモード用の関数をwindowオブジェクトに登録
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
