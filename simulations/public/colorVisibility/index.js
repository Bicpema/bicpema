let imgSet;
let img0;
let img1, img2, img3, img4, img5, img6, img7;
let img11, img22, img33, img44, img55, img66, img77;
let posx = 150;
let posy = 150;
let beam1;
let buttons = [];
let s_r, s_g, s_b;
//画像出力
function preload() {
  imgSet = loadImage("/simulations/colorVisibility/吹き出し.png");
  img0 = loadImage("/simulations/colorVisibility/image0.png");
  img1 = loadImage("/simulations/colorVisibility/image1.png");
  img2 = loadImage("/simulations/colorVisibility/image2.png");
  img3 = loadImage("/simulations/colorVisibility/image3.png");
  img4 = loadImage("/simulations/colorVisibility/image4.png");
  img5 = loadImage("/simulations/colorVisibility/image5.png");
  img6 = loadImage("/simulations/colorVisibility/image6.png");
  img7 = loadImage("/simulations/colorVisibility/image7.png");
  img11 = loadImage("/simulations/colorVisibility/image11.png");
  img22 = loadImage("/simulations/colorVisibility/image22.png");
  img33 = loadImage("/simulations/colorVisibility/image33.png");
  img44 = loadImage("/simulations/colorVisibility/image44.png");
  img55 = loadImage("/simulations/colorVisibility/image55.png");
  img66 = loadImage("/simulations/colorVisibility/image66.png");
  img77 = loadImage("/simulations/colorVisibility/image77.png");
}
function setup() {
  createCanvas(1100, 500);
  background(50);
  //吹き出し
  image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
  //ランプ
  noStroke();
  fill(245, 180, 30);
  rect((width * 2) / 5, 0, width / 12, height / 8);
  fill(255);
  ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
  //白目
  fill(255);
  ellipse((width * 5) / 6, (height * 2) / 3, width / 12, height / 4);
  ellipse((width * 5) / 6 + width / 12, (height * 2) / 3, width / 12, height / 4);
  //黒目
  fill(0);
  ellipse((width * 39) / 48, (height * 2) / 3, width / 24, height / 10);
  ellipse((width * 39) / 48 + width / 12, (height * 2) / 3, width / 24, height / 10);

  //色ボタン
  fill(255);
  rect(width / 2 - 120, height / 2, 30, 30);
  fill(255, 0, 0);
  rect(width / 2 - 90, height / 2, 30, 30);
  fill(0, 0, 255);
  rect(width / 2 - 60, height / 2, 30, 30);
  fill(0, 255, 0);
  rect(width / 2 - 30, height / 2, 30, 30);
  fill(255, 255, 0);
  rect(width / 2, height / 2, 30, 30);
  fill(0, 255, 255);
  rect(width / 2 + 30, height / 2, 30, 30);
  fill(255, 0, 255);
  rect(width / 2 + 60, height / 2, 30, 30);
  fill(0);
  rect(width / 2 + 90, height / 2, 30, 30);
  //テキスト
  textAlign(CENTER, CENTER);
  textSize(15);
  stroke(0);
  text("反射", posx, posy - 22);
  text("吸収", posx + 40, posy - 22);
  // 赤スライダー
  s_r = createSlider(0, 1, 0);
  s_r.position(posx, posy);
  s_r.style("width", "50px");
  // 緑スライダー
  s_g = createSlider(0, 1, 0);
  s_g.position(posx, posy + 40);
  s_g.style("width", "50px");
  // 青スライダー
  s_b = createSlider(0, 1, 0);
  s_b.position(posx, posy + 80);
  s_b.style("width", "50px");
  //クラス
  oldObject = new object();
  beam1 = new Beam(posx, posy);
}

function draw() {
  if (oldObject) {
    oldObject.display();
  }
  // 各ボタンを表示
  for (let button of buttons) {
    button.display();
  }
  beam1.display();
}
function mousePressed() {
  if (oldObject) {
    oldObject.mousePressed();
  }
  // 各ボタンのクリックをチェック
  for (let button of buttons) {
    button.clicked(mouseX, mouseY);
  }
}
//beamの制御
class Beam {
  constructor(posx, posy) {
    this.posx = posx;
    this.posy = posy;
    this.s_r = s_r;
    this.s_g = s_g;
    this.s_b = s_b;

    this.fixedValue;
    this.fixed = false;
    // on/offボタン
    //赤
    this.button_r = createButton("赤 on");
    this.button_r.size(60);
    this.button_r.position(posx - 100, posy - 5);
    this.button_r.mousePressed(this.toggleBeam_r.bind(this));
    this.label_r = "on";
    //緑
    this.button_g = createButton("緑 on");
    this.button_g.size(60);
    this.button_g.position(posx - 100, posy + 35);
    this.button_g.mousePressed(this.toggleBeam_g.bind(this));
    this.label_g = "on";
    //青
    this.button_b = createButton("青 on");
    this.button_b.size(60);
    this.button_b.position(posx - 100, posy + 75);
    this.button_b.mousePressed(this.toggleBeam_b.bind(this));
    this.label_b = "on";
  }

  display() {
    fill(255);
    rect(this.posx - 20, this.posy - 130, 90, 150);
    // テキスト表示
    textAlign(CENTER, CENTER);
    textSize(15);
    stroke(0);
    text("反射", this.posx, this.posy - 110);
    text("吸収", this.posx + 45, this.posy - 110);
    //赤beam
    if (this.label_r === "on") {
      // 入射
      strokeWeight(5);
      stroke(255, 0, 0);
      line(400, 80, 315, 165); // メイン
      line(315, 165, 315, 165 - 10); // サブ
      line(315, 165, 315 + 10, 165);

      if (this.s_r.value() == 0) {
        // 反射
        line(300, 330, 780, 330); // メイン
        line(780, 330, 770, 340);
        line(780, 330, 770, 320);
        // 吸収キャンセル
        stroke(150);
        line(310, 170, 265, 215); // メイン
        line(265, 215, 265, 205);
        line(265, 215, 275, 215);
      }
      if (this.s_r.value() == 1) {
        // 吸収
        stroke(255, 200, 200);
        line(310, 170, 265, 215); // メイン
        line(265, 215, 265, 205);
        line(265, 215, 275, 215);
        // 反射キャンセル
        strokeWeight(5);
        stroke(150);
        line(300, 330, 780, 330); // メイン
        line(780, 330, 770, 340);
        line(780, 330, 770, 320);
      }
    } else {
      // キャンセル
      strokeWeight(5);
      stroke(150);
      // 入射
      line(400, 80, 315, 165); // メイン
      line(315, 165, 315, 165 - 10); // サブ
      line(315, 165, 315 + 10, 165);
      // 反射
      line(300, 330, 780, 330); // メイン
      line(780, 330, 770, 340);
      line(780, 330, 770, 320);
      // 吸収
      line(310, 170, 265, 215); // メイン
      line(265, 215, 265, 205);
      line(265, 215, 275, 215);
    }
    //緑beam
    if (this.label_g === "on") {
      // 入射
      strokeWeight(5);
      stroke(0, 255, 0);
      line(400, 130, 315, 215); //メイン
      line(315, 215, 315, 215 - 10); //サブ
      line(315, 215, 315 + 10, 215);

      if (this.s_g.value() == 0) {
        // 反射
        line(300, 380, 780, 380); //メイン
        line(780, 380, 770, 380 + 10);
        line(780, 380, 770, 380 - 10);
        // 吸収キャンセル
        stroke(150);
        line(310, 220, 265, 265); //メイン
        line(265, 265, 265, 255);
        line(265, 265, 275, 265);
      } else if (this.s_g.value() == 1) {
        // 吸収
        stroke(200, 250, 200);
        line(310, 220, 265, 265); //メイン
        line(265, 265, 265, 255);
        line(265, 265, 275, 265);
        // 反射キャンセル
        strokeWeight(5);
        stroke(150);
        line(300, 380, 780, 380); //メイン
        line(780, 380, 770, 380 + 10);
        line(780, 380, 770, 380 - 10);
      }
    } else {
      // キャンセル
      strokeWeight(5);
      stroke(150);
      // 入射
      line(400, 130, 315, 215); //メイン
      line(315, 215, 315, 215 - 10); //サブ
      line(315, 215, 315 + 10, 215);
      // 反射
      line(300, 380, 780, 380); //メイン
      line(780, 380, 770, 380 + 10);
      line(780, 380, 770, 380 - 10);
      // 吸収
      line(310, 220, 265, 265); //メイン
      line(265, 265, 265, 255);
      line(265, 265, 275, 265);
    }
    //青beam
    if (this.label_b === "on") {
      // 入射
      strokeWeight(5);
      stroke(0, 0, 255);
      line(400, 180, 315, 265); //メイン
      line(315, 265, 315, 265 - 10); //サブ
      line(315, 265, 315 + 10, 265);

      if (this.s_b.value() == 0) {
        // 反射
        line(300, 430, 780, 430); //メイン
        line(780, 430, 770, 430 + 10);
        line(780, 430, 770, 430 - 10);
        // 吸収キャンセル
        stroke(150);
        line(310, 270, 265, 315); //メイン
        line(265, 315, 265, 305);
        line(265, 315, 275, 315);
      } else if (this.s_b.value() == 1) {
        // 吸収
        stroke(200, 200, 255);
        line(310, 270, 265, 315); //メイン
        line(265, 315, 265, 305);
        line(265, 315, 275, 315);
        // 反射キャンセル
        strokeWeight(5);
        stroke(150);
        line(300, 430, 780, 430); //メイン
        line(780, 430, 770, 430 + 10);
        line(780, 430, 770, 430 - 10);
      }
    } else {
      // キャンセル
      strokeWeight(5);
      stroke(150);
      // 入射
      line(400, 180, 315, 265); //メイン
      line(315, 265, 315, 265 - 10); //サブ
      line(315, 265, 315 + 10, 265);
      // 反射
      line(300, 430, 780, 430); //メイン
      line(780, 430, 770, 430 + 10);
      line(780, 430, 770, 430 - 10);
      // 吸収
      line(310, 270, 265, 315); //メイン
      line(265, 315, 265, 305);
      line(265, 315, 275, 315);
    }
    //光源の切り替え
    //白
    noStroke();
    if (this.label_r === "on" && this.label_g === "on" && this.label_b === "on") {
      fill(255);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //赤
    if (this.label_r === "on" && this.label_g === "off" && this.label_b === "off") {
      fill(255, 0, 0);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //緑
    if (this.label_r === "off" && this.label_g === "on" && this.label_b === "off") {
      fill(0, 255, 0);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //青
    if (this.label_r === "off" && this.label_g === "off" && this.label_b === "on") {
      fill(0, 0, 255);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //黄色
    if (this.label_r === "on" && this.label_g === "on" && this.label_b === "off") {
      fill(255, 255, 0);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //水色
    if (this.label_r === "off" && this.label_g === "on" && this.label_b === "on") {
      fill(0, 255, 255);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //紫
    if (this.label_r === "on" && this.label_g === "off" && this.label_b === "on") {
      fill(255, 0, 255);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
    //黒
    if (this.label_r === "off" && this.label_g === "off" && this.label_b === "off") {
      fill(0);
      ellipse((width * 53) / 120, height / 6, width / 9, width / 9);
    }
  }
  //光源ボタンのリセット
  toggleBeam_r() {
    if (this.label_r === "on") {
      this.label_r = "off";
      this.button_r.html("赤 off");
      this.s_r.value(1);
      this.fixed = true;
      this.fixedValue = this.s_r.value();
      this.s_r.attribute("disabled", "");
    } else {
      this.label_r = "on";
      this.button_r.html("赤 on");
      this.fixed = false;
      this.s_r.removeAttribute("disabled");
    }
  }
  toggleBeam_g() {
    if (this.label_g === "on") {
      this.label_g = "off";
      this.button_g.html("緑 off");
      this.s_g.value(1);
      this.fixed = true;
      this.fixedValue = this.s_g.value();
      this.s_g.attribute("disabled", "");
    } else {
      this.label_g = "on";
      this.button_g.html("緑 on");
      this.fixed = false;
      this.s_g.removeAttribute("disabled");
    }
  }
  toggleBeam_b() {
    if (this.label_b === "on") {
      this.label_b = "off";
      this.button_b.html("青 off");
      this.s_b.value(1);
      this.fixed = true;
      this.fixedValue = this.s_b.value();
      this.s_b.attribute("disabled", "");
    } else {
      this.label_b = "on";
      this.button_b.html("青 on");
      this.fixed = false;
      this.s_b.removeAttribute("disabled");
    }
  }
}
//画像の制御
class object {
  constructor(k, object) {
    this.k = -1;
    this.object = -1;
  }
  mousePressed() {
    if (width / 2 - 120 < mouseX && mouseX < width / 2 - 90 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 0;
    } else if (width / 2 - 90 < mouseX && mouseX < width / 2 - 60 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 1;
    } else if (width / 2 - 60 < mouseX && mouseX < width / 2 - 30 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 2;
    } else if (width / 2 - 30 < mouseX && mouseX < width / 2 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 3;
    } else if (width / 2 < mouseX && mouseX < width / 2 + 30 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 4;
    } else if (width / 2 + 30 < mouseX && mouseX < width / 2 + 60 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 5;
    } else if (width / 2 + 60 < mouseX && mouseX < width / 2 + 90 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 6;
    } else if (width / 2 + 90 < mouseX && mouseX < width / 2 + 120 && height / 2 < mouseY && mouseY < height / 2 + 30) {
      this.k = 7;
    }
    this.select();
  }
  //１０～１７で画像の識別
  select() {
    if (this.k == 0) {
      this.object = 10;
    } else if (this.k == 1) {
      this.object = 11;
    } else if (this.k == 2) {
      this.object = 12;
    } else if (this.k == 3) {
      this.object = 13;
    } else if (this.k == 4) {
      this.object = 14;
    } else if (this.k == 5) {
      this.object = 15;
    } else if (this.k == 6) {
      this.object = 16;
    } else if (this.k == 7) {
      this.object = 17;
    }
  }
  //画像の出力
  display() {
    noStroke();
    fill(50);
    rect(0, 200, width / 4, 300);
    //雪だるま
    if (this.object == 10) {
      image(img0, 0, 200, (img0.width * 2) / 5, (img0.height * 2) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 51, 255);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img0, 775, 80, img0.width / 5, img0.height / 5);
        pop();
      }
    }
    //リンゴ
    if (this.object == 11) {
      image(img1, 45, 220, (img1.width * 2) / 5, (img1.height * 2) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 255, 255);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img1, 775, 80, img1.width / 4, img1.height / 4);
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 51, 255);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img11, 775, 80, img11.width / 4, img11.height / 4);
        pop();
      }
    }
    //てふてふ
    if (this.object == 12) {
      image(img2, 20, 220, (img2.width * 3) / 5, (img2.height * 3) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img2, 775, 80, img2.width / 3, img2.height / 3);
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img22, 775, 80, img22.width / 3, img22.height / 3);
        pop();
      }
    }
    //ピーマン
    if (this.object == 13) {
      image(img3, 40, 200, (img3.width * 3) / 5, (img3.height * 3) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img3, 775, 80, img3.width / 3, img3.height / 3);
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 255);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img33, 775, 80, img33.width / 3, img33.height / 3);
        pop();
      }
    }
    //ぴよぴよ
    if (this.object == 14) {
      image(img4, 10, 210, img4.width / 6, img4.height / 6);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 255);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img4, 730, 55, img44.width / 7, img44.height / 7);
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img44, 730, 55, img44.width / 7, img44.height / 7);
        pop();
      }
    }

    //アイス
    if (this.object == 15) {
      image(img5, 70, 220, (img5.width * 3) / 5, (img5.height * 3) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 255);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img5, 775, 80, img5.width / 3, img5.height / 3);
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img55, 775, 80, img55.width / 3, img55.height / 3);
        pop();
      }
    }
    //ナス
    if (this.object == 16) {
      image(img6, 30, 160, (img6.width * 3) / 5, (img6.height * 3) / 5);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 255);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img6, 775, 80, img6.width / 3, img6.height / 3);
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 0);
        image(img66, 775, 80, img66.width / 3, img66.height / 3);
        pop();
      }
    }
    //カラス
    if (this.object == 17) {
      image(img7, 0, 200, img7.width / 3, img7.height / 3);
      //白
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //赤
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 0);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //緑
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(51, 204, 51);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //青
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(0, 0, 255);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //黄色
      if (s_r.value() == 0 && s_g.value() == 0 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(251, 208, 29);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //水色
      if (s_r.value() == 1 && s_g.value() == 0 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(102, 255, 255);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //紫色
      if (s_r.value() == 0 && s_g.value() == 1 && s_b.value() == 0) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        push();
        tint(255, 0, 255);
        image(img77, 750, 61, img77.width / 4, img77.height / 4);
        pop();
      }
      //黒色
      if (s_r.value() == 1 && s_g.value() == 1 && s_b.value() == 1) {
        //吹き出し
        image(imgSet, (width * 4) / 7, height / 10, (width * 3) / 8, (height * 3) / 7);
        //頭の中
        image(img7, 750, 61, img7.width / 4, img7.height / 4);
      }
    }
  }
}
