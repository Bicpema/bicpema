import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const BALL_COLOR = [80, 80, 120];
const GRAVITY = 9.8;
const SCALE_FACTOR = 0.25 / 300;
const T_WAVE = 60;
const PENDULUM_COUNT = 100;
const N_START = 50;
const INIT_ANGLE = Math.PI / 8;

let balls;
let count = 0;
let clickedCount = false;
let ballRadius;

function initBalls() {
    balls = new Array(PENDULUM_COUNT);
    for (let i = 0; i < PENDULUM_COUNT; i++) {
        const n = N_START + i;
        const omega = (2 * Math.PI * n) / T_WAVE;
        const L = GRAVITY / (omega * omega * SCALE_FACTOR);
        balls[i] = new Ball(L, INIT_ANGLE);
    }
}

function fullScreen() {
    createCanvas(windowWidth, windowHeight);
}

function setup() {
    fullScreen();
    ballRadius = width / 80;
    textSize(width / 25);
    textAlign(LEFT, TOP);
    initBalls();
    count = 0;
    clickedCount = false;

    const startBtn = document.getElementById("startButton");
    const stopBtn = document.getElementById("stopButton");
    const resetBtn = document.getElementById("resetButton");
    if (startBtn) startBtn.addEventListener("click", () => { clickedCount = true; });
    if (stopBtn) stopBtn.addEventListener("click", () => { clickedCount = false; });
    if (resetBtn) resetBtn.addEventListener("click", () => {
        count = 0;
        clickedCount = false;
        initBalls();
    });
}

function draw() {
    background(255);
    stroke(0, 100);
    strokeWeight(1);
    for (let i = 0; i < PENDULUM_COUNT; i++) {
        balls[i].move();
        balls[i].display();
    }
    fill(0);
    noStroke();
    text(nf(count / 60, 1, 2) + "s", 20, 20);
    if (clickedCount) {
        count++;
    }
}

class Ball {
    constructor(L, t0) {
        this.pendulumLength = L;
        this.theta0 = t0;
        this.posx = 0;
        this.posy = 0;
    }

    move() {
        const omega = sqrt(GRAVITY / (this.pendulumLength * SCALE_FACTOR));
        const angle = this.theta0 * sin(omega * count / 60);
        this.posx = width / 2 + this.pendulumLength * sin(angle);
        this.posy = 100 + this.pendulumLength * cos(angle);
    }

    display() {
        line(width / 2, 100, this.posx, this.posy);
        fill(BALL_COLOR[0], BALL_COLOR[1], BALL_COLOR[2]);
        noStroke();
        ellipse(this.posx, this.posy, ballRadius * 2, ballRadius * 2);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ballRadius = width / 80;
    textSize(width / 25);
}

window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
new p5();
