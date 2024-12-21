// index.jsはメインのメソッドを呼び出すためのファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// preload関数
// setup関数よりも前に一度だけ呼び出される。
function preload() {
  font = loadFont("../../assets/fonts/ZenMaruGothic-Regular.ttf");
}



// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  //deviceJude.judge(); //2024.8.20 上手くいってない模様..?
  canvasController.fullScreen();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

//切り替えボタンの処理
function changemuki() {
  if (chanmuki === true) {
    changebutton.html("空気中から媒質中に変える")
    chanmuki = false
  } else {
    changebutton.html("媒質中から空気中に変える")
    chanmuki = true
  }
}

function windowResized() {
  canvasController.resizeScreen();
}



// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  scale(width / 1000);
  background(255);

  fill(0);

  stroke(0)
  strokeWeight(1);
  textSize(30);
  rect(100, 500 * 9 / 16 - 10, 40, 20) //レーザーポインター

  let centerX = 500;
  let centerY = 1000 * 9 / 32;

  reflactiveindex = reflactiveindex_slider.value();//屈折率のスライダー

  // let angle = angles[0]; // 回転角度は配列から取得

  // マウスが押されているとき
  // if (mouseIsPressed) {
  //   if (mouseX < centerX + 10 && mouseY < 1000 * 40 / 50)
  //     angle = atan2(centerY - mouseY, centerX - mouseX); // マウスの位置に基づいて角度を更新。マウスと中心の距離を出す。

  //   angles[0] = angle; // 配列の角度を更新
  // }

  // let centerX = 500;
  // let centerY = 1000 * 9 / 32;


  if (chanmuki == true) {
    kuuki_mizu()
  }
  if (chanmuki == false) {
    mizu_kuuki()
  }


  //物質を変える
  if (isRadioChanged == true) {
    if (mediumradio.value() === "水") {
      reflactiveindex_slider.value(1.333)
      isRadioChanged = false;
    }
    if (mediumradio.value() === "石英ガラス") {
      reflactiveindex_slider.value(1.459)
      isRadioChanged = false;
    }
    if (mediumradio.value() === "エタノール") {
      reflactiveindex_slider.value(1.362)
      isRadioChanged = false;
    }
    if (mediumradio.value() === "水晶") {
      reflactiveindex_slider.value(1.544)
      isRadioChanged = false;
    }
    if (mediumradio.value() === "ダイヤモンド") {
      reflactiveindex_slider.value(2.417)
      isRadioChanged = false;
    }
  }

  deviceJudge.rotateInstruction();




}

// 入力変更時に実行される関数
function handleInputChange() {
  let inputValue = input.value();
  let convertedValue = toHalfWidth(inputValue); // 入力を半角に変換
  input.value(convertedValue); // 変換した値をinputに反映
  if (inputValue === "") {
    angle = 0
  }
}

// 全角文字を半角に変換する関数
function toHalfWidth(str) {
  return str.replace(/[\uFF01-\uFF5E]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  }).replace(/\u3000/g, ' '); // 全角スペースを半角スペースに変換
}
// windowResized関数
// シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}

function handleRadioChange() {
  isRadioChanged = true; // ラジオボタンが変更されたことを記録
}

function resetAngle() {
  angleslider.value(0)
  reflactiveindex_slider.value(1.333)
  mediumradio.selected("水")
  kinouChange = true
}

//円の大きさを変えるボタン
function ellipseChange() {
  if (ellipseSize == true) {
    ellipseButton.html("円を小さく")
    ellipseSize = false
  } else {
    ellipseButton.html("円を大きく")
    ellipseSize = true
  }
}


//入力キー
function clicked() {
  kinouChange = false
}

//マウス操作に戻るボタン
function modoru() {
  kinouChange = true
}


//空中から水中の屈折
function kuuki_mizu() {
  let centerX = 500;
  let centerY = 1000 * 9 / 32;
  let anglemath = float(angleslider.value());
  let aan
  aan = float(input.value());
  let aann = radians(aan)
  if (kinouChange == true) {
    angle = radians(anglemath);// 回転角度は配列から取得
  } else if (kinouChange == false && 0 <= aan && aan <= 90) {
    angle = aann
  }
  // rotation();
  // beam();
  // refractive();
  // reflectionangle();
  // reflectance();
  // rotatinglight();


  //function rotation(){
  // ellipseを回転の影響を受けない位置に描画


  // 回転したい部分を描画//円の大きさを変える
  if (ellipseSize == true) {
    push();
    translate(centerX, centerY);　//中心の変更
    rotate(angle);
    fill(255);
    ellipse(0, 0, 200, 200);  // 回転するellipse
    fill(0);
    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("0", -80, 0);
    text("270", 0, -80);
    text("180", 80, 0);
    text("90", 0, 80);
    if (mediumradio.value() == "水") {
      fill(102, 178, 255);
    }
    if (mediumradio.value() == "エタノール") {
      fill(255, 255, 224);
    }
    if (mediumradio.value() == "石英ガラス") {
      fill(245, 245, 245)
    }
    if (mediumradio.value() == "水晶") {
      fill(212, 236, 234)
    }
    if (mediumradio.value() == "ダイヤモンド") {
      fill(233, 237, 242)
    }
    arc(0, 0, 100, 100, -HALF_PI, HALF_PI, PIE);
    stroke(0);
    //長い目盛りの描画
    for (let i = 0; i < mininumTicks; i++) {
      let scaleangle = TWO_PI / mininumTicks * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 100;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 100;
      x2[i] = cos(scaleangle) * (100 - 15);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (100 - 15);
    }
    for (let i = 0; i < mininumTicks; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }


    //細かい目盛り
    for (let i = 0; i < 60; i++) {
      let scaleangle = TWO_PI / 60 * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 100;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 100;
      x2[i] = cos(scaleangle) * (100 - 5);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (100 - 5);
    }
    for (let i = 0; i < 60; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }
    pop();
  }

  if (ellipseSize == false) {
    push();
    translate(centerX, centerY);　//中心の変更
    rotate(angle);
    fill(255);
    ellipse(0, 0, 300, 300);  // 回転するellipse
    fill(0);
    stroke(0);
    textSize(20);
    //textAlign(CENTER, CENTER);
    text("0", -130, 0);
    text("270", 0, -130);
    text("180", 130, 0);
    text("90", 0, 130);
    if (mediumradio.value() == "水") {
      fill(102, 178, 255);
    }
    if (mediumradio.value() == "エタノール") {
      fill(255, 255, 224);
    }
    if (mediumradio.value() == "石英ガラス") {
      fill(245, 245, 245)
    }
    if (mediumradio.value() == "水晶") {
      fill(212, 236, 234)
    }
    if (mediumradio.value() == "ダイヤモンド") {
      fill(233, 237, 242)
    }
    arc(0, 0, 200, 200, -HALF_PI, HALF_PI, PIE);
    stroke(0);
    for (let i = 0; i < bignumTicks; i++) {
      let scaleangle = TWO_PI / bignumTicks * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 150;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 150;
      x2[i] = cos(scaleangle) * (150 - 20);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (150 - 20);
    }
    for (let i = 0; i < bignumTicks; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }

    //細かい目盛り
    for (let i = 0; i < 120; i++) {
      let scaleangle = TWO_PI / 120 * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 150;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 150;
      x2[i] = cos(scaleangle) * (150 - 7);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (150 - 7);
    }
    for (let i = 0; i < 120; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }

    pop();
  }



  //function beam(){
  //光線
  stroke(255, 0, 0);
  strokeWeight(2)
  line(140, 500 * 9 / 16, centerX, centerY)


  //function refractive(){
  //屈折角
  let a = degrees(angle)
  //console.log(a)
  let aa = sin(angle)

  let b
  let sin_b = sin(angle) / reflactiveindex
  b = asin(sin_b)
  let reflactive = degrees(b)　　//屈折角


  //rotateの角度
  let c = 90 + a
  let d = c - reflactive
  let e = radians(d);

  //function reflectionangle(){
  let f = 2 * a
  let g = radians(f)//反射角の回転角度(角の入射２倍)




  //function reflectance(){   //ｐ偏光の反射率(フレネルの公式)
  let p = tan(angle - b) / tan(angle + b) //偏光の強度
  let pp = p * p
  pp = Math.pow(pp, 1 / 2.4)//人の目に見えるように対数関数で
  let ppkyoudo
  if (0 <= pp && pp <= 1) {
    ppkyoudo = 100 * pp
  } else if (1 < pp) {
    ppkyoudo = 100
  } else {
    ppkyoudo = 0
  }
  //console.log(pp)

  let oo = reflactiveindex * cos(angle) - cos(b)
  let cc = reflactiveindex * cos(angle) + cos(b)
  let co = oo / cc  //反射率のコサイン版

  //屈折光の強度
  let ku = 1 - pp
  let kukyoudo
  if (0 <= ppkyoudo && ppkyoudo <= 100) {
    kukyoudo = 100 - ppkyoudo
  } else {
    kukyoudo = 0
  }



  //function rotatinglight(){  //座標の回転(屈折光)
  push()
  translate(centerX, centerY);
  rotate(e);
  strokeWeight(2)
  stroke(255, 0, 0, 255 * ku);
  line(0, 0, 0, -10000);
  pop()

  //反射角の回転
  push()
  translate(centerX, centerY);
  rotate(g);
  strokeWeight(2);
  stroke(255, 0, 0, 255 * pp);
  if (a != 0) {
    line(0, 0, -1000, 0);
  }
  pop()

  //屈折角の表示
  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(25);
  textAlign(LEFT, CENTER)
  text("分度器の値", 20, 7000 / 16)
  text("透過光", 20, 7750 / 16, 50, 50);
  if (0 <= a && a < 90) {
    text(nf(180 + reflactive, 1, 1) + "°", 110, 7750 / 16, 50, 50);
  } if (-90 < a && a < 0) {
    text(nf(180 + reflactive, 1, 1) + "°", 110, 7750 / 16, 50, 50);
  }
  if (a >= 90 || a <= -90) {
    text("--", 110, 7750 / 16, 50, 50);
  }
  text("入射光", 20, 7300 / 16, 50, 50);
  if (0 <= a) {
    text(nf(a, 1, 1) + "°", 110, 7300 / 16, 50, 50)
  }
  if (a < 0) {
    text(nf(360 + a, 1, 1) + "°", 110, 7300 / 16, 50, 50);
  }

  strokeWeight(0.5)
  text("分度器の回転", 20, 8300 / 16, 50, 50)


  text("空気中から媒質中", 20, 100 / 16, 50, 50)

  // text("反射光の強度",windowWidth*0.2/5,windowHeight*2.7/5,50,50);
  // text(nf(ppkyoudo,1,1)+"%",windowWidth*1.5/5,windowHeight*2.7/5,50,50);
  // text("屈折光の強度",windowWidth*0.2/5,windowHeight*3/5,50,50);
  // text(nf(kukyoudo,1,1)+"%",windowWidth*1.5/5,windowHeight*3/5,50,50) 

  //強度の表示(HTML)
  myDiv.html('反射光の強度' + nf(ppkyoudo, 1, 2) + '%');
  yourDiv.html('透過光の強度' + nf(kukyoudo, 1, 1) + '%');

  reflactiveDiv.html('屈折率を変える');
  reflactivenumberDiv.html(nf(reflactiveindex, 1, 3))
}

function mizu_kuuki() {
  let centerX = 500;
  let centerY = 500 * 9 / 16;
  //マウスとキーボードの切り替え
  let anglemath = float(angleslider.value());
  let aan = float(input.value());
  let aann = radians(aan)
  if (kinouChange == true) {
    angle = radians(anglemath);  // 回転角度は配列から取得
  } else if (kinouChange == false && 0 <= aan && aan <= 90) {
    angle = aann
  } else {
    angle = 0
  }

  if (ellipseSize == true) {
    push();
    translate(centerX, centerY);　//中心の変更
    rotate(angle);
    fill(255);
    ellipse(0, 0, 200, 200);  // 回転するellipse
    fill(0);
    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("0", -80, 0);
    text("270", 0, -80);
    text("180", 80, 0);
    text("90", 0, 80);
    if (mediumradio.value() == "水") {
      fill(102, 178, 255);
    }
    if (mediumradio.value() == "エタノール") {
      fill(255, 255, 224);
    }
    if (mediumradio.value() == "石英ガラス") {
      fill(245, 245, 245)
    }
    if (mediumradio.value() == "水晶") {
      fill(212, 236, 234)
    }
    if (mediumradio.value() == "ダイヤモンド") {
      fill(233, 237, 242)
    }
    arc(0, 0, 100, 100, HALF_PI, -HALF_PI, PIE);
    stroke(0)
    for (let i = 0; i < mininumTicks; i++) {
      let scaleangle = TWO_PI / mininumTicks * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 100;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 100;
      x2[i] = cos(scaleangle) * (100 - 15);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (100 - 15);
    }
    for (let i = 0; i < mininumTicks; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }
    //細かい目盛り
    for (let i = 0; i < 48; i++) {
      let scaleangle = TWO_PI / 48 * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 100;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 100;
      x2[i] = cos(scaleangle) * (100 - 5);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (100 - 5);
    }
    for (let i = 0; i < 48; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }
    pop();
  }

  if (ellipseSize == false) {
    push();
    translate(centerX, centerY);　//中心の変更
    rotate(angle);
    fill(255);
    ellipse(0, 0, 300, 300);  // 回転するellipse
    fill(0);
    stroke(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("0", -130, 0);
    text("270", 0, -130);
    text("180", 130, 0);
    text("90", 0, 130);
    if (mediumradio.value() == "水") {
      fill(102, 178, 255);
    }
    if (mediumradio.value() == "エタノール") {
      fill(255, 255, 224);
    }
    if (mediumradio.value() == "石英ガラス") {
      fill(245, 245, 245)
    }
    if (mediumradio.value() == "水晶") {
      fill(212, 236, 234)
    }
    if (mediumradio.value() == "ダイヤモンド") {
      fill(233, 237, 242)
    }
    arc(0, 0, 200, 200, HALF_PI, -HALF_PI, PIE);
    stroke(0)
    for (let i = 0; i < bignumTicks; i++) {
      let scaleangle = TWO_PI / bignumTicks * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 150;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 150;
      x2[i] = cos(scaleangle) * (150 - 15);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (150 - 15);
    }
    for (let i = 0; i < bignumTicks; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }
    //細かい目盛り
    for (let i = 0; i < 96; i++) {
      let scaleangle = TWO_PI / 96 * i;  // 各目盛りの角度
      x1[i] = cos(scaleangle) * 150;  // 円周上の目盛りの始点
      y1[i] = sin(scaleangle) * 150;
      x2[i] = cos(scaleangle) * (150 - 7);  // 円周の内側に少しずらした終点
      y2[i] = sin(scaleangle) * (150 - 7);
    }
    for (let i = 0; i < 96; i++) {
      line(x1[i], y1[i], x2[i], y2[i]);
    }
    pop();
  }


  //光線
  stroke(255, 0, 0);
  strokeWeight(2)
  line(140, 500 * 9 / 16, centerX, centerY)

  //入射角
  let a = degrees(angle)
  console.log(a)
  let aa = sin(angle)

  //屈折角
  let b
  let sin_b = sin(angle) * reflactiveindex;
  b = asin(sin_b);
  let reflactive = degrees(b);
  //console.log(reflactive);

  //rotateの角度
  let c = 90 + a
  let d = c - reflactive;
  let e = radians(d);
  //console.log(e)

  //反射角の回転角度(角の入射２倍)
  let f = 2 * a
  let g = radians(f);

  //ｐ偏光の反射率(フレネルの公式)
  let p = tan(angle - b) / tan(angle + b) //偏光の強度
  let pp = p * p
  let ppkyoudo
  if (0 <= pp && pp <= 1) {
    ppkyoudo = 100 * pp
  } else if (a == 0) {
    ppkyoudo = 0
  } else {
    ppkyoudo = 100
  }


  pp = Math.pow(pp, 1 / 2.4)//人の目に見えるように対数関数で


  let oo = reflactiveindex * cos(angle) - cos(b)
  let cc = reflactiveindex * cos(angle) + cos(b)
  let co = oo / cc  //反射率のコサイン版

  //屈折光の強度
  let ku = 1 - pp
  let kukyoudo
  if (0 <= ku && ku <= 1) {
    kukyoudo = 100 * ku
  } else if (a == 0) {
    kukyoudo = 100
  } else {
    kukyoudo = 0
  }

  push()
  translate(centerX, centerY);
  rotate(e);
  strokeWeight(2)
  stroke(255, 0, 0, 255 * ku);
  if (e > 0) {
    line(0, 0, 0, -10000);
  }
  pop()

  push()
  translate(centerX, centerY);
  rotate(g);
  strokeWeight(2);
  stroke(255, 0, 0, 255 * pp);
  if (a != 0) {
    line(0, 0, -1000, 0);
  }
  pop()

  //屈折角の表示
  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(25);
  textAlign(LEFT, CENTER);
  text("分度器の値", 20, 7000 / 16)
  text("透過光", 20, 7750 / 16, 50, 50);
  if (e >= 0 && 0 <= a) {
    text(nf(180 + reflactive, 1, 1) + "°", 110, 7750 / 16, 50, 50);
  } else if (e >= 0 && a <= 0) {
    text(nf(180 + reflactive, 1, 1) + "°", 110, 7750 / 16, 50, 50);
  }
  else {
    text("--", 110, 7750 / 16, 50, 50)
  }
  text("入射光", 20, 7300 / 16, 50, 50);
  if (0 <= a) {
    text(nf(a, 1, 1) + "°", 110, 7300 / 16, 50, 50)
  } if (a < 0) {
    text(nf(360 + a, 1, 1) + "°", 110, 7300 / 16, 50, 50)
  }

  strokeWeight(0.5)
  text("分度器の回転", 20, 8300 / 16, 50, 50)

  text("媒質中から空気中", 20, 100 / 16, 50, 50)
  //強度の表示
  // text("反射光の強度", windowWidth * 0.2 / 5, windowHeight * 2.7 / 5, 50, 50);
  // text(nf(ppkyoudo, 1, 2) + "%", windowWidth * 1.5 / 5, windowHeight * 2.7 / 5, 50, 50);
  // text("屈折光の強度", windowWidth * 0.2 / 5, windowHeight * 3 / 5, 50, 50);
  // text(nf(kukyoudo, 1, 1) + "%", windowWidth * 1.5 / 5, windowHeight * 3 / 5, 50, 50)

  myDiv.html('反射光の強度' + nf(ppkyoudo, 1, 2) + '%');
  yourDiv.html('透過光の強度' + nf(kukyoudo, 1, 1) + '%');

  reflactiveDiv.html('屈折率を変える');
  reflactivenumberDiv.html(nf(reflactiveindex, 1, 3))
}

