let pistonX, pistonX_target;
let gasWidth;

let molecules = [];
let N = 40;

// base temperature
let T0 = 1.5;
let T = T0;

// radio button
let Qradio;

//画像
let img_flame;

// constants (conceptual units)
const dT_unit = 0.3; // ΔT per step
const dV_unit = 30; // ΔV per step (constant spacing)
const P_const = 1.0; // constant pressure (conceptual)

// derived quantities
let step = 0;
let Q = 0,
  W = 0,
  dU = 0;

function preload() {
  img_flame = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/flame.png?alt=media&token=1e8a3133-f779-47fd-9236-489515c0cbb6"
  );
}

function setup() {
  createCanvas(820, 460);

  pistonX = 420;
  pistonX_target = pistonX;
  gasWidth = pistonX - 150;

  // -------------------------
  // Radio Buttons (Q input)
  // -------------------------
  Qradio = createRadio();
  Qradio.option(0, "0[J]");
  Qradio.option(1, "Q[J]");
  Qradio.option(2, "2Q[J]");
  Qradio.option(3, "3Q[J]");
  Qradio.option(4, "4Q[J]");
  Qradio.option(5, "5Q[J]");
  Qradio.selected(0, "0[J]");
  Qradio.position(50, (height * 3.6) / 4);
  // ラジオボタン全体を拡大
  Qradio.style("transform", "scale(1.3)");
  Qradio.style("transform-origin", "left top");
  Qradio.changed(updateState);

  // molecules
  for (let i = 0; i < N; i++) {
    molecules.push(
      new Molecule(
        random(170, pistonX - 30),
        random(120, 280),
        random(-1, 1),
        random(-1, 1)
      )
    );
  }
}

function updateState() {
  step = int(Qradio.value());

  // thermodynamics (isobaric)
  Q = step; // ∝ Q
  W = step; // ∝ W = PΔV
  dU = step; // ∝ ΔT

  // temperature update
  T = T0 + step * dT_unit;

  // piston target (constant spacing)
  pistonX_target = 420 + step * dV_unit;
}

function draw() {
  background(255);

  // smooth piston motion
  pistonX = lerp(pistonX, pistonX_target, 0.05);
  gasWidth = pistonX - 150;

  //UI強調
  fill(100, 200, 255, 100);
  rect(0, (height * 3) / 4, width, height / 4);
  drawUI();
  drawCylinder3D();
  drawGas3D();
  drawPiston3D();

  updateMolecules();
  drawMolecules();

  drawArrows();
  drawFormula();
  drawframe();
}

// ------------------------------------------------------
// UI
// ------------------------------------------------------
function drawUI() {
  fill(255, 0, 0);
  textSize(26);
  text("加えた熱量 Q", 180, (height * 3.5) / 4);

  fill(0);
  textSize(24);
  text("<結果>", 555, 415);
  text(`Q = ${Q}Q`, 660, 385);
  text(`Win = -${W}Wout`, 660, 415);
  text(`ΔU = ${dU}ΔT`, 660, 445);
}

// ------------------------------------------------------
// Cylinder
// ------------------------------------------------------
function drawCylinder3D() {
  let d = 40;
  noStroke();
  fill(230);
  rect(150, 110, 520, 180);
  ellipse(150, 200, d, 180);
  ellipse(670, 200, d, 180);

  stroke(0);
  noFill();
  rect(150, 110, 520, 180);
  ellipse(150, 200, d, 180);
  ellipse(670, 200, d, 180);
}

// ------------------------------------------------------
// Gas
// ------------------------------------------------------
function drawGas3D() {
  let d = 40;
  noStroke();

  let col = map(T, T0, T0 + 5 * dT_unit, 180, 255);
  fill(col, 160, 120, 180);

  rect(150, 110, gasWidth, 180);
  ellipse(150, 200, d, 180);
  ellipse(150 + gasWidth, 200, d, 180);
}

// ------------------------------------------------------
// Piston
// ------------------------------------------------------
function drawPiston3D() {
  let d = 40;
  fill(180);
  stroke(0);
  ellipse(pistonX, 200, d, 180);
  strokeWeight(6);
  //line(pistonX + d / 2, 200, pistonX + 80, 200);
  //移動量可視化
  push();
  noFill();
  strokeWeight(2);
  stroke(0, 100);
  ellipse(420, 200, d, 180);
  pop();
}

// ------------------------------------------------------
// Arrows
// ------------------------------------------------------
function drawArrows() {
  strokeWeight(3);

  // Work arrow
  if (step > 0) {
    stroke(0);
    line(pistonX + 30, 200, pistonX + 90, 200);
    triangle(pistonX + 90, 200, pistonX + 75, 190, pistonX + 75, 210);
    noStroke();
    fill(0);
    text(`${W}Wout`, pistonX + 35, 180);
  }

  if (Qradio.value() != 0) {
    // ΔU arrow
    stroke(150, 80, 0);
    line(260, 240, 260, 160);
    triangle(260, 150, 250, 170, 270, 170);
    noStroke();
    fill(120, 80, 0);
    text("ΔU", 275, 200);
  }
}

// ------------------------------------------------------
// Molecules
// ------------------------------------------------------
class Molecule {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.z = random();
    this.vx = vx;
    this.vy = vy;
  }

  move() {
    let speed = sqrt(T * T * T) * (0.6 + this.z);
    this.x += this.vx * speed;
    this.y += this.vy * speed;

    if (this.x < 165) {
      this.x = 165;
      this.vx *= -1;
    }
    if (this.x > pistonX - 22) {
      this.x = pistonX - 22;
      this.vx *= -1;
    }
    if (this.y < 120 || this.y > 280) this.vy *= -1;
  }

  draw() {
    let size = lerp(6, 11, this.z);
    let c = map(T, T0, T0 + 5 * dT_unit, 120, 255);
    fill(c, 100, 255 - c);
    noStroke();
    ellipse(this.x, this.y, size);
  }
}

function updateMolecules() {
  molecules.forEach((m) => m.move());
}

function drawMolecules() {
  molecules.forEach((m) => m.draw());
}

// ------------------------------------------------------
// Formula
// ------------------------------------------------------
function drawFormula() {
  fill(100, 200, 255, 100);
  rect(0, 24, width, 40);
  fill(0);
  textSize(32);
  text("ΔU = Q + Win  （定圧膨張）", 250, 55);
}

function drawframe() {
  if (Qradio.value() != 0) {
    image(img_flame, 170, 270);
  }
}
