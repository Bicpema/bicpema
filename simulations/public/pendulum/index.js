let radi = 0;
let clickedCount;
let gridIs;
let gravity = 0;
let count = 0;

let leftPendulum;
let rightPendulum;

function fullScreen() {
    createCanvas(windowWidth, 9 * windowHeight / 10);
}

let ball;
function preload() {
    ball = loadImage("/assets/img/metalBallImg.png");
}


function startButtonFunction() {
    clickedCount = true
}

function stopButtonFunction() {
    clickedCount = false
}

function resetButtonFunction() {
    initValue()
}

function gridButtonFunction() {
    if (gridIs == true) {
        gridIs = false
    } else {
        gridIs = true
    }
}

function inputFunction() {
    leftPendulum.theta0 = leftAngleInput.value()
    leftPendulum.stringLength = leftLengthInput.value() * 50
    rightPendulum.theta0 = rightAngleInput.value()
    rightPendulum.stringLength = rightLengthInput.value() * 50
}

let startButton,
    stopButton,
    resetButton,
    gridButton;
let leftAngleInput,
    leftLengthInput,
    rightAngleInput,
    rightLengthInput;
function elCreate() {
    startButton = select("#startButton")
    stopButton = select("#stopButton")
    resetButton = select("#resetButton")
    gridButton = select("#gridButton")
    leftAngleInput = select("#leftAngleInput")
    leftLengthInput = select("#leftLengthInput")
    rightAngleInput = select("#rightAngleInput")
    rightLengthInput = select("#rightLengthInput")
}

function elInit() {
    startButton.mousePressed(startButtonFunction)
    stopButton.mousePressed(stopButtonFunction)
    gridButton.mousePressed(gridButtonFunction)
    resetButton.mousePressed(resetButtonFunction)
    leftAngleInput.input(inputFunction)
    leftLengthInput.input(inputFunction)
    rightAngleInput.input(inputFunction)
    rightLengthInput.input(inputFunction)
}

function initValue() {
    radi = width / 50;
    clickedCount = false;
    gridIs = false;
    gravity = 9.8;
    count = 0;
    ball.resize(width / 18, 0);
    leftPendulum = new Ball(500, 10);
    rightPendulum = new Ball(500, 15);
}

function setup() {
    fullScreen();
    elCreate();
    elInit();
    initValue();
}

function draw() {
    background(255);
    if (clickedCount) count += 1;
    background_setting();
    leftPendulum.calculate(0);
    rightPendulum.calculate(width / 3);
    leftPendulum.display(0);
    rightPendulum.display(width / 3);
    leftPendulum.calculate(2 * width / 3);
    rightPendulum.calculate(2 * width / 3);
    tint(255, 150);
    stroke(0, 150);
    leftPendulum.display(2 * width / 3);
    rightPendulum.display(2 * width / 3);
    tint(255);
}

function background_setting() {
    for (let i = 0; i < 3; i++) {
        stroke(0, 100);
        if (gridIs == true) {
            for (let f = -width / 6; f < width / 6; f += 10) {
                if (f % 50 == 0) {
                    strokeWeight(3);
                }
                else {
                    strokeWeight(1);
                }
                line(f + width / 3 * i + width / 6, 0, f + width / 3 * i + width / 6, height);
            }
            for (let f = 0; f < height; f += 10) {
                if (f % 50 == 0) {
                    strokeWeight(3);
                }
                else {
                    strokeWeight(1);
                }
                line(width / 3 * i, f, width / 3 * i + width / 3, f);
            }
        }
        noFill();
        stroke(0);
        strokeWeight(5);
        rect(width / 3 * i, 0, width / 3, height);
    }
}


class Ball {
    constructor(s_l, t_0) {
        this.posx = 0;
        this.posy = 0;
        this.theta = 0;
        this.material = 0;
        this.panelCount = 0;
        this.stringLength = s_l;
        this.theta0 = t_0;
        this.theta = radians(this.theta0) * cos(sqrt(gravity / (this.stringLength / float(50 * 100))) * count / 60);
    }


    calculate(n) {
        this.posx = n + width / 6 + this.stringLength * sin(this.theta);
        this.posy = 100 + this.stringLength * cos(this.theta);
        this.theta = radians(this.theta0) * cos(sqrt(gravity / (this.stringLength / float(50 * 100))) * count / 60);
    }

    display(n) {
        line(this.posx, this.posy, n + width / 6, 100);
        image(ball, this.posx - radi, this.posy - radi, radi * 2, radi * 2);
    }

}
function windowResized() {
    resizeCanvas(windowWidth, 9 * windowHeight / 10);
}
