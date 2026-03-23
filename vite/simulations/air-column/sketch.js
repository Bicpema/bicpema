let typeSelect;
let plusBtn, minusBtn, L_plusBtn, L_minusBtn;
let time = 0;
let type;
let m_n = 1;
let pipeL = 400;
let startX = 100;
let pipeY = 200;
let Amp = 40;
let waveLayer; // 静止画（残像）用のレイヤー

function setup() {
  createCanvas(800, 600);
  
  typeSelect = createSelect();
  typeSelect.position(210, 17);
  typeSelect.size(72,24)
  typeSelect.option('閉管', 'closed');
  typeSelect.option('開管', 'open');
  typeSelect.changed(() => {
    type = typeSelect.value();
    if (type === 'closed' && m_n % 2 === 0) {
      m_n = constrain(m_n - 1, 1, 9); 
    }
    updateWaveLayer();
  });
  
  plusBtn = createButton("＋");
  plusBtn.position(210, 50);
  plusBtn.size(28,28);
  plusBtn.style("background-color", "#e06941");
  plusBtn.style("border-radius", "20px");
  plusBtn.style("font-weight", "bold");
  plusBtn.style("font-size", "16px");
  plusBtn.style("border", "none");
  plusBtn.style("color", "white");
  plusBtn.mousePressed(() => {
    if (type === 'closed' ) {
      m_n = constrain(m_n+2, 1, 9);
      
    }else{
      m_n = constrain(m_n+1, 1, 9);
    }
    updateWaveLayer();
  });

  minusBtn = createButton("ー");
  minusBtn.position(290, 50);
  minusBtn.size(28,28);
  minusBtn.style("background-color", "#4169e1");
  minusBtn.style("border-radius", "15px");
  minusBtn.style("font-weight", "bold");
  minusBtn.style("font-size", "16px");
  minusBtn.style("border", "none");
  minusBtn.style("color", "white");  
  minusBtn.mousePressed(() => {
    if (type === 'closed' ) {
      m_n = constrain(m_n-2, 1, 9);
    }else{
    m_n = constrain(m_n-1, 1, 9);
    }
    updateWaveLayer();
  });
  
  L_plusBtn = createButton("＋");
  L_plusBtn.position(210, 85);
  L_plusBtn.size(28,28);
  L_plusBtn.style("background-color", "#e06941");
  L_plusBtn.style("border-radius", "20px");
  L_plusBtn.style("font-weight", "bold");
  L_plusBtn.style("font-size", "16px");
  L_plusBtn.style("border", "none");
  L_plusBtn.style("color", "white");
  L_plusBtn.mousePressed(() => {
    pipeL = constrain(pipeL+50, 200, 600);
    updateWaveLayer();
  });

  L_minusBtn = createButton("ー");
  L_minusBtn.position(290, 85);
  L_minusBtn.size(28,28);
  L_minusBtn.style("background-color", "#4169e1");
  L_minusBtn.style("border-radius", "15px");
  L_minusBtn.style("font-weight", "bold");
  L_minusBtn.style("font-size", "16px");
  L_minusBtn.style("border", "none");
  L_minusBtn.style("color", "white");  
  L_minusBtn.mousePressed(() => {
    pipeL = constrain(pipeL-50, 200, 600);
    updateWaveLayer();
  });
  
  // 残像を保持するレイヤーを作成
  waveLayer = createGraphics(width, height);
  updateWaveLayer();
}

// 静止した5本の線を一度だけ描画する関数
function updateWaveLayer() {
  waveLayer.clear(); // 前の描画を消去
  
  type = typeSelect.value();
  
  waveLayer.stroke(0, 100, 255, 100);
  waveLayer.noFill();
  
  // 事前に計算できる定数
  const freqConst = (type === 'closed') ? (m_n * PI) / (2 * pipeL) : (m_n * PI) / pipeL;

  let steps = 10;
  for (let i = 0; i < steps; i++) {
    let phase = map(i, 0, steps-1, -HALF_PI, HALF_PI);
    let currentAmp = Amp * sin(phase); // ループ内で一定の振幅
    
    waveLayer.beginShape(); 
    for (let x = 0; x <= pipeL; x++) {
      let yVal = currentAmp * cos(x * freqConst);
      waveLayer.vertex(startX + x, pipeY + yVal);
    }
    waveLayer.endShape();
  }
}

function draw() {
  background(255);
  
  // 1. 保存しておいた静止波（残像）を表示
  image(waveLayer, 0, 0);

  type = typeSelect.value();
  
  // --- 管やラベルの描画 ---
  drawUIContext(type, m_n);

  // 2. 現在の動く波（1本だけ計算）
  const freqConst = (type === 'closed') ? (m_n * PI) / (2 * pipeL) : (m_n * PI) / pipeL;

  noFill();
  stroke(0, 100, 255);
  strokeWeight(2);
  beginShape();
  let currentSin = sin(time);
  for (let x = 0; x <= pipeL; x++) {
    let yVal = Amp * cos(x * freqConst) * currentSin;
    vertex(startX + x, pipeY + yVal);
  }
  endShape();

  time += 0.05;
  drawFormula(type, m_n);
}

// 描画整理用の補助関数
function drawUIContext(type, m_n) {
  const pipeH = 100;
  fill(0); noStroke(); textSize(16); textAlign(LEFT);
  text(`現在のモード: `, 100, 35);
  text(`倍振動数 (${type === 'closed' ? 'm' : 'n'}): `, 100, 70);
  text(`気柱管の長さ: `, 100, 105);
  textAlign(CENTER);
  text(m_n,265,70);
  text(pipeL,265,105);  
  const dimY = pipeY + 100;
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(startX, pipeY + pipeH/2, startX, dimY + 10);
  line(startX + pipeL, pipeY + pipeH/2, startX + pipeL, dimY + 10);
  drawingContext.setLineDash([]);
  stroke(0);
  line(startX, dimY, startX + pipeL, dimY);
  line(startX, dimY - 5, startX, dimY + 5);
  line(startX + pipeL, dimY - 5, startX + pipeL, dimY + 5);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(20);
  textFont('serif');
  text("L", startX + pipeL/2, dimY + 25);
  
  // 管の描画
  stroke(0); strokeWeight(5);
  line(startX, pipeY - pipeH/2, startX + pipeL, pipeY - pipeH/2);
  line(startX, pipeY + pipeH/2, startX + pipeL, pipeY + pipeH/2);
  if (type === 'closed') {
    line(startX + pipeL +5/2, pipeY - pipeH/2, startX + pipeL +5/2, pipeY + pipeH/2);
    drawLabels("腹", "節", startX, pipeL, pipeY);
  } else {
    drawLabels("腹", "腹", startX, pipeL, pipeY);
  }
  stroke(203,201,203); strokeWeight(3);
  line(startX, pipeY - pipeH/2, startX + pipeL, pipeY - pipeH/2);
  line(startX, pipeY + pipeH/2, startX + pipeL, pipeY + pipeH/2);
  if (type === 'closed') {
    line(startX + pipeL +5/2, pipeY - pipeH/2, startX + pipeL +5/2, pipeY + pipeH/2);
    drawLabels("腹", "節", startX, pipeL, pipeY);
  } else {
    drawLabels("腹", "腹", startX, pipeL, pipeY);
  }
}

function drawLabels(left, right, x, l, y) {
  fill(0); noStroke(); textSize(16); textAlign(CENTER);
  text(left, x, y + 70);
  text(right, x + l, y + 70);
}

function drawFormula(type, num) {
  const startY = 400;
  const startX = 100;
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(22);
  textFont('serif');
  
  if (type === 'closed') {
    text(`波長: λ(m) = 4L / ${num}`, startX, startY);
    text(`固有振動数: f(m) = (V / 4L) × ${num}`, startX, startY + 45);
    
    textSize(14);
    textFont('sans-serif');
    fill(100);
    text("(m = 1, 3, 5, ...)", startX + 250, startY);
  } else {
    text(`波長: λ(n) = 2L / ${num}`, startX, startY);
    text(`固有振動数: f(n) = (V / 2L) × ${num}`, startX, startY + 45);
    
    textSize(14);
    textFont('sans-serif');
    fill(100);
    text("(n = 1, 2, 3, ...)", startX + 250, startY);
  }
}