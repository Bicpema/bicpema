// ===== 図(a)：進行波の発射 → 重なり → 定常波 =====
// 赤：右向き進行波　青：左向き進行波　緑：合成波（定常波）

const NAV_H = 60;

let margin;
let innerW;
let innerH; 
let cols;
let dx;

let t = 0;
let wavelength = 200;
let A = 40;
let k, omega, v;
let running = false;
let moveBtn, resetBtn;

// 波の先端
let rightFront = 0;
let leftFront;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - NAV_H);
  cnv.parent('p5Canvas');
  
  initParams();

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
    rightFront = 0;
    leftFront = innerW;
    running = false;
    moveBtn.html("スタート");
    moveBtn.style("background-color", "#03A9F4");
  });

  positionButtons();
}

function initParams() {
  margin = 50;
  innerW = width - margin * 2;
  innerH = height - margin * 2;
  cols = innerW / 4;
  dx = innerW / (cols);
  k = TWO_PI / wavelength;
  omega = TWO_PI / 120;
  v = omega / k;
  leftFront = innerW;
}

function positionButtons() {
  moveBtn.position(width/2-100, height - 60);
  resetBtn.position(width/2+4, height - 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - NAV_H);
  initParams();
  positionButtons();
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

function draw() {
  background(211,237,244);
  
  push();
  translate(margin, margin);
  noStroke();
  rect(0,0,innerW,innerH);

  // コンテンツの描画
  drawGrid();
  drawXAxis();
  drawRightWave();
  drawLeftWave();
  drawStandingWave();
  pop();
  
  if (running) {
    t += v;
    rightFront = min(v*t, innerW);
    leftFront = max(innerW-v*t, 0);
  }
}

// ===== グリッド描画 =====
function drawGrid() {
  stroke(200);
  strokeWeight(1);
  
  // --- 横グリッド ---
  let yCenter = innerH / 2;
  let gridUnitY = wavelength / 8;

  for (let y = yCenter;
       y <= innerH;
       y += gridUnitY) {
    line(0, y, innerW, y);
  }
   for (let y = yCenter;
       y >= 0;
       y -= gridUnitY) {
    line(0, y, innerW, y);
  }
  
  // --- 縦グリッド ---
  let xCenter = innerW / 2;
  let gridUnitX = wavelength/ 8;

  for (let x = xCenter;
       x <= innerW;
       x += gridUnitX) {
    line(x, 0, x, innerH);
  }
   for (let x = xCenter;
       x >= 0;
       x -= gridUnitX) {
    line(x, 0, x, innerH);
  }
}

// ===== 横軸（x軸）＋矢印 =====
function drawXAxis() {
  let yAxis = innerH / 2;
  
  // 横軸
  stroke(0);
  strokeWeight(2);
  line(0, yAxis, innerW-1, yAxis);

  // 矢印
  strokeWeight(1);
  fill(0);
  triangle(innerW - 10, yAxis - 5, innerW - 10, yAxis + 5, innerW, yAxis);

  // 軸ラベル
  noStroke();
  fill(0);
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text("x", innerW - 5, yAxis + 20);
}

// 右向き進行波
function drawRightWave(){
  stroke(255,0,0); 
  strokeWeight(2);
  noFill();
  beginShape();
  for(let x=0;x<innerW;x++){
    if(x<rightFront){
      let y = A*sin(k*x - omega*t);
      vertex(x,innerH/2+y);
  } 
  }
  endShape();
}

// 左向き進行波
function drawLeftWave(){
  stroke(0,0,255);
  strokeWeight(2);  
  noFill();
  beginShape();
  for(let x=0;x<innerW;x++){
    if(x>leftFront){
      let y = A*sin(k*x + omega*t);
      vertex(x,innerH/2+y);
    }  
  }
  
  endShape();
}

// 合成波（定常波）
function drawStandingWave(){
  stroke(0,180,0);
  strokeWeight(2);
  noFill();

  beginShape();
  for(let x=0;x<innerW;x++){
    if (x <= rightFront && x >= leftFront) {
      let y1 = A*sin(k*x - omega*t);
      let y2 = A*sin(k*(innerW-x) - omega*t);
      let y = y1 + y2;
      vertex(x,innerH/2+y);
    }
  }
  endShape();
}