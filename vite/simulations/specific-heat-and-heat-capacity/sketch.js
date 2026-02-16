let burnerImg;
let radioA, radioB;
let radioMassA, radioMassB;
let checkcolorA, checkcolorB;
let checkMassA, checkMassB;
let massA, massB;

// 比熱 [J/(kg·K)]
const specificHeat = [
  901, // アルミ
  448, // 鉄
  386, // 銅
  236, // 銀
  140, // 水銀
];

const T0 = 300; // 初期温度[K]
const Qmax = 1000; // グラフ右端のQ

function preload() {
  burnerImg = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/gasBurner.png?alt=media&token=20f7ca3b-dc1d-4459-8bd9-01bd6b5d3b94"
  );
}

function setup() {
  createCanvas(1200, 800);
  //ラジオボタンの生成
  createradio();
}

function draw() {
  background(255);

  // バーナーの描画(2つ)
  burnerDraw();
  //グラフの背景
  drawGraph();
  //入力buttonの描画
  button();
  //加熱する物体の描画
  ballDraw();
  //グラフの直線の描画
  lineDraw();
  //比熱表示
  cDraw();
}

function burnerDraw() {
  image(burnerImg, width / 8, height / 3);
  image(burnerImg, width / 4.13, height / 3);
}

function drawGraph() {
  //背景
  push();
  noStroke();
  fill(185, 220, 255);
  rect((width / 2) * 0.98, height / 12, width / 2.1, width / 2.4);
  fill(255, 255, 255);
  rect((width / 2) * 1.05, height / 9.5, width / 2.35, width / 2.75);
  textSize(26);
  fill(0);
  text("物質A", (width / 2) * 0.2, width / 10);
  text("物質B", (width / 2) * 0.63, width / 10);
  pop();
  //軸
  push();
  strokeWeight(2);
  line(
    (width / 2) * 1.05,
    height / 9.5,
    (width / 2) * 1.05,
    width / 2.75 + height / 9.5
  );
  fill(0);
  triangle(
    (width / 2) * 1.04,
    height / 8,
    (width / 2) * 1.05,
    height / 9.5,
    (width / 2) * 1.06,
    height / 8
  );
  line(
    (width / 2) * 1.05 + width / 2.35,
    width / 2.75 + height / 9.5,
    (width / 2) * 1.05,
    width / 2.75 + height / 9.5
  );
  triangle(
    (width / 2) * 1.05 + width / 2.35,
    width / 2.75 + height / 9.5,
    ((width / 2) * 1.05 + width / 2.35) * 0.986,
    (width / 2.75 + height / 9.5) * 0.99,
    ((width / 2) * 1.05 + width / 2.35) * 0.986,
    (width / 2.75 + height / 9.5) * 1.01
  );
  //軸ラベル
  textSize(26);
  text(
    "加熱時間(加えた熱量(Q))",
    (width / 2) * 1.42,
    width / 2.55 + height / 9.5
  );
  textSize(26);
  text("温", (width / 2) * 0.99, (height / 9.5) * 1.3);
  text("度", (width / 2) * 0.99, (height / 9.5) * 1.6);
  text("(K)", (width / 2) * 0.985, (height / 9.5) * 1.91);
}

function button() {
  //button 背景
  push();
  noStroke();
  fill(185, 220, 255);
  let side = width / 15;
  let inSide = width / 10;
  rect(side, (height * 3.05) / 4, width - 2 * side, height / 5);
  stroke(0);
  line(
    side + inSide,
    (height * 3.05) / 4,
    side + inSide,
    (height * 3.05) / 4 + height / 5
  );
  line(
    side,
    (height * 3.05) / 4 + height / 5 / 2,
    width - side,
    (height * 3.05) / 4 + height / 5 / 2
  );
  line(
    side + inSide * 5.9,
    (height * 3.05) / 4,
    side + inSide * 5.9,
    (height * 3.05) / 4 + height / 5
  );
  //軸ラベル
  fill(255);
  textSize(32);
  text("物質A", side * 1.2, (height * 8.25) / 10);
  text("物質B", side * 1.2, (height * 9.3) / 10);
  pop();
  //物質(比熱選択)
}

function createradio() {
  let side = width / 15;
  //A
  radioA = createRadio();
  radioA.option(0, "アルミニウム");
  radioA.option(1, "鉄");
  radioA.option(2, "銅");
  radioA.option(3, "銀");
  radioA.option(4, "水銀");
  radioA.selected("0");
  radioA.position(side * 2.5, (height * 7.78) / 10);
  radioA.style("transform", "scale(2)");
  radioA.style("transform-origin", "left top");
  //MassA
  radioMassA = createRadio();
  radioMassA.option(0, "質量(大)");
  radioMassA.option(1, "質量(小)");
  radioMassA.selected("1");
  radioMassA.position(side * 9.9, (height * 7.78) / 10);
  radioMassA.style("transform", "scale(2)");
  radioMassA.style("transform-origin", "left top");

  //B
  radioB = createRadio();
  radioB.option(0, "アルミニウム");
  radioB.option(1, "鉄");
  radioB.option(2, "銅");
  radioB.option(3, "銀");
  radioB.option(4, "水銀");
  radioB.selected("0");
  radioB.position(side * 2.5, (height * 8.85) / 10);
  radioB.style("transform", "scale(2)");
  radioB.style("transform-origin", "left top");
  //MassB
  radioMassB = createRadio();
  radioMassB.option(0, "質量(大)");
  radioMassB.option(1, "質量(小)");
  radioMassB.selected("0");
  radioMassB.position(side * 9.9, (height * 8.85) / 10);
  radioMassB.style("transform", "scale(2)");
  radioMassB.style("transform-origin", "left top");
}

function ballDraw() {
  //ひっかけ棒
  strokeWeight(1);
  fill(181, 166, 66);

  rect(50, 70, 165, 20);
  rect(354, 70, 165, 20);
  line(215, 70, 215, height / 3.15 - 30);
  line(354, 70, 354, height / 3.15 - 30);
  pop();

  /* ===== 物質A ===== */
  checkcolorA = int(radioA.value());
  checkMassA = int(radioMassA.value());

  let rA = checkMassA == 0 ? 50 : 30;
  let yA = checkMassA == 0 ? height / 3.4 : height / 3.15;

  let gradA = getMaterialGradient(215, yA, rA, checkcolorA);

  push();
  noStroke();
  drawingContext.fillStyle = gradA;
  ellipse(215, yA, rA * 2, rA * 2);
  pop();

  /* ===== 物質B ===== */
  checkcolorB = int(radioB.value());
  checkMassB = int(radioMassB.value());

  let rB = checkMassB == 0 ? 50 : 30;
  let yB = checkMassB == 0 ? height / 3.4 : height / 3.15;

  let gradB = getMaterialGradient(354, yB, rB, checkcolorB);

  push();
  noStroke();
  drawingContext.fillStyle = gradB;
  ellipse(354, yB, rB * 2, rB * 2);
  pop();
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

function lineDraw() {
  /* ===== 物質A ===== */
  checkcolorA = int(radioA.value());
  checkMassA = int(radioMassA.value());
  //物質Aの質量
  if (checkMassA == 0) {
    massA = 0.3; //[kg]
  } else {
    massA = 0.1; //{kg]
  }
  //物質Aのグラフ表示
  let ysize = width / 2.75;
  let xsize = width / 2.35;
  push();
  stroke(255, 0, 0);
  strokeWeight(1);
  if (checkcolorA == 0) {
    let c = 901;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massA * c)
    );
  } else if (checkcolorA == 1) {
    let c = 448;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massA * c)
    );
  } else if (checkcolorA == 2) {
    let c = 386;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massA * c)
    );
  } else if (checkcolorA == 3) {
    let c = 236;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massA * c)
    );
  } else {
    let c = 140;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massA * c)
    );
  }
  //凡例
  line(
    (width / 2) * 1.1,
    height / 9.5 + (ysize * 0.5) / 7,
    (width / 2) * 1.2,
    height / 9.5 + (ysize * 0.5) / 7
  );
  textSize(26);
  text("物質A", (width / 2) * 1.21, height / 9.5 + (ysize * 0.6) / 7);
  pop();

  /* ===== 物質B ===== */
  checkcolorB = int(radioB.value());
  checkMassB = int(radioMassB.value());
  //物質Bの質量
  if (checkMassB == 0) {
    massB = 0.3; //[kg]
  } else {
    massB = 0.1; //{kg]
  }

  push();
  stroke(0, 0, 255, 150);
  if (checkcolorB == 0) {
    let c = 901;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massB * c)
    );
  } else if (checkcolorB == 1) {
    let c = 448;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massB * c)
    );
  } else if (checkcolorB == 2) {
    let c = 386;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massB * c)
    );
  } else if (checkcolorB == 3) {
    let c = 236;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massB * c)
    );
  } else {
    let c = 140;
    line(
      (width / 2) * 1.05,
      height / 9.5 + (ysize * 6) / 7,
      (width / 2) * 1.05 + xsize,
      height / 9.5 + (ysize * 6) / 7 - 5000 / (massB * c)
    );
  }
  //凡例
  line(
    (width / 2) * 1.1,
    height / 9.5 + (ysize * 1.2) / 7,
    (width / 2) * 1.2,
    height / 9.5 + (ysize * 1.2) / 7
  );
  textSize(26);
  text("物質B", (width / 2) * 1.21, height / 9.5 + (ysize * 1.35) / 7);
  pop();
}

function cDraw() {
  //物質Aの比熱表示
  checkcolorA = int(radioA.value());
  if (checkcolorA == 0) {
    textSize(26);
    text("0.901(J/(ｇ・K))", width / 100, height / 4.5);
  } else if (checkcolorA == 1) {
    textSize(26);
    text("0.448(J/(ｇ・K))", width / 100, height / 4.5);
  } else if (checkcolorA == 2) {
    textSize(26);
    text("0.386(J/(ｇ・K))", width / 100, height / 4.5);
  } else if (checkcolorA == 3) {
    textSize(26);
    text("0.236(J/(ｇ・K))", width / 100, height / 4.5);
  } else {
    textSize(26);
    text("0.140(J/(ｇ・K))", width / 100, height / 4.5);
  }
  //物質Bの比熱表示
  checkcolorB = int(radioB.value());
  if (checkcolorB == 0) {
    textSize(26);
    text("0.901(J/(ｇ・K))", width / 3.3, height / 4.5);
  } else if (checkcolorB == 1) {
    textSize(26);
    text("0.448(J/(ｇ・K))", width / 3.3, height / 4.5);
  } else if (checkcolorB == 2) {
    textSize(26);
    text("0.386(J/(ｇ・K))", width / 3.3, height / 4.5);
  } else if (checkcolorB == 3) {
    textSize(26);
    text("0.236(J/(ｇ・K))", width / 3.3, height / 4.5);
  } else {
    textSize(26);
    text("0.140(J/(ｇ・K))", width / 3.3, height / 4.5);
  }
}
