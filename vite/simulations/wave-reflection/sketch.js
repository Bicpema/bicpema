// ===== 自由端反射・固定端反射 切り替えシミュレーション =====
// 青：入射波　赤：反射波　緑：合成波

let t = 0;
let k, omega,v;
let A;

let running = false;
let moveBtn, resetBtn, modeBtn;

// 反射位置
let reflectX;

// 波の先端（入射波基準）
let front = 0;

// モード
let mode = "free"; // "free" or "fixed"

function setup() {
  createCanvas(1200, 400);
  
  let wavelength = 200;
  A = wavelength/4;
  k = TWO_PI / wavelength;
  omega = TWO_PI / 120;
  v = omega / k;
  reflectX = width / 2;

  moveBtn = createButton("スタート");
  moveBtn.position(width/2-192, height + 10);
  moveBtn.size(96,48);
  moveBtn.style("background-color", "#03A9F4");
  moveBtn.style("font", "20px");  
  moveBtn.style("font-weight", "bold");  
  moveBtn.style("border-radius", "5px");
  moveBtn.style("border", "none");
  moveBtn.style("color", "#fff");  
  moveBtn.mousePressed(toggleMove);
  

  resetBtn = createButton("リセット");
  resetBtn.position(width/2+96, height + 10);
  resetBtn.size(96,48);
  resetBtn.style("background-color", "#9E9E9E");
  resetBtn.style("font-weight", "bold");  
  resetBtn.style("color", "#fff");  
  resetBtn.style("border-radius", "5px");
  resetBtn.style("border", "none");
  resetBtn.mousePressed(resetSim);
  
  modeBtn = createButton("自由端");
  modeBtn.position(width/2-48, height + 10);
  modeBtn.size(96,48);
  modeBtn.style("background-color", "#FF9800");
  modeBtn.style("font-weight", "bold");  
  modeBtn.style("color", "#fff");  
  modeBtn.style("border-radius", "5px");
  modeBtn.style("border", "none");

    modeBtn.mousePressed(toggleMode);
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

function toggleMode() {
  mode = (mode === "free") ? "fixed" : "free";
  if(mode === "free"){
    modeBtn.html("自由端"); 
    modeBtn.style("background-color", "#FF9800");
  }else{
    modeBtn.html("固定端");
    modeBtn.style("background-color", "#4CAF50");
  }
}

function resetSim() {
  t = 0;
  front = 0;
  running = false;
}

function draw() {
  background(255);
  
  drawGrid();
  drawReflectWall();
  noFill();

  // ===== 入射波（青・実線）=====
  stroke(0, 0, 255);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x < width; x++) {
    if (x <= min(front, reflectX)) {
      let y = A * sin(k * x - omega * t);
      vertex(x, height / 2 + y);
    }
  }
  endShape();

  // ===== 入射波（壁より右・点線）=====
  stroke(0, 0, 255);
  drawingContext.setLineDash([6, 6]);
  beginShape();
  for (let x = 0; x < width; x++) {
    if (x >= reflectX && x <= front) {
      let y = A * sin(k * x - omega * t);
      vertex(x, height / 2 + y);
    }
  }
  endShape();
  drawingContext.setLineDash([]);

  // ===== 反射波（赤・実線）=====
  if (front > reflectX) {
    let reflectedFront = max(0, 2 * reflectX - front);

    stroke(255, 0, 0);
    strokeWeight(2);
    beginShape();
    for (let x = 0; x < width; x++) {
      if (x >= reflectedFront && x <= reflectX) {
        let y = A * sin(k * (width-x) - omega * t);
        if (mode === "fixed") y *= -1;
        vertex(x, height / 2 + y);
      }
    }
    endShape();

    // ===== 固定端：壁より右の仮想反射波（赤・点線）=====
    if (mode === "fixed") {
      stroke(255, 0, 0);
      drawingContext.setLineDash([6, 6]);
      beginShape();
      for (let x = 0; x < width; x++) {
        if (x >= reflectX && x <= front) {
          let y = -A * sin(k * (width-x) - omega * t);
          vertex(x, height / 2 + y);
        }
      }
      endShape();
      drawingContext.setLineDash([]);
    }
  }

  // ===== 合成波（緑）=====
  if (front > reflectX) {
    let reflectedFront = max(0, 2 * reflectX - front);

    stroke(0, 160, 0);
    strokeWeight(2.5);
    beginShape();
    for (let x = 0; x < width; x++) {
      if (x >= reflectedFront && x <= reflectX) {
        let yIncident = A * sin(k * x - omega * t);
        let yReflected = A * sin(k * (width-x) - omega * t);
        if (mode === "fixed") yReflected *= -1;

        vertex(x,height / 2 + (yIncident + yReflected));
      }
    }
    endShape();
    strokeWeight(8)
    if(mode === "free"){
      point(reflectX,height/2 + 2 * A * sin(k * reflectX - omega * t))
    }else{
      (point(reflectX,height/2))
    }
  }

  if (running) {
    t += v;
    front = min(v*t, 2 * reflectX);
  }
}

// ===== グリッド =====
function drawGrid() {
  stroke(142,216,236);
  strokeWeight(1);

  let wavelength = TWO_PI / k;
  let gridX = wavelength / 8;

  for (let x = 0; x <= width; x += gridX) {
    line(x, 0, x, height);
  }

  let y0 = height / 2;
  for (let y = y0 - 4 * A; y <= y0 + 4 * A; y += A / 2) {
    line(0, y, width, y);
  }
  stroke(0);
  strokeWeight(2);
  line(0, height/2, width, height/2);
}

// ===== 反射壁 =====
function drawReflectWall() {
  if(mode === "free"){
    stroke(236,193,56);
  }
  else{
    stroke(0,171,158);
  }
  strokeWeight(3);
  line(reflectX, 0, reflectX, height);
}
