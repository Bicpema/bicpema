const NAV_H = 60;
const BASE_W = 1600;
const BASE_H = 800;

let sf = 1;
let tx_off = 0, ty_off = 0;

let bitx = 100;
let bity = 60;

// ===== 初期温度 [K] =====
let Thot0 = 373;
let Tcold0 = 50;

// ===== 熱容量 =====
let C_hot = 2.0;
let C_cold = 2.0;

// ===== 冷却定数 =====
let k = 0.02;

// ===== 描画用 =====
let cols = 7;
let rows = 6;
let ballR = 8;

let afterRadio;
let t = 0;

// ===== 現在温度 =====
let Thot, Tcold;
let Teq;

// ===== グラフ用 =====
let gx, gy, gw, gh;
let tMax = 300;
let Tmin = 0;
let Tmax = 400;

function computeScale() {
  sf = min(width / BASE_W, height / BASE_H);
  tx_off = (width - BASE_W * sf) / 2;
  ty_off = (height - BASE_H * sf) / 2;
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - NAV_H);
  cnv.parent('p5Canvas');
  computeScale();

  afterRadio = createRadio();
  afterRadio.parent('p5Container');
  afterRadio.option(0, "接触させる(※ただし同質量, 同物質)");
  afterRadio.option(1, "接触前に戻す");
  afterRadio.selected("1");
  afterRadio.style("transform", "scale(2)");
  afterRadio.style('color', 'white');
  positionElements();

  resetState();
}

function positionElements() {
  // afterRadio positioned at x=(1200/2)*1.4 which corresponds to the original layout reference
  const LAYOUT_REF_W = 1200;
  afterRadio.position(LAYOUT_REF_W / 2 * 1.4 * sf + tx_off, BASE_H / 20 * sf + ty_off);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - NAV_H);
  computeScale();
  positionElements();
}

function resetState() {
  t = 0;
  Thot = Thot0;
  Tcold = Tcold0;
  Teq = (C_hot * Thot0 + C_cold * Tcold0) / (C_hot + C_cold);
}

function draw() {
  frameRate(20);
  background(255);

  push();
  translate(tx_off, ty_off);
  scale(sf);

  updateTemperature();
  leftArea();
  rightArea();
  middleArrow();
  drawGraph();

  pop();
}

/* ======================
   温度更新
====================== */
function updateTemperature() {
  let state = int(afterRadio.value());

  if (state === 0) {
    t++;
    Thot = Teq + (Thot0 - Teq) * exp(-k * t);
    Tcold = Teq + (Tcold0 - Teq) * exp(-k * t);
  } else {
    resetState();
  }
}

/* ======================
   左：接触前
====================== */
function leftArea() {
  drawBlock(bitx, bity, 1200 / 2 - 2 * bitx, 800 / 2 - 2 * bity, Thot0);

  drawBlock(
    bitx,
    800 / 2 + bity,
    1200 / 2 - 2 * bitx,
    800 / 2 - 2 * bity,
    Tcold0
  );
}

/* ======================
   右：接触後
====================== */
function rightArea() {
  drawBlock(
    1100 / 2 + bitx,
    2 * bity,
    1200 / 2 - 2 * bitx,
    800 / 2 - 2 * bity,
    Thot
  );

  drawBlock(
    1100 / 2 + bitx,
    800 / 2,
    1200 / 2 - 2 * bitx,
    800 / 2 - 2 * bity,
    Tcold
  );
}

/* ======================
   ブロック描画
====================== */
function drawBlock(x, y, w, h, T) {
  let coldCol = color(0, 120, 255, 120);
  let hotCol = color(255, 80, 0, 120);

  let tcol = constrain((T - Tmin) / (Tmax - Tmin), 0, 1);
  fill(lerpColor(coldCol, hotCol, tcol));
  stroke(0);
  rect(x, y, w, h);

  drawMolecules(x, y, w, h, T);

  fill(0);
  noStroke();
  textSize(16);
  text(`${T.toFixed(1)} K`, x + 10, y + 22);
}

/* ======================
   分子振動（√T 依存）
====================== */
function drawMolecules(x, y, w, h, T) {
  let dx = w / cols;
  let dy = h / rows;

  let amp = 0.4 * sqrt(max(T, 0));
  amp = constrain(amp, 0, 15);

  fill(255);
  stroke(0);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cx = x + (i + 0.5) * dx;
      let cy = y + (j + 0.5) * dy;

      ellipse(cx + random(-amp, amp), cy + random(-amp, amp), ballR * 2);
    }
  }
}

/* ======================
   熱移動矢印
====================== */
function middleArrow() {
  fill(255, 0, 0, 120);
  noStroke();
  rect((1100 / 2) * 0.8, (800 / 2) * 0.96, 1100 / 10, 800 / 25);
  triangle(
    (1100 / 2) * 1.1,
    800 / 2,
    1100 / 2,
    (800 / 2) * 0.9,
    1100 / 2,
    (800 / 2) * 1.1
  );
}

/* ======================
   グラフ描画
====================== */
function drawGraph() {
  push();
  scale(0.65);
  translate(900, 200);

  // ---- グラフ領域 ----
  gx = (BASE_W / 2) * 1.05;
  gy = BASE_H / 9.5;
  gw = BASE_W / 2.35;
  gh = BASE_W / 2.75;

  noStroke();
  fill(185, 220, 255);
  rect((BASE_W / 2) * 0.98, BASE_H / 12, BASE_W / 2.1, BASE_W / 2.4);
  fill(255);
  rect(gx, gy, gw, gh);
  textSize(26);
  //---- 凡例 ----
  let ysize = BASE_W / 3;
  let xsize = BASE_W / 2.35;
  fill(0);
  stroke(255, 0, 0);
  line(
    (BASE_W / 2) * 1.7,
    BASE_H / 9.5 + (ysize * 0.5) / 7,
    (BASE_W / 2) * 1.82,
    BASE_H / 9.5 + (ysize * 0.5) / 7
  );
  textSize(30);
  text("物質(高温)", (BASE_W / 2) * 1.51, BASE_H / 9.5 + (ysize * 0.6) / 7);
  stroke(0, 0, 255);
  line(
    (BASE_W / 2) * 1.7,
    BASE_H / 9.5 + (ysize * 1.2) / 7,
    (BASE_W / 2) * 1.82,
    BASE_H / 9.5 + (ysize * 1.2) / 7
  );
  textSize(30);
  text("物質(低温)", (BASE_W / 2) * 1.51, BASE_H / 9.5 + (ysize * 1.35) / 7);

  // ---- 軸ラベル ----
  stroke(0);
  fill(0);
  textSize(30);
  text(
    "接触してからの経過時間(s))",
    (BASE_W / 2) * 1.45,
    BASE_W / 2.55 + BASE_H / 9.5
  );
  textSize(30);
  text("温", (BASE_W / 2) * 0.99, (BASE_H / 9.5) * 1.3);
  text("度", (BASE_W / 2) * 0.99, (BASE_H / 9.5) * 1.7);
  text("(K)", (BASE_W / 2) * 0.985, (BASE_H / 9.5) * 2.1);

  // ---- 軸 ----
  stroke(0);
  strokeWeight(2);
  line(gx, gy, gx, gy + gh);
  line(gx, gy + gh, gx + gw, gy + gh);
  fill(0);
  triangle(
    (BASE_W / 2) * 1.04,
    BASE_H / 8,
    (BASE_W / 2) * 1.05,
    BASE_H / 9.5,
    (BASE_W / 2) * 1.06,
    BASE_H / 8
  );
  triangle(
    (BASE_W / 2) * 1.05 + BASE_W / 2.35,
    BASE_W / 2.75 + BASE_H / 9.5,
    ((BASE_W / 2) * 1.05 + BASE_W / 2.35) * 0.986,
    (BASE_W / 2.75 + BASE_H / 9.5) * 0.99,
    ((BASE_W / 2) * 1.05 + BASE_W / 2.35) * 0.986,
    (BASE_W / 2.75 + BASE_H / 9.5) * 1.01
  );
  if (afterRadio.value() == "1") {
    // ---- 初期温度（切片）----
    push();
    strokeWeight(10);
    stroke(255, 0, 0, 120);
    point(tx(0), ty(Thot0));

    stroke(0, 0, 255, 120);
    point(tx(0), ty(Tcold0));
    pop();
  }
  strokeWeight(2);

  if (afterRadio.value() == "0") {
    // ---- 平衡温度 ----
    drawingContext.setLineDash([8, 6]);
    stroke(0);
    line(tx(0), ty(Teq), tx(tMax), ty(Teq));
    drawingContext.setLineDash([]);

    // ---- 温度変化曲線 ----
    noFill();
    strokeWeight(3);

    stroke(255, 0, 0);
    beginShape();
    for (let tt = 0; tt <= tMax; tt++) {
      let T = Teq + (Thot0 - Teq) * exp(-k * tt);
      vertex(tx(tt), ty(T));
    }
    endShape();

    stroke(0, 0, 255);
    beginShape();
    for (let tt = 0; tt <= tMax; tt++) {
      let T = Teq + (Tcold0 - Teq) * exp(-k * tt);
      vertex(tx(tt), ty(T));
    }
    endShape();

    // ---- 現在温度を表す移動点 ----
    let t_now = min(t, tMax);

    // 物質A（高温）
    stroke(255, 0, 0);
    strokeWeight(8);
    point(tx(t_now), ty(Thot));
    push();

    // 表示文字列
    let labelA = nf(Thot, 1, 2) + " K";
    textSize(24);

    // ラベルサイズ
    let tw = textWidth(labelA);
    let th = 28;

    // 基本位置（点の右上）
    let lx = tx(t_now) + 12;
    let ly = ty(Thot) - 12;

    // はみ出し防止
    lx = constrain(lx, gx + 6, gx + gw - tw - 6);
    ly = constrain(ly, gy + th + 6, gy + gh - 6);

    // 背景
    noStroke();
    fill(255, 220);
    rect(lx - 6, ly - th, tw + 12, th, 6);

    // 文字
    fill(180, 0, 0);
    text(labelA, lx, ly - 6);

    pop();
    // 物質B（低温）
    stroke(0, 0, 255);
    strokeWeight(8);
    point(tx(t_now), ty(Tcold));
    push();

    let labelB = nf(Tcold, 1, 2) + " K";
    textSize(24);

    let twb = textWidth(labelB);
    let thb = 28;

    let lxb = tx(t_now) + 12;
    let lyb = ty(Tcold) + 38;

    lx = constrain(lxb, gx + 6, gx + gw - twb - 6);
    ly = constrain(lyb, gy + thb + 6, gy + gh - 6);

    noStroke();
    fill(255, 220);
    rect(lx - 6, ly - thb, twb + 12, thb, 6);

    fill(0, 0, 180);
    text(labelB, lx, ly - 6);

    pop();
  }
  pop();
}

/* ======================
   座標変換
====================== */
function tx(t) {
  return map(t, 0, tMax, gx, gx + gw);
}

function ty(T) {
  return map(T, Tmin, Tmax, gy + gh, gy);
}
