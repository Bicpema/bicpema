import { calcEquilibriumTemp, calcTempAtTime, heatCapacity } from './logic.js';
let bitx = 100;
let bity = 60;

let radioA;
let radioMassA;
let boxImg;

// ===== 初期温度 [K] =====
let Thot0 = 273 + 95; //鉄球
let Tcold0 = 273 + 15; //水

// ===== 熱容量 =====
let C_hot;
let C_cold;

// ===== 比熱 =====
let c_Al = 0.901;
let c_Fe = 0.448;
let c_Cu = 0.386;
let c_Ag = 0.236;
let c_w = 4.2;
let c_now;

// ===== 質量(g)  =====
let m_Light = 50;
let m_Heavy = 100;
let m_Water = 150;
let m_now;

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
let Tmin = 250;
let Tmax = 400;

window.preload = function() {
  boxImg = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/stirringVessel.png?alt=media&token=665a56ef-4ff2-487c-bc9d-3089b1609699"
  );
}

window.setup = function() {
  createCanvas(1600, 800);

  afterRadio = createRadio();
  afterRadio.option(0, "接触させる(※ただし鉄球の比熱が未知)");
  afterRadio.option(1, "接触前に戻す");
  afterRadio.selected("1");
  afterRadio.style("transform", "scale(2)");
  afterRadio.position((1200 / 2) * 1.6, height / 13);

  //物質選択等のラジオボタンの生成
  createradio();

  resetState();
}

function resetState() {
  t = 0;
  Thot = Thot0;
  Tcold = Tcold0;
}

window.draw = function() {
  frameRate(20);
  background(255);

  //容器の描画
  Draw();
  updateTemperature();
  leftArea();
  rightArea();
  drawGraph();
  button();
  //物質(初期条件等)
  showPara();
}

function showPara() {
  push();
  textSize(32);
  stroke(0);
  text(
    "◎金属球の比熱は？ 熱量の保存の関係から測定しよう",
    width / 50,
    height / 15
  );
  pop();
  if (afterRadio.value() == "1") {
    //鉄球
    push();
    stroke(0);
    textSize(32);
    text("物質A(95℃)", width / 16, (height / 2) * 1.1);
    stroke(255, 0, 0);
    text("比熱 ?(J/(g・K))", width / 16, (height / 2) * 1.2);

    //水
    stroke(0);
    textSize(32);
    text("水(15℃), 150 g", (width / 3) * 0.9, (height / 3.2) * 0.85);
    stroke(0, 0, 255);
    text("比熱 4.2(J/(g・K))", (width / 3) * 0.9, height / 3.2);
    pop();
  }
}

//物質を選択するボタンの作成
function button() {
  //button 背景
  push();
  noStroke();
  fill(185, 220, 255);
  let side = width / 15;
  let inSide = width / 10;
  stroke(0);
  rect(side, ((height * 3.05) / 4) * 1.1, width / 1.5, height / 5 / 2);
  stroke(0);
  line(
    side + inSide,
    ((height * 3.05) / 4) * 1.1,
    side + inSide,
    ((height * 3.05) / 4) * 1.1 + height / 5 / 2
  );
  line(
    side + inSide * 3.9,
    ((height * 3.05) / 4) * 1.1,
    side + inSide * 3.9,
    ((height * 3.05) / 4) * 1.1 + height / 5 / 2
  );
  //軸ラベル
  fill(255);
  textSize(32);
  text("物質A", side * 1.35, ((height * 8.25) / 10) * 1.1);
  pop();
}

function Draw() {
  push();
  scale(1.7);
  if (afterRadio.value() == "1") {
    //熱浴の描画
    image(boxImg, width / 4.1, height / 15);
    ballDraw();
    //ボールの描画
  } else {
    image(boxImg, width / 4.3 / 2, height / 15);
    ballDraw();
  }
  pop();
}

/* ======================
   温度更新
====================== */
function updateTemperature() {
  let state = int(afterRadio.value());

  if (state === 0) {
    //質量が大きいか, 小さいか
    if (radioMassA.value() == "1") {
      m_now = m_Light;
    } else {
      m_now = m_Heavy;
    }
    //どの金属(比熱)であるか
    if (radioA.value() == "0") {
      c_now = c_Al;
    }
    if (radioA.value() == "1") {
      c_now = c_Fe;
    }
    if (radioA.value() == "2") {
      c_now = c_Cu;
    }
    if (radioA.value() == "3") {
      c_now = c_Ag;
    }

    C_hot = c_now * m_now;
    C_cold = c_w * m_Water;
    t++;
    Teq = (C_hot * Thot0 + C_cold * Tcold0) / (C_hot + C_cold);
    let G = 1.8; // 接触条件（共通）
    let k_eff = G / C_hot;
    Thot = Teq + (Thot0 - Teq) * exp(-k_eff * t);
    Tcold = Teq + (Tcold0 - Teq) * exp(-k_eff * t);
  } else {
    resetState();
  }
}

/* ======================
   左：接触前
====================== */
function leftArea() {}

/* ======================
   右：接触後
====================== */
function rightArea() {}

function createradio() {
  let side = width / 15;
  //A
  radioA = createRadio();
  radioA.option(0, "アルミニウム");
  radioA.option(1, "鉄");
  radioA.option(2, "銅");
  radioA.option(3, "銀");
  radioA.selected("0");
  radioA.position(side * 2.5, ((height * 7.78) / 10) * 1.1);
  radioA.style("transform", "scale(2)");
  radioA.style("transform-origin", "left top");
  //MassA
  radioMassA = createRadio();
  radioMassA.option(0, "質量(100 g)");
  radioMassA.option(1, "質量(50 g)");
  radioMassA.selected("1");
  radioMassA.position(side * 6.9, ((height * 7.78) / 10) * 1.1);
  radioMassA.style("transform", "scale(2)");
  radioMassA.style("transform-origin", "left top");
}

function ballDraw() {
  //ひっかけ棒
  if (afterRadio.value() == "1") {
    strokeWeight(1);
    fill(181, 166, 66);

    rect(50, 70, 165, 20);
    line(215, 70, 215, (height / 3.15) * 1.2 - 30);
    pop();

    /* ===== 物質A ===== */
    checkcolorA = int(radioA.value());
    checkMassA = int(radioMassA.value());

    let rA = checkMassA == 0 ? 50 : 30;
    let yA = checkMassA == 0 ? (height / 3.4) * 1.8 : (height / 3.15) * 1.8;

    let gradA = getMaterialGradient((width / 5) * 1.14, yA, rA, checkcolorA);

    push();
    noStroke();
    drawingContext.fillStyle = gradA;
    ellipse((width / 5) * 1.14, yA, rA * 2, rA * 2);
    pop();
  } else {
    strokeWeight(1);
    fill(181, 166, 66);

    rect(50 + 50, 70, 165, 20);
    line(215 + 50, 70, 215 + 50, (height / 3.15) * 1.2 - 30);
    pop();

    /* ===== 物質A ===== */
    checkcolorA = int(radioA.value());
    checkMassA = int(radioMassA.value());

    let rA = checkMassA == 0 ? 50 : 30;
    let yA = checkMassA == 0 ? (height / 3.4) * 1.8 : (height / 3.15) * 1.8;

    let gradA = getMaterialGradient((width / 5) * 1.4, yA, rA, checkcolorA);

    push();
    noStroke();
    drawingContext.fillStyle = gradA;
    ellipse((width / 5) * 1.4, yA, rA * 2, rA * 2);
    pop();
  }
}

/* ===== グラデーション生成関数 ===== */
function getMaterialGradient(x, y, r, type) {
  let ctx = drawingContext;
  let g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);

  if (type == 0) {
    // アルミ
    g.addColorStop(0, "rgb(245,245,245)");
    g.addColorStop(1, "rgb(180,180,180)");
  } else if (type == 1) {
    // 鉄
    g.addColorStop(0, "rgb(200,200,200)");
    g.addColorStop(1, "rgb(80,80,80)");
  } else if (type == 2) {
    // 銅
    g.addColorStop(0, "rgb(255,180,120)");
    g.addColorStop(1, "rgb(140,70,30)");
  } else if (type == 3) {
    // 銀
    g.addColorStop(0, "rgb(255,255,255)");
    g.addColorStop(1, "rgb(160,160,160)");
  } else {
    // 水銀
    g.addColorStop(0, "rgb(230,230,240)");
    g.addColorStop(1, "rgb(120,120,150)");
  }
  return g;
}

/* ======================
   グラフ描画
====================== */
function drawGraph() {
  push();
  scale(0.65);
  translate(900, 200);

  // ---- グラフ領域 ----
  gx = (width / 2) * 1.05;
  gy = height / 9.5;
  gw = width / 2.35;
  gh = width / 2.75;

  noStroke();
  fill(185, 220, 255);
  rect((width / 2) * 0.98, height / 12, width / 2.1, width / 2.4);
  fill(255);
  rect(gx, gy, gw, gh);
  textSize(26);
  //---- 凡例 ----
  let ysize = width / 3;
  let xsize = width / 2.35;
  fill(0);
  stroke(255, 0, 0);
  line(
    (width / 2) * 1.7,
    height / 9.5 + (ysize * 0.5) / 7,
    (width / 2) * 1.82,
    height / 9.5 + (ysize * 0.5) / 7
  );
  textSize(30);
  text("物質(高温)", (width / 2) * 1.51, height / 9.5 + (ysize * 0.6) / 7);
  stroke(0, 0, 255);
  line(
    (width / 2) * 1.7,
    height / 9.5 + (ysize * 1.2) / 7,
    (width / 2) * 1.82,
    height / 9.5 + (ysize * 1.2) / 7
  );
  textSize(30);
  text("物質(低温)", (width / 2) * 1.51, height / 9.5 + (ysize * 1.35) / 7);

  // ---- 軸ラベル ----
  stroke(0);
  fill(0);
  textSize(30);
  text(
    "接触してからの経過時間(Q))",
    (width / 2) * 1.45,
    width / 2.55 + height / 9.5
  );
  textSize(30);
  text("温", (width / 2) * 0.99, (height / 9.5) * 1.3);
  text("度", (width / 2) * 0.99, (height / 9.5) * 1.7);
  text("(K)", (width / 2) * 0.985, (height / 9.5) * 2.1);

  // ---- 軸 ----
  stroke(0);
  strokeWeight(2);
  line(gx, gy, gx, gy + gh);
  line(gx, gy + gh, gx + gw, gy + gh);
  fill(0);
  triangle(
    (width / 2) * 1.04,
    height / 8,
    (width / 2) * 1.05,
    height / 9.5,
    (width / 2) * 1.06,
    height / 8
  );
  triangle(
    (width / 2) * 1.05 + width / 2.35,
    width / 2.75 + height / 9.5,
    ((width / 2) * 1.05 + width / 2.35) * 0.986,
    (width / 2.75 + height / 9.5) * 0.99,
    ((width / 2) * 1.05 + width / 2.35) * 0.986,
    (width / 2.75 + height / 9.5) * 1.01
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
      let G = 1.8; // 接触条件（共通）
      let k_eff = G / C_hot;
      let T = Teq + (Thot0 - Teq) * exp(-k_eff * tt);
      vertex(tx(tt), ty(T));
    }
    endShape();

    stroke(0, 0, 255);
    beginShape();
    for (let tt = 0; tt <= tMax; tt++) {
      let G = 1.8; // 接触条件（共通）
      let k_eff = G / C_hot;
      let T = Teq + (Tcold0 - Teq) * exp(-k_eff * tt);
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
