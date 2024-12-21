// 青の波長 
// 緑の波長 
// 赤の波長 

let numbeams = 0;
let beams_r = [];
let beams_g = [];
let beams_b = [];
let beams_r_2 = [];
let beams_g_2 = [];
let beams_b_2 = [];
let count = 0;
let mult_r;
let mult_g;
let mult_b;
let c_earth;
//deleteのための，繰り返しのスタート地点となる変数
let numStart = 0;
//start~stopボタンのon//offの判定
let clickedCount_r;
let clickedCount_g;
let clickedCount_b;
//お昼におけるカウント数
let countNumber_r1 = 0;
let countNumber_g1 = 0;
let countNumber_b1 = 0;
// 夕暮れにおけるカウント数
let countNumber_r2 = 0;
let countNumber_g2 = 0;
let countNumber_b2 = 0;
//画像用の変数
let img;
let img_2;
// スライダーの用意(スピード)
let v_slider;

//文字
let str_x = "ビームをスローモーションで観測する"
let str_north = "北極";

//表示のon/off 判定変数 - 表示がデフォルト
let clickedDisplay;

//r,g,bの散乱度合いのスライダー
let r_re_slider;
let g_re_slider;
let b_re_slider;
//割合を算出するための,母数の変数
let r_denominator
let g_denominator
let b_denominator
let count_denominator
let count_r_display
let count_g_display
let count_b_display
let pre_count_r_display
let pre_count_g_display
let pre_count_b_display
let clicked_stop
//割合を簡素に表示するための変数
let countBeam = 0;
let slider_r_denominator;
let slider_g_denominator;
let slider_b_denominator;

//画像のダウンロード
function preload() {
  img = loadImage("/simulations/sunset/earth_north_arrow.png");
  img_2 = loadImage("/simulations/sunset/arrow_sun.png");
}


function setup() {
  createCanvas(810, 480);      //27:16の比率 
  smooth();
  //地球の中心の位置ベクトル
  c_earth = createVector(0, height / 1.25);
  frameRate(50);
  angleMode(RADIANS);
  clickedCount_r = false;
  clickedCount_g = false;
  clickedCount_b = false;
  clickedDisplay = false;
  textAlign(CENTER, CENTER);
  // スライダーの用意(もともと5,10)
  v_slider = createSlider(5, 8);
  v_slider.position(width / 1.5, height / 8 + height / 5);
  textSize(18);
  //　rgbの散乱度合いのスライダーの用意
  r_re_slider = createSlider(1, 93, 0);
  g_re_slider = createSlider(1, 93, 0);
  b_re_slider = createSlider(1, 93, 0);
  //散乱度合いのスライダーの位置
  r_re_slider.position(width / 4, height + height / 5);
  g_re_slider.position(width / 4 + 180, height + height / 5);
  b_re_slider.position(width / 4 + 360, height + height / 5);
  //分母のカウントのon/off
  count_denominator = false;
  r_denominator = 0;
  g_denominator = 0;
  b_denominator = 0;
  clicked_stop = false;
}


function draw() {
  background(0);
  count += 1;

  // テキストの用意
  push();
  textSize(20)
  stroke(255, 0, 0);
  fill(255, 255, 255, 100);
  text(str_x, width / 1.4, height / 10.3);
  stroke(255, 255, 255);
  text("太陽光", width / 1.1, height / 4);
  pop();

  // r_g_bのスライダー(散乱度合い決定)
  let r_re_slider_value = r_re_slider.value();
  let g_re_slider_value = g_re_slider.value();
  let b_re_slider_value = b_re_slider.value();

  //太陽光の描画
  //sunlight(height/1.15);
  sunlight(height / 1.75);
  sunlight(height / 3.35);

  if (count % 4 == 0) {
    //母数の計算は別に要らない..? (4フレームに1つずつ, ビームが生成されている．)
    if (count_denominator == true) {
      r_denominator += 1;
      g_denominator += 1;
      b_denominator += 1;
    }

    //画像に水平なベクトル
    let dist_r = sqrt(sq(width - 0) + 0);
    let dist_g = sqrt(sq(width - 0) + 0);
    let dist_b = sqrt(sq(width - 0) + 0);
    let cr = v_slider.value();
    let c_r = color(255, 0, 0, 200);
    let c_g = color(0, 255, 0, 200);
    let c_b = color(0, 0, 255);
    let bc_r = 0;
    let bc_g = 0;
    let bc_b = 0;

    let va_r = 0;
    let va_g = 0;
    let va_b = 0;

    //カウントが済まされたことを示す変数
    let cf_r1 = 0;
    let cf_r2 = 0;
    let cf_g1 = 0;
    let cf_g2 = 0;
    let cf_b1 = 0;
    let cf_b2 = 0;

    //ビームからはぐれたことを示す変数
    let bound_r1 = 0;
    let bound_r2 = 0;
    let bound_g1 = 0;
    let bound_g2 = 0;
    let bound_b1 = 0;
    let bound_b2 = 0;

    let e_r_1 = createVector(width, height / 1.25 - 20);
    let e_g_1 = createVector(width, height / 1.25);
    let e_b_1 = createVector(width, height / 1.25 + 20);
    let mouse_r_1 = createVector(0, height / 1.25 - 20);
    let mouse_g_1 = createVector(0, height / 1.25);
    let mouse_b_1 = createVector(0, height / 1.25 + 20);
    let sub_r_1 = p5.Vector.sub(mouse_r_1, e_r_1);
    let sub_g_1 = p5.Vector.sub(mouse_g_1, e_g_1);
    let sub_b_1 = p5.Vector.sub(mouse_b_1, e_b_1);
    let d_r_1 = p5.Vector.mult(sub_r_1, 1 / dist_r);
    let d_g_1 = p5.Vector.mult(sub_g_1, 1 / dist_g);
    let d_b_1 = p5.Vector.mult(sub_b_1, 1 / dist_b);
    let t_r_1 = p5.Vector.add(e_r_1, d_r_1);
    let t_g_1 = p5.Vector.add(e_g_1, d_g_1);
    let t_b_1 = p5.Vector.add(e_b_1, d_b_1);

    let e_r_2 = createVector(width, height / 2.5 - 20);
    let e_g_2 = createVector(width, height / 2.5);
    let e_b_2 = createVector(width, height / 2.5 + 20);
    let mouse_r_2 = createVector(0, height / 2.5 - 20);
    let mouse_g_2 = createVector(0, height / 2.5);
    let mouse_b_2 = createVector(0, height / 2.5 + 20);
    let sub_r_2 = p5.Vector.sub(mouse_r_2, e_r_2);
    let sub_g_2 = p5.Vector.sub(mouse_g_2, e_g_2);
    let sub_b_2 = p5.Vector.sub(mouse_b_2, e_b_2);
    let d_r_2 = p5.Vector.mult(sub_r_2, 1 / dist_r);
    let d_g_2 = p5.Vector.mult(sub_g_2, 1 / dist_g);
    let d_b_2 = p5.Vector.mult(sub_b_2, 1 / dist_b);
    let t_r_2 = p5.Vector.add(e_r_2, d_r_2);
    let t_g_2 = p5.Vector.add(e_g_2, d_g_2);
    let t_b_2 = p5.Vector.add(e_b_2, d_b_2);
    beams_r[numbeams] = new Beam_r(t_r_1, e_r_1, d_r_1, cr, c_r, bc_r, va_r, numbeams, cf_r1, bound_r1, r_re_slider_value, r_denominator);
    beams_g[numbeams] = new Beam_g(t_g_1, e_g_1, d_g_1, cr, c_g, bc_g, va_g, numbeams, cf_g2, bound_r2, g_re_slider_value, g_denominator),
      beams_b[numbeams] = new Beam_b(t_b_1, e_b_1, d_b_1, cr, c_b, bc_b, va_b, numbeams, cf_b1, bound_g1, b_re_slider_value, b_denominator);
    beams_r_2[numbeams] = new Beam_r(t_r_2, e_r_2, d_r_2, cr, c_r, bc_r, va_r, numbeams, cf_r2, bound_g2, r_re_slider_value, r_denominator);
    beams_g_2[numbeams] = new Beam_g(t_g_2, e_g_2, d_g_2, cr, c_g, bc_g, va_g, numbeams, cf_g2, bound_b1, g_re_slider_value, g_denominator);
    beams_b_2[numbeams] = new Beam_b(t_b_2, e_b_2, d_b_2, cr, c_b, bc_b, va_b, numbeams, cf_b1, bound_b2, b_re_slider_value, b_denominator);
    numbeams += 1;
  }


  //1個目のbeamの関数制御
  for (let i = numStart; i < (numbeams); i++) {
    beams_r[i].display();
    beams_g[i].display();
    beams_b[i].display();
    beams_r_2[i].display();
    beams_g_2[i].display();
    beams_b_2[i].display();

    beams_r[i].move();
    beams_g[i].move();
    beams_b[i].move();
    beams_r_2[i].move();
    beams_g_2[i].move();
    beams_b_2[i].move();

    beams_r[i].bound_1();
    beams_g[i].bound_1();
    beams_b[i].bound_1();
    beams_r_2[i].bound_2();
    beams_g_2[i].bound_2();
    beams_b_2[i].bound_2();

    //beamについて，boundを1回したものに対して，過剰にboundするように加工
    beams_r[i].bound2();
    beams_g[i].bound2();
    beams_b[i].bound2();
    beams_r_2[i].bound2();
    beams_g_2[i].bound2();
    beams_b_2[i].bound2();

    // 観測者に届くbeamのカウント
    beams_r[i].count_1();
    beams_g[i].count_1();
    beams_b[i].count_1();
    beams_r_2[i].count_2();
    beams_g_2[i].count_2();
    beams_b_2[i].count_2();

    //繰り返し数の定期的な削減
    if (numbeams - numStart > 200) {
      numStart += 40;
    }
  }
  //画像の貼り付け(地球)
  image(img, -height / 3.2, height / 2.35, width / 2.45, width / 2.45);
  //地球の大気圏
  fill(0, 125, 255, 60);
  ellipse(-height / 3.2 + width / 4.9, height / 2.35 + width / 4.9, height * 1.35, height * 1.35);


  //観測者①(お昼ごろ)
  fill(220, 220, 220);
  push();
  translate(height / 2.6, height / 1.25);
  push();
  rotate(0);
  triangle(20, 3, -24, -20, -23, 20);
  pop();
  pop();
  ellipse(height / 2.47, height / 1.25, 30, 30);


  //カウント選択エリア
  //スタート
  fill(200, 200, 0);
  rect(width * 2.8 / 5, height / 1.5, 100, 38);
  push();
  fill(255);
  text("START", (width * 2.8 / 5 + 10), height / 1.535 - 12, 80, 80);
  pop();
  //リセット
  fill(0, 200, 200);
  rect(width * 2.8 / 5 + 100, height / 1.5, 100, 38);
  fill(255);
  text("RESET", (width * 2.8 / 5 + 100 + 10), height / 1.535 - 12, 80, 80);
  pop();
  //ON/OFF
  fill(200, 200, 200);
  rect(width * 2.8 / 5 + 200, height / 1.5, 100, 38);
  push();
  fill(255);
  text("ON/OFF", (width * 2.8 / 5 + 200 + 10), height / 1.535 - 12, 80, 80);
  pop();

  //何故か文字の色が変化してしまう..? スライダーと北極の文字を塗るため．
  //fill(255,255,255,100);

  if (clickedDisplay == false) {
    //お昼カウント表示
    push();
    stroke(255);
    fill(255);
    textSize(25);
    text("お昼", width / 4.5, height / 1.9);
    pop();
    fill(255, 255, 255, 100);
    rect(width / 3.9, height / 2, 85, 120);
    //夕方カウント表示
    push();
    stroke(255);
    fill(255);
    textSize(25);
    text("夕方", width / 30, height / 8.5);
    pop();
    push();
    fill(255, 255, 255, 100);
    rect(width / 15, height / 10, 85, 120);
    pop();
  }

  //お昼カウント表示(数)
  push();
  fill(255);
  //rに対する表示の条件分岐(%表示or 0-定数表示)
  if (count_denominator == true) {
    count_r_display = countNumber_r1 / r_denominator * 100;
  }
  if (count_denominator == false) {
    count_r_display = 0;
  }

  //gに対する表示の条件分岐(%表示or 0-定数表示)
  if (count_denominator == true) {
    count_g_display = countNumber_g1 / g_denominator * 100;
    pre_count_g_display = count_g_display
  }
  if (count_denominator == false) {
    count_g_display = 0;
  }

  //bに対する表示の条件分岐(%表示or 0-定数表示)
  if (count_denominator == true) {
    count_b_display = countNumber_b1 / b_denominator * 100;
    pre_count_b_display = count_b_display
  }
  if (count_denominator == false) {
    count_b_display = 0;
  }

  let ratio_r1 = nf(count_r_display, 1, 0);
  let rario_r1_text = ratio_r1 + "%";
  let ratio_g1 = nf(count_g_display, 1, 0);
  let rario_g1_text = ratio_g1 + "%";
  let ratio_b1 = nf(count_b_display, 1, 0);
  let rario_b1_text = ratio_b1 + "%";

  if (clickedDisplay == false) {
    //red
    text(rario_r1_text, (width / 4 + 18), height / 1.95, 30, 30);
    //green
    text(rario_g1_text, (width / 4 + 18), height / 1.95 + 40, 30, 30);
    //blue
    text(rario_b1_text, (width / 4 + 18), height / 1.95 + 80, 30, 30);
    pop();

    // お昼カウント表示(色)
    push();
    //red
    fill(255, 0, 0);
    rect((width / 4 + 60), height / 2 + 10, 25, 25);
    pop();
    //green
    push();
    fill(0, 255, 0);
    rect((width / 4 + 60), height / 2 + 50, 25, 25);
    pop();
    //blue
    push();
    fill(0, 0, 255);
    rect((width / 4 + 60), height / 2 + 88, 25, 25);
    pop();
  }

  //rに対する表示の条件分岐(%表示or 0-定数表示)・・夕方ver
  if (count_denominator == true) {
    count_r_display = countNumber_r2 / r_denominator * 100;
  }
  if (count_denominator == false) {
    count_r_display = 0;
  }

  //gに対する表示の条件分岐(%表示or 0-定数表示)
  if (count_denominator == true) {
    count_g_display = countNumber_g2 / g_denominator * 100;
    pre_count_g_display = count_g_display
  }
  if (count_denominator == false) {
    count_g_display = 0;
  }

  //bに対する表示の条件分岐(%表示or 0-定数表示)
  if (count_denominator == true) {
    count_b_display = countNumber_b2 / b_denominator * 100;
    pre_count_b_display = count_b_display
  }
  if (count_denominator == false) {
    count_b_display = 0;
  }

  let ratio_r2 = nf(count_r_display, 1, 0);
  let rario_r2_text = ratio_r2 + "%";
  let ratio_g2 = nf(count_g_display, 1, 0);
  let rario_g2_text = ratio_g2 + "%";
  let ratio_b2 = nf(count_b_display, 1, 0);
  let rario_b2_text = ratio_b2 + "%";

  //夕方カウント表示(数)
  if (clickedDisplay == false) {
    push();
    fill(255);
    text(rario_r2_text, (width / 19 + 25), height / 8.5 - 3, 30, 30);
    text(rario_g2_text, (width / 19 + 25), height / 8.5 + 36, 30, 30);
    text(rario_b2_text, (width / 19 + 25), height / 8.5 + 75, 30, 30);
    pop();
    // 夕方カウント表示(色)
    push();
    //blue
    fill(255, 0, 0);
    rect((width / 19 + 65), height / 8.5, 25, 25);
    pop();
    //green
    push();
    fill(0, 255, 0);
    rect((width / 19 + 65), height / 8.5 + 39, 25, 25);
    pop();
    //red
    push();
    fill(0, 0, 255);
    rect((width / 19 + 65), height / 8.5 + 78, 25, 25);
    pop();
  }

  //観測者②(夕暮れ時)
  push();
  if (count_denominator == false) {
    fill(220, 220, 220);
  } else { fill(255 * count_r_display / 100, 255 * count_g_display / 100, 255 * count_b_display / 100); }
  push();
  translate(15, height / 2.4);
  push();
  rotate(30);
  triangle(20, 3, -24, -20, -23, 20);
  pop();
  pop();
  ellipse(width / 45, height / 2.52, 30, 30);
  pop();

  // テキスト(north について)
  push();
  stroke(0);
  fill(255);
  textSize(25);
  text(str_north, width / 30, height / 1.30);
  pop();


  push();
  stroke(255);
  text(": 赤の散乱度合い", width / 4 + 65, height - 15);
  text(": 緑の散乱度合い", width / 4 + 255, height - 15);
  text(": 青の散乱度合い(1~100)", width / 4 + 480, height - 15);
  slider_r_denominator = r_re_slider.value() / 93 * 100;
  stroke(255, 0, 0)
  text(nf(slider_r_denominator, 1, 0), width / 4 - 22, height - 15);
  slider_g_denominator = g_re_slider.value() / 93 * 100;
  stroke(0, 255, 0)
  text(nf(slider_g_denominator, 1, 0), width / 4 - 22 + 190, height - 15);
  slider_b_denominator = b_re_slider.value() / 93 * 100;
  stroke(0, 0, 255)
  text(nf(slider_b_denominator, 1, 0), width / 4 - 22 + 378, height - 15);
  pop();
}


//カウントに関する操作(mousePressed操作)
function mousePressed() {
  // startボタンを押したのち，beamがカウントされる．
  if (width * 2.8 / 5 < mouseX && mouseX < width * 2.8 / 5 + 100 && height / 1.5 < mouseY && mouseY < height / 1.5 + 38) {

    if (clickedCount_r == false) {
      clickedCount_r = true;
    }
    if (clickedCount_g == false) {
      clickedCount_g = true;
    }
    if (clickedCount_b == false) {
      clickedCount_b = true;
    }
    if (count_denominator == false) {
      count_denominator = true;
    }
  }
  //resetボタンを押したのち，カウント数がリセットされる．
  if (width * 2.8 / 5 + 100 < mouseX && mouseX < width * 2.8 / 5 + 200 && height / 1.5 < mouseY && mouseY < height / 1.5 + 38) {
    window.location.reload();  // マウスをクリックするとページをリロード
  }
  //on/offボタンを押したのち, 表示がoff/onされる
  if (width * 2.8 / 5 + 200 < mouseX && mouseX < width * 2.8 / 5 + 300 && height / 1.5 < mouseY && mouseY < height / 1.5 + 38) {
    if (clickedDisplay == false) {
      clickedDisplay = true;
    } else {
      clickedDisplay = false;
    }
  }
}






//以下,class


class Beam_r {
  constructor(t_r, e_r, d_r, cr, c_r, bc_r, va_r, numbeams, cf_r, bound_r, r_value, r_denominator) {
    this.tip = t_r;
    this.end = e_r;
    this.direction = d_r;
    this.criterion = cr;
    this.clr = c_r;
    this.boundCount_r = bc_r;
    this.vectorAngle = va_r
    this.nm_r = numbeams;
    this.countFin_r = cf_r;
    this.countAlready_r = bound_r;
    this.r_slider = r_value;
    this.denominator = r_denominator;
  }

  display() {
    fill(this.clr);
    if (this.boundCount_r == 0) {
      this.vectorAngle = 0;
    }
    push();
    translate(this.tip.x, this.tip.y);
    push();
    rotate(this.vectorAngle);
    rect(0, 0, 30, 5);
    pop();
    pop();
  }
  move() {

    mult_r = p5.Vector.mult(this.direction, this.criterion);
    this.tip = p5.Vector.add(this.tip, mult_r);
    this.end = p5.Vector.add(this.end, mult_r);
  }

  bound_1() {
    if (this.boundCount_r == 0) {
      let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let r = int(random(0, 30.3 * 100 / 0.9));
        if (r == 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_r = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_r);
          this.end = p5.Vector.add(this.end, mult_r);
          this.boundCount_r = 1;
          this.countAlready_r += 1
        }
      }
    }
  }

  bound_2() {
    if (this.boundCount_r == 0) {
      let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let r = int(random(1, 30.3 * 100 / this.r_slider));
        if (r == 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_r = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_r);
          this.end = p5.Vector.add(this.end, mult_r);
          this.boundCount_r = 1;
          this.countAlready_r += 1
        }
      }
    }
  }

  bound2() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.countAlready_r > 0) {
      this.countAlready_r = 1;
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let b = random(1);
        if (b >= 1.0 * (100 - r_re_slider.value()) / 100) {
          this.direction = p5.Vector.random2D();
          mult_b = p5.Vector.mult(this.direction, this.criterion);
          this.vectorAngle = p5.Vector.heading(this.direction);
          this.tip = p5.Vector.add(this.tip, mult_b);
          this.end = p5.Vector.add(this.end, mult_b);

        }
      }
    }
  }

  //お昼ver
  count_1() {
    if (this.countFin_r == 0 && clickedCount_r == true) {
      if ((height / 2.47 - 10) < this.tip.x && this.tip.x < (height / 2.47) && this.tip.y == height / 1.25 - 20) {
        countNumber_r1 += 1;
        this.countFin_r = 1;
      }
    }
  }
  //夕方ver
  count_2() {
    if (this.countFin_r == 0 && clickedCount_r == true) {
      if ((width / 67 - 10) < this.tip.x && this.tip.x < (width / 67) && this.tip.y == height / 2.5 - 20) {
        countNumber_r2 += 1;
        this.countFin_r = 1;
      }
    }
  }

}


class Beam_g {
  constructor(t_g, e_g, d_g, cr, c_g, bc_g, va_g, numbeams, cf_g, bound_g, g_value, g_denominator) {
    this.tip = t_g;
    this.end = e_g;
    this.direction = d_g;
    this.criterion = cr;
    this.clr = c_g;
    this.boundCount_g = bc_g;
    this.vectorAngle = va_g;
    this.nm_g = numbeams;
    this.countFin_g = cf_g;
    this.countAlready_g = bound_g;
    this.g_slider = g_value;
    this.denominator = g_denominator;
  }

  display() {
    fill(this.clr);
    //strokeWeight(10);
    if (this.boundCount_g == 0) {
      this.vectorAngle = 0;
    }
    push();
    translate(this.tip.x, this.tip.y);
    push();
    rotate(this.vectorAngle);
    rect(0, 0, 26, 5);
    pop();
    pop();
  }
  move() {
    mult_g = p5.Vector.mult(this.direction, this.criterion);
    this.tip = p5.Vector.add(this.tip, mult_g);
    this.end = p5.Vector.add(this.end, mult_g);
  }

  bound_1() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.boundCount_g <= 10) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let g = int(random(0, 30.3 * 100 / 0.9));
        if (g == 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_g = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_g);
          this.end = p5.Vector.add(this.end, mult_g);
          this.boundCount_g += 1;
          this.countAlready_g += 1
        }
      }
    }
    if (dist_earth < height / 3) {
      this.direction = createVector(-1, 1);
      mult_g = p5.Vector.mult(this.direction, this.criterion);
      this.tip = p5.Vector.add(this.tip, mult_g);
      this.end = p5.Vector.add(this.end, mult_g);
    }
  }

  bound_2() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.boundCount_g <= 10) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let g = int(random(0, 30.3 * 100 / this.g_slider));
        if (g == 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_g = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_g);
          this.end = p5.Vector.add(this.end, mult_g);
          this.boundCount_g += 1;
          this.countAlready_g += 1
        }
      }
    }
    if (dist_earth < height / 3) {
      this.direction = createVector(-1, 1);
      mult_g = p5.Vector.mult(this.direction, this.criterion);
      this.tip = p5.Vector.add(this.tip, mult_g);
      this.end = p5.Vector.add(this.end, mult_g);
    }
  }
  bound2() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.countAlready_g > 0) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let b = random(1);
        if (b >= 1.0 * (100 - g_re_slider.value()) / 100) {
          this.direction = p5.Vector.random2D();
          mult_b = p5.Vector.mult(this.direction, this.criterion);
          this.vectorAngle = p5.Vector.heading(this.direction);
          this.tip = p5.Vector.add(this.tip, mult_b);
          this.end = p5.Vector.add(this.end, mult_b);
          this.countAlready_g += 1

        }
      }
    }
  }

  //お昼ver
  count_1() {
    if (this.countFin_g == 0 && clickedCount_g == true) {
      if ((height / 2.47) - 10 < this.tip.x && this.tip.x < (height / 2.47) && this.tip.y == height / 1.25) {
        countNumber_g1 += 1;
        this.countFin_g = 1;
      }
    }
  }
  //夕方ver 
  count_2() {
    if (this.countFin_g == 0 && clickedCount_g == true) {
      if ((width / 67) - 10 < this.tip.x && this.tip.x < (width / 67) && this.tip.y == height / 2.5) {
        countNumber_g2 += 1;
        this.countFin_g = 1;
      }
    }
  }
}



class Beam_b {
  constructor(t_b, e_b, d_b, cr, c_b, bc_b, va_b, numbeams, cf_b, bound_b, b_value, b_denominator) {
    this.tip = t_b;
    this.end = e_b;
    this.direction = d_b;
    this.criterion = cr;
    this.clr = c_b;
    this.boundCount_b = bc_b;
    this.vectorAngle = va_b;
    this.nm_b = numbeams;
    this.countFin_b = cf_b;
    this.countAlready_b = bound_b;
    this.b_slider = b_value;
    this.denominator = b_denominator;
  }

  display() {
    fill(this.clr);
    if (this.boundCount_b == 0) {
      this.vectorAngle = 0;
    }
    push();
    translate(this.tip.x, this.tip.y);
    push();
    rotate(this.vectorAngle);
    rect(0, 0, 21, 5);
    pop();
    pop();
  }
  move() {
    mult_b = p5.Vector.mult(this.direction, this.criterion);
    this.tip = p5.Vector.add(this.tip, mult_b);
    this.end = p5.Vector.add(this.end, mult_b);
  }

  bound_1() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.boundCount_b < 20) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let b = int(random(0, 30.3 * 100 / 0.9));
        if (b === 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_b = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_b);
          this.end = p5.Vector.add(this.end, mult_b);
          this.boundCount_b = 1;
          this.countAlready_b += 1
        }
      }
    }
    if (dist_earth < height / 3) {
      this.direction = createVector(-1, 1);
      mult_g = p5.Vector.mult(this.direction, this.criterion);
      this.tip = p5.Vector.add(this.tip, mult_g);
      this.end = p5.Vector.add(this.end, mult_g);
    }
  }

  bound_2() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.boundCount_b < 20) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let b = int(random(0, 30.3 * 100 / this.b_slider));
        if (b === 1) {
          this.direction = p5.Vector.random2D();
          this.vectorAngle = p5.Vector.heading(this.direction);
          mult_b = p5.Vector.mult(this.direction, this.criterion);
          this.tip = p5.Vector.add(this.tip, mult_b);
          this.end = p5.Vector.add(this.end, mult_b);
          this.boundCount_b = 1;
          this.countAlready_b += 1
        }
      }
    }
    if (dist_earth < height / 3) {
      this.direction = createVector(-1, 1);
      mult_g = p5.Vector.mult(this.direction, this.criterion);
      this.tip = p5.Vector.add(this.tip, mult_g);
      this.end = p5.Vector.add(this.end, mult_g);
    }
  }

  bound2() {
    let dist_earth = sqrt(sq(this.tip.x - c_earth.x) + sq(this.tip.y - c_earth.y));
    if (this.countAlready_b > 0) {
      if ((dist_earth < height * 1.4 / 2) && (dist_earth > height / 2.8)) {
        let b = random(1);
        if (b >= 1.0 * (100 - b_re_slider.value()) / 100) {
          this.direction = p5.Vector.random2D();
          mult_b = p5.Vector.mult(this.direction, this.criterion);
          this.vectorAngle = p5.Vector.heading(this.direction);
          this.tip = p5.Vector.add(this.tip, mult_b);
          this.end = p5.Vector.add(this.end, mult_b);
          this.countAlready_b += 1

        }
      }
    }
  }
  //お昼ver
  count_1() {
    if (this.countFin_b == 0 && clickedCount_b == true) {
      if ((height / 2.47 - 10) < this.tip.x && this.tip.x < (height / 2.47) && this.tip.y == height / 1.25 + 20) {
        countNumber_b1 += 1;
        this.countFin_b = 1;
      }
    }
  }
  //夕方ver 
  count_2() {
    if (this.countFin_b == 0 && clickedCount_b == true) {
      if ((width / 67 - 10) < this.tip.x && this.tip.x < (width / 67) && this.tip.y == height / 2.5 + 20) {
        countNumber_b2 += 1;
        this.countFin_b = 1;
      }
    }
  }
}

function sunlight(y) {
  // 太陽光(平行光)の描画⑴


  push();
  noStroke();
  fill(255, 255, 255, 255);
  push();
  translate(width * 4 / 5, y);
  push();
  translate(-295, -5);
  rectMode(CORNER);
  rotate(PI / 7);
  noStroke();
  rect(0, 0, 80, 10);
  pop();
  push();
  translate(-300, -5);
  rectMode(CORNER);
  rotate(-PI / 7);
  rect(0, 0, 80, 10);
  pop();
  pop();
  rectMode(CENTER);
  rect(width * 4 / 5, y, 600, 10);
  pop();

}