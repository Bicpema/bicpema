// index.jsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const NAV_H = 60;

let particles = [];
let N = 80;
let A = 40;
let lambda = 200;
let k;
let omega = 0.1;
let t = 0;
let moveBtn,resetBtn;
let running = false;
let times;

let focusIndex;
let xStart = 60;   // 波の出発点（左端）

window.setup = function() {
  let cnv = createCanvas(windowWidth, windowHeight - NAV_H);
  cnv.parent('p5Canvas');
  k = TWO_PI / lambda;

  initParticles();
  focusIndex = floor(N / 2);

  moveBtn = createButton("スタート");
  moveBtn.parent('p5Container');
  moveBtn.size(96,48);
  moveBtn.style("background-color", "#03A9F4");
  moveBtn.style("font", "20px");  
  moveBtn.style("font-weight", "bold");  
  moveBtn.style("border-radius", "5px");
  moveBtn.style("border", "none");
  moveBtn.style("color", "#fff");  
  moveBtn.mousePressed(toggleMove);
  
  resetBtn = createButton("リセット");
  resetBtn.parent('p5Container');
  resetBtn.size(96,48);
  resetBtn.style("background-color", "#9E9E9E");
  resetBtn.style("font-weight", "bold");  
  resetBtn.style("color", "#fff");  
  resetBtn.style("border-radius", "5px");
  resetBtn.style("border", "none");
  resetBtn.mousePressed(() => {
    t = 0;
    running = false;
    moveBtn.html("スタート");
    moveBtn.style("background-color", "#03A9F4");
  });

  times = createSlider(10, 60, 30, 1);
  times.parent('p5Container');
  times.size(120);

  positionElements();
}

function initParticles() {
  particles = [];
  for (let i = 0; i < N; i++) {
    let x0 = map(i, 0, N - 1, xStart, width - 60);
    particles.push({ x0 });
  }
}

function positionElements() {
  moveBtn.position(width/2-100, height - 60);
  resetBtn.position(width/2+4, height - 60);
  times.position(width/2-250, height - 45);
}

window.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight - NAV_H);
  initParticles();
  positionElements();
}

function toggleMove() {
  running = !running;
  if(running == false){
    moveBtn.html("スタート"); 
    moveBtn.style("background-color",  "#03A9F4");
  }if(running == true){
    moveBtn.html("ストップ");
    moveBtn.style("background-color", "#F44336");
  }
}

window.draw = function() {
  frameRate(times.value());
  background(255);
  if (running) t += 1;

  drawLongitudinal();
  drawConvertedTransverse();
}

// 変位
function displacement(x0) {
  let v = omega / k;                    // 波の速さ
  let arrivalTime = (x0 - xStart) / v;

  if (t <= arrivalTime) {
    return 0;
  } else {
    // k*(x0 - xStart) とすることで、波の出発点(xStart)での位相を基準にします
    // ここではサイン波のマイナス（変位の方向合わせ）を採用しています
    return -A * sin(k * (x0 - xStart) - omega * t);
  }
}

// 縦波
function drawLongitudinal() {
  push();
  translate(0, height / 3);

  drawAxis("縦波");

  for (let p of particles) {
    let dx = displacement(p.x0);
    let x = p.x0 + dx;

    stroke(180);
    line(x, -50, x, 50);
    fill(255, 0, 0);
    noStroke();
    circle(x, 0, 5);
  }

  // 注目粒子
  let p = particles[focusIndex];
  let dx = displacement(p.x0);
  let xNow = p.x0 + dx;

  fill(0, 100, 255);
  circle(p.x0, 0, 8); // 平衡点（青）

  fill(255, 0, 0);
  circle(xNow, 0, 8); // 現在位置（赤）

  // --- 修正箇所：波が到達したら矢印を描画 ---
  let v = omega / k;
  let arrivalTime = (p.x0 - xStart) / v;
  // 現在時刻 t が到達時刻 arrivalTime を超えていたら矢印を描く
  if (t > arrivalTime) {
    drawArrow(p.x0, 0, xNow, 0);
  }
  // -------------------------------------------

  pop();
}

// 横波
function drawConvertedTransverse() {
  push();
  translate(0, height * 2 / 3);

  drawAxis("横波");

  // 波の線自体を細かく描写
  noFill();
  stroke(255,0,0);
  strokeWeight(1);
  beginShape();
  for (let x = xStart; x < width - 60; x ++) {
    let dy = displacement(x);
    // 縦波の変位 dx を横波の変位 dy として上方向（マイナスY方向）にプロット
    vertex(x, -dy);
  }
  endShape();

  // 媒質の点
  for (let p of particles) {
    let dy = displacement(p.x0);
    fill(255, 0, 0);
    noStroke();
    circle(p.x0, -dy, 5);
    stroke(255,0,0,100);
    line(p.x0, 0, p.x0, -dy)
  }

  // 注目粒子
  let p = particles[focusIndex];
  let dy = displacement(p.x0);

  noStroke();
  fill(0, 100, 255);
  circle(p.x0, 0, 8); // 平衡点（青）
  fill(255, 0, 0);
  circle(p.x0, -dy, 8); // 現在位置（赤）
  

  // --- 修正箇所：波が到達したら矢印を描画 ---
  let v = omega / k;
  let arrivalTime = (p.x0 - xStart) / v;
  // 現在時刻 t が到達時刻 arrivalTime を超えていたら矢印を描く
  if (t > arrivalTime) {
    drawArrow(p.x0, 0, p.x0, -dy);
  }
  // -------------------------------------------

  pop();
}

function drawArrow(x1, y1, x2, y2) {
  // 始点と終点がほぼ同じ場合は描画しない（ちらつき防止）
  if (dist(x1, y1, x2, y2) < 1) return;

  stroke(0, 200, 0);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  let s = 8; // 矢印の頭のサイズ
  push();
  translate(x2, y2);
  rotate(angle);
  fill(0, 200, 0);
  noStroke();
  triangle(0, 0, -s, s / 2, -s, -s / 2);
  pop();
}

function drawAxis(title) {
  stroke(0);
  strokeWeight(1);
  line(50, 0, width - 50, 0);
  fill(0);
  triangle(width - 50, 0, width - 60, -4, width - 60, 4);
  noStroke();
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text(title, 60, -60);
}
new p5();
