const NAV_H = 60;

let stage = 0;       // 0~3の4過程
let weightOn = true;
let t = 0;
let pistonY;

// 画像
let img_flame;
let img_weight;
let img_ice;

function preload(){
  img_flame  = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6");
  img_weight = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/weight.png?alt=media&token=89d6b90d-9d1e-4bf1-ae06-cb7a7b1d9b49"); 
  img_ice    = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/ice.png?alt=media&token=df309c39-ef41-4c38-8dd4-c1fa27e0541d"); 
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - NAV_H);
  cnv.parent('p5Canvas');
  pistonY = 160;
  textFont('sans-serif');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - NAV_H);
}

function draw() {
  background(250);
  drawChamber();
  animateCycle();
}

function drawChamber() {

  // ===============================
  // チャンバー寸法（固定）
  // ===============================
  let gw = 250;
  let gh = 400;

  // 中央配置
  let gx = width / 2 - gw / 2;
  let gy = height / 2 - gh / 2 + 60;

  // --- Heat / Cooling visuals ---
  if (stage === 0 || stage === 1) {
    image(img_flame, width / 2 - 80, gy + gh + 20);
  } else {
    image(img_ice, width / 2 - 80, gy + gh + 20);
  }

  // --- ピストン（エ形） ---
  stroke(0);
  fill(190);

  let pw = gw;
  let ph = 30;
  let gapH = 150;
  let cx = gx + pw * 0.45;
  let cw = pw * 0.10;

  beginShape();
  vertex(gx, pistonY-24);
  vertex(gx + pw, pistonY-24);
  vertex(gx + pw, pistonY-24 + ph);
  vertex(cx + cw, pistonY-24 + ph);
  vertex(cx + cw, pistonY-38 + gapH);
  vertex(gx + pw, pistonY-38 + gapH);
  vertex(gx + pw, pistonY-38 + gapH + ph);
  vertex(gx, pistonY-38 + gapH + ph);
  vertex(gx, pistonY-38 + gapH);
  vertex(cx, pistonY-38 + gapH);
  vertex(cx, pistonY-24 + ph);
  vertex(gx, pistonY-24 + ph);
  endShape(CLOSE);

  // ===============================
  // U字ガイド
  // ===============================
  stroke(190);
  strokeWeight(30);
  noFill();

  beginShape();
  vertex(gx + gw * 0.3, gy);
  vertex(gx, gy);
  vertex(gx, gy + gh);
  vertex(gx + gw, gy + gh);
  vertex(gx + gw, gy);
  vertex(gx + gw - gw * 0.3, gy);
  endShape();

  // 枠線
  stroke(60);
  strokeWeight(3);

  beginShape();
  vertex(gx + gw * 0.3, gy-14);
  vertex(gx-13, gy-14);
  vertex(gx-13, gy + gh+14);
  vertex(gx+13 + gw, gy + gh+14);
  vertex(gx+13 + gw, gy-14);
  vertex(gx + gw - gw * 0.3, gy-14);
  endShape();

  beginShape();
  vertex(gx + gw * 0.3, gy+14);
  vertex(gx+14, gy+14);
  vertex(gx+14, gy + gh-14);
  vertex(gx + gw-14, gy + gh-14);
  vertex(gx + gw-14, gy+14);
  vertex(gx + gw - gw * 0.3, gy+14);
  endShape();

  // おもり
  if (weightOn) {
    image(img_weight, gx + pw * 0.37, pistonY - 97);
  }

  // ガス
  let gasTop = pistonY + ph*4.8;
  let gasBottom = gy + gh*0.96;
  noStroke();
  if (stage === 1) fill(255,200,180,220);
  else if (stage === 3) fill(200,230,255,220);
  else fill(235,235,235,200);
  rect(gx+15, gasTop, gw-30, gasBottom-gasTop, 4);

  // 説明テキスト
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  if (stage === 0) text("① 加熱しておもりを持ち上げる仕事をする", 20, 20);
  if (stage === 1) text("② おもりを取り除く", 20, 20);
  if (stage === 2) text("③ 残った熱を放出させて元の状態に戻す", 20, 20);
  if (stage === 3) text("④ ①に戻る（繰り返し）", 20, 20);
}

function animateCycle() {
  t++;
  const D = 80;

  if (stage === 0 && t <= D) pistonY = lerp(160,130,t/D);
  else if (stage === 1 && t <= D) pistonY = lerp(130,80,t/D);
  else if (stage === 2 && t <= D) pistonY = lerp(80,130,t/D);
  else if (stage === 3 && t <= D) pistonY = lerp(130,160,t/D);
  else {
    if (stage === 1) weightOn = false;
    if (stage === 3) weightOn = true;
    stage = (stage + 1) % 4;
    t = 0;
  }

  pistonY = constrain(pistonY, 60, height - 300);
}
