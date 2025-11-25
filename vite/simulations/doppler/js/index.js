const W = 1000;
const H = ((1000 * 9) / 16) * 0.9;

const FPS = 60;
let canvasController = null;
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false, 1.0, 0.9);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
}

let parentDiv = null,
  startButton = null,
  stopButton = null,
  resetButton = null,
  spanText = null;
speedButton = null;
function elementSelectInit() {
  parentDiv = createDiv().addClass('input-group');
  startButton = createButton('スタート')
    .mousePressed(startButtonFunction)
    .parent(parentDiv)
    .addClass('btn btn-outline-primary');
  stopButton = createButton('ストップ')
    .mousePressed(stopButtonFunction)
    .parent(parentDiv)
    .addClass('btn btn-outline-danger');
  resetButton = createButton('リセット')
    .mousePressed(resetButtonAction)
    .parent(parentDiv)
    .addClass('btn btn-outline-secondary');
  spanText = createSpan('音源の速度（m/s）').parent(parentDiv).addClass('input-group-text');

  speedButton = createInput(340, 'number').parent(parentDiv).addClass('form-control');
}

let posx, posy;
let count;
let sounds;
let clickedCount;
function valueInit() {
  posx = 50;
  posy = H / 2;
  count = 0;
  sounds = [];
  clickedCount = false;
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  valueInit();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  scale(width / 1000);
  background(255);
  backGround();
  if (clickedCount == true) {
    count++;
  }
  if (count % (FPS / 10) == 0 && clickedCount == true) {
    sounds.push(new SOUND(posx, 0));
  }
  for (let i = 0; i < sounds.length; i++) {
    sounds[i]._draw();
  }
  posx = (speedButton.value() * count) / FPS + 50;
  fill(0);
  ellipse(posx, posy, 20, 20);
  textSize(20);
  text(speedButton.value() + ' m/s', posx, posy + 20);
}

// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  valueInit();
}

//背景を描画する手続き
function backGround() {
  stroke(0, 100);
  for (let i = 0; i < W - 50; i += 10) {
    if (i % 100 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(i + 50, 0, i + 50, H);
  }
  for (let i = 0; i < H / 2; i += 10) {
    if (i % 100 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    line(50, H / 2 + i, W, H / 2 + i);
    line(50, H / 2 - i, W, H / 2 - i);
  }
  stroke(0);
}

function startButtonFunction() {
  clickedCount = true;
}

function stopButtonFunction() {
  clickedCount = false;
}

//リセットボタンの手続き
function resetButtonAction() {
  posx = 50;
  clickedCount = false;
  count = 0;
  sounds = [];
}

class SOUND {
  constructor(x, r) {
    this.soundx = x;
    this.radi = r;
  }
  _draw() {
    if (clickedCount == true) {
      this.radi += 340 / FPS;
    }
    noFill();
    ellipse(this.soundx, H / 2, this.radi * 2, this.radi * 2);
  }
}
