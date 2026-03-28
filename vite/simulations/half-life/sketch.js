const NAV_H = 60;

let img;
let currentTime = 0;
let halfLife = 5730;
let maxYears = halfLife*5;
let T=halfLife/150; // 経過時間
// let n_slider;
let n=8; // 描画する原子の一辺の数
let N0=n*n; // 初期の炭素の量

let atoms = [];
let isRunning = false;
let radioBtns;
let btnToggle;
let plusBtn, minusBtn;
let count=0;

function preload(){
  img=loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fhalf-life%2FatomImage.png?alt=media&token=9583f019-b011-419b-a27e-8e769e435788");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - NAV_H); 
  cnv.parent('p5Canvas');
  frameRate(30);

  //  物質の選択ラジオボタン
  radioBtns = createRadio();
  radioBtns.parent('p5Container');
  radioBtns.option('5730', '炭素 C-14');
  radioBtns.option('8', 'ヨウ素 I-131');
  radioBtns.option('30', 'セシウム Cs-137');
  
  radioBtns.selected('5730');
  radioBtns.style('display', 'flex');       // flexボックスにする
  radioBtns.style('flex-direction', 'column'); // 縦方向に並べる
  radioBtns.style('color', 'white');
  radioBtns.changed(() => {
    halfLife = (radioBtns.value());
    maxYears = halfLife * 5;
    T=halfLife/150;
    currentTime = 0;
    initAtoms();
  });

  // トグルボタン
  btnToggle = createButton('スタート');
  btnToggle.parent('p5Container');
  btnToggle.size(96,48);
  btnToggle.style("font-size","16px");
  btnToggle.style("font-weight","bold");
  btnToggle.style("color","#fff");
  btnToggle.style("border","none");
  btnToggle.style("border-radius","5px");
  btnToggle.style("background-color","#03A9F4");
  btnToggle.mousePressed(toggleSimulation);

  plusBtn = createButton("＋");
  plusBtn.parent('p5Container');
  plusBtn.size(30,30);
  plusBtn.style("background-color", "#e06941");
  plusBtn.style("border-radius", "15px");
  plusBtn.style("font-weight", "bold");
  plusBtn.style("font-size", "16px");
  plusBtn.style("border", "none");
  plusBtn.style("color", "white");  
  plusBtn.mousePressed(() => {
    n = constrain(n+1, 4, 30);
    N0 = pow(n,2);
    currentTime = 0;
    initAtoms();
  });

  minusBtn = createButton("ー");
  minusBtn.parent('p5Container');
  minusBtn.size(30,30);
  minusBtn.style("background-color", "#4169e1");
  minusBtn.style("border-radius", "15px");
  minusBtn.style("font-weight", "bold");
  minusBtn.style("font-size", "16px");
  minusBtn.style("border", "none");
  minusBtn.style("color", "white");  
  minusBtn.mousePressed(() => {
    n = constrain(n-1, 4, 30);
    N0 = pow(n,2);
    currentTime = 0;
    initAtoms();
  });
  
  positionElements();
  initAtoms();
}

function positionElements() {
  radioBtns.position(250, 50);
  btnToggle.position(width-120, height/2);
  plusBtn.position(width - 160, 290);
  minusBtn.position(width-70, 290);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - NAV_H);
  positionElements();
}

function toggleSimulation() {
  isRunning = !isRunning;
  if (isRunning) {
    btnToggle.html('ストップ');
    btnToggle.style("background-color","#F44336");
  } else {
    btnToggle.html('スタート');
    btnToggle.style("background-color","#03A9F4");
  }
}

function initAtoms() {
  atoms = [];
  for (let i = 0; i < N0; i++) {
    atoms.push(random(0, 1));
  }
  
}

function draw() {
  background(255);
  
  if (isRunning) {
    currentTime += T;
  }

  if (currentTime > maxYears) {
    currentTime = 0;
    initAtoms();
    
  }
  
  let padding = 80;
  let graphW = width - padding * 2;
  let bottomY = height - 150; 
  let topY = 100;

  // ---  軸とタイトルの描画 ---
  drawHalfLifeGuides(padding, graphW, bottomY, topY);
  drawAxes(padding, graphW, bottomY, topY);
  

  // --- 崩壊曲線の描画 ---
  drawDecayCurve(padding, graphW, bottomY, topY);

  // --- マーカー ---
  let currentDecayRate = pow(0.5, currentTime / halfLife);
  let markerX = map(currentTime, 0, maxYears, padding, padding + graphW);
  let markerY = map(currentDecayRate * N0, 0, N0, bottomY, topY);

  fill("#F32121");
  noStroke();
  ellipse(markerX, markerY, 10, 10);
 
  // --- 原子崩壊の様子 ---
  drawAtomGrid(width - 250, 80, 200, currentDecayRate);
  drawAtomImage();
  
}

function drawAxes(p, w, bY, tY) {
  // X軸
  stroke(0); strokeWeight(2);
  line(p, bY, width - p, bY);
  noStroke(); fill(0);
  triangle(width - p, bY - 5, width - p, bY + 5, width - p + 10, bY); 
  // Y軸
  stroke(0); strokeWeight(2); 
  line(p, bY, p, tY-30);
  fill(0); noStroke();
  triangle(p - 5, tY - 25, p + 5, tY - 25, p, tY - 35);
  // X軸タイトル
  textAlign(CENTER);
  textSize(13);
  if(halfLife == 8){
  text("経過日数 (日)", p + w/2, bY + 50);
  }
  else{
    text("経過年数 (年)", p + w/2, bY + 50);
  }  
  // Y軸タイトル
  push();
  translate(p - 50, (bY + tY) / 2);
  textAlign(CENTER,CENTER);
  textLeading(13);
  if(halfLife == 8){
    text("ヨ\nウ\n素\nの\n量", 0, 0);
  }
  else if(halfLife == 5730){
    text("炭\n素\nの\n量", 0, 0);
  }
  else if(halfLife == 4470){
    text("ウ\nラ\nン\nの\n量", 0, 0);
  } 
  pop();
}

function drawHalfLifeGuides(p, w, bY, tY) {
  for (let i = 0; i <= 4; i++) {
    let t_half = halfLife * i;
    let amount = N0 / pow(2, i);
    let x = map(t_half, 0, maxYears, p, p + w);
    let y = map(amount, 0, N0, bY, tY);
    stroke(72, 192, 225); strokeWeight(1);
    line(x, bY, x, y);
    line(p, y, x, y);
    fill(0); noStroke(); textSize(12);textAlign(CENTER,TOP);
    text(i*halfLife, x, bY + 5);
    textAlign(RIGHT,CENTER);
    
    if(i==0){
      text("1", p - 5, y);
    }else{
      text("1/"+pow(2,i), p - 5, y);
    }
  }
}

function drawDecayCurve(p, w, bY, tY) {
  noFill(); stroke( 0); strokeWeight(3);
  beginShape();
  for (let t = 0; t <= maxYears; t += T) {
    let n_t = N0 * pow(0.5, t / halfLife);
    let x = map(t, 0, maxYears, p, p + w);
    let y = map(n_t, 0, N0, bY, tY);
    vertex(x, y);
  }
  endShape();
}

function drawAtomGrid(xStart, yStart, size, decayRate) {
  let cols = n;
  let spacing = size / cols;
  let atomSize = spacing;
  count=0;
  push();
  translate(xStart, yStart);
  rectMode(CENTER);
  noStroke();
  fill("#A6DAF1"); 
  rect(-50, size/2, size*2.75, size*1.5,20,20);
  fill(255,252,230); 
  rect(size/2, size/2, size*1.05, size*1.05,10,10);
  for (let i = 0; i < N0; i++) {
    let row = floor(i / cols);
    let col = i % cols;
    if (decayRate < atoms[i]) {
      fill(30, 127, 180);// 崩壊
      count++;
    }
    else{
      fill(225, 84, 54); // 未崩壊
    }              
    ellipse(atomSize/2+col * spacing, atomSize/2+row * spacing, atomSize, atomSize);
  }
  fill(0); textAlign(CENTER,CENTER); textSize(20);noStroke();
  text("半減期シミュレーター", size/2, -20);
  text(N0+"個", 150, size*1.125);
  textAlign(LEFT,CENTER);
  text("原子の数", 0, size*1.125);
  pop();
}

function drawAtomImage(){
  push();
    translate(20,40);
    textLeading(20);textSize(16);fill(0);textAlign(LEFT,CENTER);
    text("放射線", 400, 145);
    image(img,200,100,img.width*0.3,img.height*0.3);
    textAlign(CENTER,TOP);
    if(halfLife == 8){
      text("ヨウ素131", 245, 210);
      text("キセノン131", 476, 210);
    }
    else if(halfLife == 5730){
      text("炭素14", 245, 210);
      text("窒素14", 476, 210);
    }
    else if(halfLife == 30){
      text("セシウム137", 255, 210);
      text("バリウム137", 466, 210);
    } 
    textSize(20);
    text(N0-count+"個", 245, 250);
    text(count+"個", 476, 250);
  pop();
}