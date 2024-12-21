//ボタンのインスタンス
let startButton;
let stopButton;
let resetButton;

//フルスクリーンにする手続き
function fullScreen() {
    createCanvas(windowWidth, 7 * windowHeight / 10);
}

//ウィンドウがリサイズされた時の手続き
function windowResized() {
    fullScreen()
    initSettings()
    buttonSettings()
    clickedCount = false;
    resetCount = true;
    startButton.show()
    stopButton.hide()
}

let speedButton1, speedButton2;
let angleButton1, angleButton2;
let weightButton1, weightButton2;
let heightButton1, heightButton2;
let konstantButton1, konstantButton2;
let backgroundDiv;

//ボタンの生成
function buttonCreation() {
    backgroundDiv = createElement("div")
    startButton = createButton("スタート")
    stopButton = createButton("ストップ")
    resetButton = createButton("リセット")
    ballExpla1 = createElement("label", "赤玉")
    ballExpla2 = createElement("label", "青玉")
    speedExpla = createElement("label", "速度[m/s]")
    speedButton1 = createInput(75, "number", 0.1);
    speedButton2 = createInput(75, "number");
    angleExpla = createElement("label", "角度[°]")
    angleButton1 = createInput(30, "number");
    angleButton2 = createInput(60, "number");
    weightExpla = createElement("label", "質量[kg]")
    weightButton1 = createInput(10, "number");
    weightButton2 = createInput(10, "number");
    heightExpla = createElement("label", "高さ[m]")
    heightButton1 = createInput(0, "number");
    heightButton2 = createInput(0, "number");
    konstantExpla = createElement("label", "空気抵抗係数");
    konstantButton1 = createInput(0, "number");
    konstantButton2 = createInput(0, "number");
}

//基本的なボタンの初期設定の手続き
function buttonSettings() {
    backgroundDiv.size(width, 3 * windowHeight / 10).style("background-color", "white")
    startButton.mousePressed(moveButtonAction).size(windowWidth / 8, 3 * windowHeight / 10).position(0, height).addClass("btn btn-outline-primary").parent(backgroundDiv)
    stopButton.mousePressed(moveButtonAction).size(windowWidth / 8, 3 * windowHeight / 10).position(0, height).addClass("btn btn-outline-danger").hide().parent(backgroundDiv)
    resetButton.mousePressed(resetButtonAction).size(windowWidth / 8, 3 * windowHeight / 10).position(windowWidth / 8, height).addClass("btn btn-outline-secondary").parent(backgroundDiv)
    ballExpla1.size(windowWidth / 8, windowHeight / 10).position(2 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    ballExpla2.size(windowWidth / 8, windowHeight / 10).position(2 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    speedExpla.size(windowWidth / 8, windowHeight / 10).position(3 * windowWidth / 8, height).addClass("btn btn-light").parent(backgroundDiv)
    speedButton1.size(windowWidth / 8, windowHeight / 10).position(3 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    speedButton2.size(windowWidth / 8, windowHeight / 10).position(3 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    angleExpla.size(windowWidth / 8, windowHeight / 10).position(4 * windowWidth / 8, height).addClass("btn btn-light").parent(backgroundDiv)
    angleButton1.size(windowWidth / 8, windowHeight / 10).position(4 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light ").parent(backgroundDiv)
    angleButton2.size(windowWidth / 8, windowHeight / 10).position(4 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    weightExpla.size(windowWidth / 8, windowHeight / 10).position(5 * windowWidth / 8, height).addClass("btn btn-light").parent(backgroundDiv)
    weightButton1.size(windowWidth / 8, windowHeight / 10).position(5 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    weightButton2.size(windowWidth / 8, windowHeight / 10).position(5 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    heightExpla.size(windowWidth / 8, windowHeight / 10).position(6 * windowWidth / 8, height).addClass("btn btn-light").parent(backgroundDiv)
    heightButton1.size(windowWidth / 8, windowHeight / 10).position(6 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    heightButton2.size(windowWidth / 8, windowHeight / 10).position(6 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    konstantExpla.size(windowWidth / 8, windowHeight / 10).position(7 * windowWidth / 8, height).addClass("btn btn-light").parent(backgroundDiv)
    konstantButton1.size(windowWidth / 8, windowHeight / 10).position(7 * windowWidth / 8, height + windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
    konstantButton2.size(windowWidth / 8, windowHeight / 10).position(7 * windowWidth / 8, height + 2 * windowHeight / 10).addClass("btn btn-light").parent(backgroundDiv)
}

//スタートストップボタンの手続き
function moveButtonAction() {
    if (clickedCount == false) {
        clickedCount = true;
        resetCount = false;
        startButton.hide()
        stopButton.show()
    } else {
        clickedCount = false;
        startButton.show()
        stopButton.hide()
    }
}

//リセットボタンの手続き
function resetButtonAction() {
    initSettings()
    clickedCount = false;
    resetCount = true;
    startButton.show()
    stopButton.hide()
}

let radi;
let clickedCount, resetCount;
let count;
let pg;
let b1, b2;

function initSettings() {
    radi = width / 50;
    clickedCount = false;
    resetCount = true;
    count = 0;
    pg = createGraphics(width, height);
    b1 = new Ball(50, 9 * height / 10 - radi - heightButton1.value(), speedButton1.value(), angleButton1.value(), weightButton1.value(), 9 * height / 10 - radi - heightButton1.value(), konstantButton1.value(), 1);
    b2 = new Ball(50, 9 * height / 10 - radi - heightButton2.value(), speedButton2.value(), angleButton2.value(), weightButton2.value(), 9 * height / 10 - radi - heightButton2.value(), konstantButton2.value(), 2);
    textSize(width / 100);
    textAlign(CENTER, CENTER);
}

//setup関数
function setup() {
    fullScreen();
    buttonCreation();
    initSettings()
    buttonSettings();
}

//draw関数
function draw() {
    if (clickedCount == true) {
        count += 10;
    } else if (resetCount == true) {
        b1 = new Ball(50, 9 * height / 10 - radi, speedButton1.value(), angleButton1.value(), weightButton1.value(), 9 * height / 10 - radi - heightButton1.value(), konstantButton1.value(), 1);
        b2 = new Ball(50, 9 * height / 10 - radi, speedButton2.value(), angleButton2.value(), weightButton2.value(), 9 * height / 10 - radi - heightButton2.value(), konstantButton2.value(), 2);
    }
    backGround();
    b1._draw();
    b2._draw();
}

//背景色の手続き
function backGround() {
    background(255);
    if (clickedCount == true) {
        pg.fill(255, 0, 0);
        pg.ellipse(b1.posx, b1.posy, 5, 5);
        pg.fill(0, 0, 255);
        pg.ellipse(b2.posx, b2.posy, 5, 5);
    }
    if (resetCount == true) {
        pg.fill(255);
        pg.rect(0, 0, width, height);
    }
    image(pg, 0, 0);
    stroke(0, 100);
    for (let i = 0; i < 9 * height / 10; i += 10) {
        if (i % 100 == 0) {
            strokeWeight(2);
        }
        else {
            strokeWeight(1);
        }
        line(50, 9 * height / 10 - radi - i, width, 9 * height / 10 - radi - i);
    }
    for (let i = 0; i < width; i += 10) {
        if (i % 100 == 0) {
            strokeWeight(2);
        }
        else {
            strokeWeight(1);
        }
        line(i + 50, 0, i + 50, 9 * height / 10 - radi);
    }
    fill(100, 150);
    rect(0, height - height / 10, width, height / 10);
    fill(0);
    for (let i = 0; i < width - 50; i += 100) {
        text(i, 50 + i, 9 * height / 10 + 10);
    }
    for (let i = 0; i < 9 * height / 10; i += 100) {
        text(i, 20, 9 * height / 10 - i - radi);
    }
}


//ボールオブジェクト
class Ball {
    constructor(x, y, s, t, w, y0, k, n) {
        this.posx = x;
        this.posy = y;
        this.speed = s;
        this.theta = t;
        this.weight = w;
        this.konstant = k;
        this.number = n;
        this.posx0 = 50;
        this.posy0 = y0;
        this.gravity = 9.8;
        this.fps = 60
    }
    _draw() {
        if (clickedCount == true) {
            if (this.posy >= 9 * height / 10 - radi && this.posx != 50) {
                this.posy = 9 * height / 10 - radi;
            }
            else {
                if (this.konstant >= 0.1) {
                    this.posx = this.weight / this.konstant * this.speed * cos(radians(this.theta)) * (-exp((-this.konstant / this.weight) * (count / this.fps)) + 1) + this.posx0;
                    this.posy = this.weight / this.konstant * (-this.speed * sin(radians(this.theta)) - this.weight * this.gravity / this.konstant) * (-exp((-this.konstant / this.weight) * (count / this.fps)) + 1) + (this.weight * this.gravity / this.konstant) * count / this.fps + this.posy0;
                }
                else {
                    this.posx = this.speed * cos(radians(this.theta)) * count / this.fps + this.posx0;
                    this.posy = -this.speed * sin(radians(this.theta)) * (count / this.fps) + (0.5) * this.gravity * sq(count / this.fps) + this.posy0;
                }
            }
        }
        else if (resetCount == true) {
            this.posx = this.posx0;
            this.posy = this.posy0;
        }
        if (this.number == 1) {
            fill(255, 0, 0, 100);
        }
        if (this.number == 2) {
            fill(0, 0, 255, 100);
        }
        strokeWeight(1);
        ellipse(this.posx, this.posy, radi * 2, radi * 2);
        if (clickedCount == false) {
            strokeWeight(3);
            line(this.posx, this.posy, this.posx + 100 * cos(radians(-this.theta)), this.posy + 100 * sin(radians(-this.theta)));
        }
    }

}


