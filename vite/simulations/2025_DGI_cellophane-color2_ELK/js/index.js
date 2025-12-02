// <変数の宣言>
let cmfTable, osTable;
let img, img2;
let polarizerSelect, // 偏光板の配置方法のselect要素
  opdInput, // 光路差のinput要素
  cellophaneAddButton, // セロハン追加のbutton要素
  cellophaneRemoveButton; // セロハン削除のbutton要素
let cmfRowNum; // 等色関数のデータ行数
let osRowNum; // 強度分布のデータ行数
let dRowNum; //光路差のデータ行数
let waveLengthArr; // 波長の配列
let xLambda, yLambda, zLambda; // XYZ等色関数の配列
let osArr, osArrOrigin; // 強度データの配列
let dArr; //光路差のデータの配列
let dTableOPP; //光路差のデータの配列OPP
let xArrAfter = [],
  yArrAfter = [],
  zArrAfter = []; // 一枚目の偏光板を透過したときのxyz要素
let xArrBefore = [],
  yArrBefore = [],
  zArrBefore = []; // 二枚目の偏光板を透過したときのxyz要素
let ls_xArrAfter = [],
  ls_yArrAfter = [],
  ls_zArrAfter = []; //明るさ調節の為の光源の強さに相当
let sum_ls_xArrAfter, sum_ls_yArrAfter, sum_ls_zArrAfter;
let cellophaneNum; // セロハンの枚数
let cellophaneArr = []; // セロハンのデータ配列
let rBefore = 0,
  gBefore = 0,
  bBefore = 0; // 一枚目の偏光板を透過したときのrgb要素
let rAfter = 0,
  gAfter = 0,
  bAfter = 0; // 二枚目の偏光板を透過したときのrgb要素
let rAfter1 = 0,
  gAfter1 = 0,
  bAfter1 = 0; // 二枚目の偏光板を透過したときのrgb要素(※ セロハン1枚のみ)
let rAfter2 = 0,
  gAfter2 = 0,
  bAfter2 = 0; // 二枚目の偏光板を透過したときのrgb要素(※ セロハン2枚以上)

//分離軸判定で使用した変数の追加 2024.6.14
let centerX, centerY; // 判定で用いる座標の中心点
let x1, x2, x3, x4, y1, y2, y3, y4; //判定するテープの4隅の点座標
let tape_angle_get;
let radius; //セロハンのサイズ(高さ)
let precolabNum;
let rAftera;
let gAftera;
let bAftera;
let slider;

//分割描画で新たに必要となった変数
let count2;
let lastValue;
let BisDead;
let CisDead;
let DrawisDead;
let Bcount;
let Bsize;
let Bdraw;
let drawT;
let drawSize;
let drawCount;
let tape_array;
let tape_arraySum;
let zz;
let last_otherCellophaneNums = [14]; //program上の組数の制限
let last_targetAngles = [14];
let last_opt = [14];
let last_polarizer;
let rotateTime = 0;
let calculate = 0;

//クラスター分類する際に新たに追加した変数
let clusters = 4;
let clusterColors = [];
let labels = [];
let edgePixels = [];
let n = 3;
let iterations = 3;
let dilationSize = 2;
let lastCluster;
let sliderCluster;
let copyimg; // imgをコピーした画像
let inputCluster;
let cmd;
let radio;
let clusterCount;
let clusterCount1;
let rAfterak;
let gAfterak;
let bAfterak;
let rotateInputV;
let Cluster1isDead;
let changeisDead;

// エッジ検出の際に, 検出の強度をコントロールする変数
let thresholds;
let lasthreshold;
let edgieSlider;

// 補助線の作成を判定するbox
let lineradio;

//HSV色空間での表示の為の変数
let hAfter1;
let sAfter1;
let vAfter1;
let hAfter2;
let sAfter2;
let vAfter2;
let hAfterak;
let sAfterak;
let vAfterak;
//HSV色空間の為の位置情報の獲得
let x_1;
let y_1;
let xdata = [];
let ydata = [];
//グラフの表示変更のためのid識別の変数
let graphParent;
// 強度を加味する為の変数
let rTable;
let Intensity_all; // ダウンロードした光源における光強度値を受け取る変数
let Intensity_all_box = []; // 光源の各波長の強度を受け取る配列
let Intensity_all_now;
let Intensity_slider;
let R_all = []; //補正データを受け取る配列
let R_os = [];

let K;
let spey;
let speyBox = [];
//複数の光路差-分散特性を考慮するためのボタン
let optRadio;
let currentValue;
let preValue;
//スライダー幅について
let currentSlider;
let lastSlider;

// screenshotButtonの設定
window.onload = function () {
  document.getElementById("screenshotButton").addEventListener("click", () => {
    html2canvas(document.body).then((canvas) => {
      downloadImage(canvas.toDataURL());
    });
  });
  function downloadImage(dataUrl) {
    const name = "screenshot.png";
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name;
    a.click();
  }
};

// p5Canvasという要素を親要素にする
function fullScreen() {
  let p5Canvas = document.getElementById("p5Canvas");
  let canvas = createCanvas(p5Canvas.clientWidth, p5Canvas.clientHeight, WEBGL);
  canvas.parent("p5Canvas");
}

// 外部ファイルの読み込み
function preload() {
  cmfTable = loadTable(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fcmf.csv?alt=media&token=df4cb716-5da8-4640-822e-5107acbdb916",
    "csv",
    "header"
  ); // 等色関数のデータ
  osTable = loadTable(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fos_PC2_new_6.18.csv?alt=media&token=0ba4f938-5669-456b-81dc-e4c62c66ce46",
    "csv",
    "header"
  ); // 偏光板を一枚通したときの波長毎の強度分布 PC-最新
  dTableOPP = loadTable(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100_film3.csv?alt=media&token=68edd450-dd93-4b8b-851f-28c1ffe14999.csv",
    "csv",
    "header"
  ); //光路差の分散特性(380nmで100に規格化)
  dTable = loadTable(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2Fdata_d_100.csv?alt=media&token=eaf5a4d5-ab04-42fd-8245-eb4896a5eaf5",
    "csv",
    "header"
  );
  rTable = loadTable(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fcsv%2Fcommon%2FR.csv?alt=media&token=203b2f68-a0c0-42c2-af5e-df5c240ea27d",
    "csv",
    "header"
  ); //偏光板2枚目による強度補正分のdata
  img = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2F2025%3DDGI%3Dcellophane-color2_ELK%2Fwhite.png?alt=media&token=038ee120-ec5e-4440-8130-3b764f11d25e"
  );
  img2 = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2F2025%3DDGI%3Dcellophane-color2_ELK%2FR.jpg?alt=media&token=9e82b742-fe5b-4332-af54-5796f92bd9ba"
  );
}

// DOM要素の生成
function elCreate() {
  polarizerSelect = select("#polarizerSelect");
  cellophaneAddButton = select("#cellophaneAddButton");
  cellophaneRemoveButton = select("#cellophaneRemoveButton");
}

// 追加ボタンを押したときの処理
function cellophaneAddButtonFunction() {
  colabNum += 1;
  cellophaneArr.push(new Cellophane(colabNum));
}

// 削除ボタンを押したときの処理
function cellophaneRemoveButtonFunction() {
  if (colabNum > 0) {
    let targetDiv = select("#cellophane-" + colabNum);
    cellophaneArr.pop(-1);
    targetDiv.remove();
    colabNum -= 1;
  }
}

// DOM要素の設定
function elInit() {
  cellophaneAddButton.mousePressed(cellophaneAddButtonFunction);
  cellophaneRemoveButton.mousePressed(cellophaneRemoveButtonFunction);
}

// 光源の強度値の算出
function intensity_max() {
  for (let i = 380; i <= 750; i++) {
    Intensity_all_box[i - 380] = osArrOrigin[i - 380];
  }
  Intensity_all = math.sum(Intensity_all_box);
  return Intensity_all;
}

function optChanged() {
  if (optRadio.value() == "セロハンテープ") {
    dArr = dTable.getColumn("d");
    dRowNum = dTable.getRowCount();
    preValue = optRadio.value();
  }
  if (optRadio.value() == "OPPフィルム") {
    dArr = dTableOPP.getColumn("d");
    dRowNum = dTableOPP.getRowCount();
    preValue = optRadio.value();
  }
}

// 初期値やシミュレーションの設定
function initValue() {
  // テーブルからそれぞれのデータを取得
  cmfRowNum = cmfTable.getRowCount();
  waveLengthArr = cmfTable.getColumn("wave-length");
  waveLengthArr = waveLengthArr.map((str) => parseInt(str, 10));
  xLambda = cmfTable.getColumn("x(lambda)");
  yLambda = cmfTable.getColumn("y(lambda)");
  zLambda = cmfTable.getColumn("z(lambda)");
  osRowNum = osTable.getRowCount();
  osArr = osTable.getColumn("optical-strength");
  osArrOrigin = osTable.getColumn("optical-strength");
  dArr = dTable.getColumn("d");
  dRowNum = dTable.getRowCount();
  R_all = rTable.getColumn("optical-strength");

  // xyzを格納する配列の初期化
  for (let i = 0; i < osRowNum; i++) {
    xArrAfter.push(0);
    yArrAfter.push(0);
    zArrAfter.push(0);
    xArrBefore.push(0);
    yArrBefore.push(0);
    zArrBefore.push(0);
    Intensity_all_box.push(0);
    R_os.push(0);
  }

  colabNum = 0;
  precolabNum = colabNum;
  cellophaneNum = 0;

  //分割計算する際に必要な配列
  for (let n = 1; n <= 15; n++) {
    last_otherCellophaneNums[n - 1] = 1;
    last_targetAngles[n - 1] = 1;
    last_opt[n - 1] = 1;
  }
  last_polarizer = polarizerSelect.value();
  // クラスター分類の際のsetup
  colorMode(RGB, 255, 255, 255);
  copyimg = img2.get();
  clusterCount = 0;
  clusterCount1 = 0;
  Cluster1isDead = false;
  changeisDead = false;
  document.getElementById("mainSpectrumGraphParent").style.display = "block"; //On
  document.getElementById("mainSpectrumGraphParent0").style.display = "none"; //OFf
}

// ★ setup関数
function setup() {
  fullScreen();
  elCreate();
  elInit();
  initValue();
  (rBefore, gBefore, (bBefore = beforeColorCalculate()));
  camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  createStartimg();
  createSliderandRadio();
}

// ★ draw関数
function draw() {
  currentValue = optRadio.value();
  radius = 111;
  prenormal();
  colabNum1_normal();
  colabNum2_normal();
  if (lineradio.value() === "補助線あり") {
    checked();
  } else {
  }
  (rAfter, gAfter, (bAfter = afterColorCalculate()));
  document.getElementById("mainSpectrumGraphParent0").style.display = "none";
  document.getElementById("mainSpectrumGraphParent").style.display = "block";
  // グラフの描画
  drawGraph();
  if (preValue !== currentValue) {
    optChanged();
    ellipse(0, 0, 50, 50);
  }
}

// checkboxによって実行される補助線の記述
function checked() {
  //基準線(0°)
  push();
  translate(0, 0, -60);
  stroke(255, 0, 0);
  line(0, 100, 0, -100);
  pop();
  for (let i = 0; i < colabNum; i++) {
    //colabNumが3の場合, 0,1,2 (1,2,3枚)
    let num = i + 1;
    let rotateInput = select("#rotateInput-" + num);
    push();
    rotateZ((rotateInput.value() * PI) / 180);
    stroke(0, 0, 0); //2024.6.14 透明度を50から20へ変更 (157, 204, 224, 0)
    push();
    translate(0, 0, -60);
    line(0, 100, 0, -100);
    pop();
    pop();
  }
}

//スライダーやラジオボタンを作成する処理
function createSliderandRadio() {
  slider = createSlider(10, 400, 75); //テープの幅を決定するslider
  slider.position(50, 100);
  lastSlider = slider.value();
  lineradio = createRadio();
  lineradio.option("補助線あり");
  lineradio.option("補助線なし");
  lineradio.selected("補助線なし");
  lineradio.position(400, 130);
  optRadio = createRadio();
  optRadio.option("セロハンテープ");
  optRadio.option("OPPフィルム");
  optRadio.position(400, 100);
  optRadio.selected("セロハンテープ");
  preValue = optRadio.value();
}

//normalにおける配列用意や画像の貼り付け, テープ幅の設定, 偏光板の表示など
function prenormal() {
  frameRate(60);
  tape_angle = new Array(colabNum).fill(0);
  tape_angle_cal = new Array(colabNum).fill(0); //配列の宣言(1枚目以降) 1,2,3,4,5..colabNum
  tape_number_cal = new Array(colabNum).fill(0);

  // テープ描画における条件設定(幅)
  angle_1 = atan2(100, slider.value());
  angle_2 = PI - atan2(100, slider.value());
  angle_3 = PI + atan2(100, slider.value());
  angle_4 = 2 * PI - atan2(100, slider.value());

  // 回転の設定
  //rotateTime += 0.5
  rotateY((180 * PI) / 180); //本来回転時はrotateY(rotateTime * PI / 180)
  // 背景色の設定
  background(rBefore, gBefore, bBefore);
  push();
  translate(-100, -100);
  image(img, 0, 0);
  pop();
  img.loadPixels;

  // 偏光板の描画
  createPolarizer(200, 0, 0, 0, 0);
  cellophaneNum = numInputFunction();
  if (polarizerSelect.value() == "平行ニコル配置")
    createPolarizer(200, 0, 0, -0.1 * cellophaneNum, 0);
  if (polarizerSelect.value() == "直交ニコル配置")
    createPolarizer(200, 0, 0, -0.1 * cellophaneNum, 1);
}

//"画像塗分け"における配列用意や画像の貼り付け, テープ幅の設定, 偏光板の表示など
function prefilledimage() {
  frameRate(60);
  tape_angle = new Array(colabNum).fill(0);
  tape_angle_cal = new Array(colabNum).fill(0); //配列の宣言(1枚目以降) 1,2,3,4,5..colabNum
  tape_number_cal = new Array(colabNum).fill(0);

  // edige検出の為の処理
  thresholds = edgieSlider.value();

  // テープ描画における条件設定(幅)
  angle_1 = atan2(100, slider.value());
  angle_2 = PI - atan2(100, slider.value());
  angle_3 = PI + atan2(100, slider.value());
  angle_4 = 2 * PI - atan2(100, slider.value());

  // 回転の設定
  rotateY((180 * PI) / 180);
  // 背景色の設定
  background(200);
  push();
  translate(-100, -100);
  image(img2, 0, 0, 200, 200); // 画質を良くするために200,200のサイズ宣言は必要.
  pop();
  //img2.loadPixels();

  // 偏光板の描画
  createPolarizer(200, 0, 0, 0, 0);
  cellophaneNum = numInputFunction();
  if (polarizerSelect.value() == "平行ニコル配置")
    createPolarizer(200, 0, 0, -0.1 * cellophaneNum, 0);
  if (polarizerSelect.value() == "直交ニコル配置")
    createPolarizer(200, 0, 0, -0.1 * cellophaneNum, 1);
}

// normalにおける, 組数1での色計算と配色の処理
function colabNum1_normal() {
  if (colabNum == 1) {
    let z = 0;
    let i = 0;
    let num = i + 1;
    let numInput = select("#numInput-" + num);
    let rotateInput = select("#rotateInput-" + num);
    createCellophane(numInput.value(), rotateInput.value(), z, angle_1);
    z += parseInt(numInput.value());
    //tape1枚のみに色を塗る
    (rAfter1, gAfter1, (bAfter1 = afterColorCalculate1()));
    drawTape_1(rAfter1, gAfter1, bAfter1, rotateInput.value());
    img.updatePixels();
  }
}

// "画像塗分けにおける, 組数1での色計算と配色の処理
function colabNum1_filledimage() {
  if (colabNum == 1) {
    frameRate(5);
    let check = 0;
    for (let n = 1; n <= colabNum; n++) {
      let numInputValue = parseInt(select("#numInput-" + n).value()); // 数値型に変換
      let rotateInputValue = parseFloat(select("#rotateInput-" + n).value()); // 数値型に変換
      let optInputValue = parseFloat(select("#opdInput-" + n).value()); // 数値型に変換
      let nowpolarizer = polarizerSelect.value();

      if (numInputValue !== last_otherCellophaneNums[n - 2]) {
        check++;
        last_otherCellophaneNums[n - 2] = numInputValue;
      }
      if (rotateInputValue !== last_targetAngles[n - 2]) {
        check++;
        last_targetAngles[n - 2] = rotateInputValue;
      }
      if (optInputValue !== last_opt[n - 2]) {
        check++;
        last_opt[n - 2] = optInputValue;
      }
      if (nowpolarizer !== last_polarizer) {
        check++;
        last_polarizer = nowpolarizer;
      }
    }
    //edigeSliderの値の変更を認識
    if (lasthreshold !== thresholds) {
      lasthreshold = thresholds;
      check++;
    }

    if (check >= 1) {
      Cluster1isDead = false;
    }
    let z = 0;
    let i = 0;
    let num = i + 1;
    let numInput = select("#numInput-" + num);
    let rotateInput = select("#rotateInput-" + num);
    createCellophane(numInput.value(), rotateInput.value(), z, angle_1);
    z += parseInt(numInput.value());

    if (!Cluster1isDead) {
      let z = 0;
      let i = 0;
      let num = i + 1;
      let numInput = select("#numInput-" + num);
      let rotateInput = select("#rotateInput-" + num);
      createCellophane(numInput.value(), rotateInput.value(), z, angle_1);
      z += parseInt(numInput.value());
      //tape1枚のみに色を塗る
      (rAfter1, gAfter1, (bAfter1 = afterColorCalculate1()));
      processClustering(rAfter1, gAfter1, bAfter1, thresholds);
      (hAfter1, sAfter1, (vAfter1 = rgbToHsv1(rAfter1, gAfter1, bAfter1)));
      Cluster1isDead = true;
    }
    // 位置情報の獲得
    x_1 = sAfter1 * Math.cos(hAfter1);
    y_1 = sAfter1 * Math.sin(hAfter1);
    //セロハン1枚のみにおけるグラフの表示(1点のみ)
    document.getElementById("mainSpectrumGraphParent").style.display = "none";
    document.getElementById("mainSpectrumGraphParent0").style.display = "block";
    drawGraph2_1(x_1, y_1);
  }
}

function processClustering(rAfter1a, gAfter1a, bAfter1a, thresholda) {
  //img2.resize(200,200);
  img2 = copyimg.get(); // 元の画像をコピー（変更を防ぐ）
  img2.loadPixels();
  applyMedianFilter(); // メディアンフィルタ適用
  detectEdges(thresholda);
  dilateEdges();
  smoothLabels();
  img2.loadPixels();
  for (let y = 0; y < img2.height; y++) {
    for (let x = 0; x < img2.width; x++) {
      let index = (x + y * img2.width) * 4;
      if (edgePixels[x + y * img2.width]) {
        img2.pixels[index] = 255;
        img2.pixels[index + 1] = 255;
        img2.pixels[index + 2] = 255;
      } else {
        img2.pixels[index] = rAfter1a;
        img2.pixels[index + 1] = gAfter1a;
        img2.pixels[index + 2] = bAfter1a;
      }
    }
  }
  img2.updatePixels();
}

// normalにおける, 組数2以上での色計算と配色の処理
function colabNum2_normal() {
  if (colabNum >= 2) {
    if (count2 === 0) {
      for (let i = 0; i < img.pixels.length; i += 4) {
        img.pixels[i] = 200;
        img.pixels[i + 1] = 200;
        img.pixels[i + 2] = 200;
        img.pixels[i + 3] = 255; //7.13までは80
      }
      img.updatePixels();
      count2 == 1;
    }

    //組数が変更された際に再度分割計算しなおすためのコマンド
    if (colabNum !== lastValue) {
      BisDead = false;
      CisDead = false;
      Bcount = 0;
      Bdraw = 0;
      DrawisDead = false;
      drawT = 0;
      drawCount = 0;
      lastValue = colabNum;
      calculate = 0;
    }
    currentSlider = slider.value();
    let check = 0;
    for (let n = 1; n <= colabNum; n++) {
      //1でなく2では..?
      let numInputValue = parseInt(select("#numInput-" + n).value()); // 数値型に変換
      let rotateInputValue = parseFloat(select("#rotateInput-" + n).value()); // 数値型に変換
      let optInputValue = parseFloat(select("#opdInput-" + n).value()); // 数値型に変換
      let nowpolarizer = polarizerSelect.value();
      if (numInputValue !== last_otherCellophaneNums[n - 2]) {
        check++;
        last_otherCellophaneNums[n - 2] = numInputValue;
      }
      if (rotateInputValue !== last_targetAngles[n - 2]) {
        check++;
        last_targetAngles[n - 2] = rotateInputValue;
      }
      if (optInputValue !== last_opt[n - 2]) {
        check++;
        last_opt[n - 2] = optInputValue;
      }
      if (nowpolarizer !== last_polarizer) {
        check++;
        last_polarizer = nowpolarizer;
      }
    }
    if (lastSlider !== currentSlider) {
      lastSlider = currentSlider;
      Cluster1isDead = false;
      BisDead = false;
      CisDead = false;
      Bcount = 0;
      Bdraw = 0;
      DrawisDead = false;
      drawT = 0;
      drawCount = 0;
      changeisDead = false;
    }
    if (check >= 1) {
      BisDead = false;
      CisDead = false;
      Bcount = 0;
      Bdraw = 0;
      DrawisDead = false;
      drawT = 0;
      drawCount = 0;
      calculate = 0;
    }

    //枚数や角度が変更された際に再度分割計算しなおすためのコマンド(取り敢えずボタン?) //上にfunction(key..の用意)

    if (!BisDead) {
      Bdraw++;
      if (Bcount == 0) {
        // rgbを格納する配列の初期化
        rAftera = new Array(Math.pow(2, colabNum)); //2024.6.17 colabNum修正 colabNum-1から
        gAftera = new Array(Math.pow(2, colabNum));
        bAftera = new Array(Math.pow(2, colabNum));
        Bcount += 1;
      }
      //if(colabNum<=15){
      //Bsize = Math.pow(colabNum,2);s
      push();
      fill(255, 0, 0, 10);
      ellipse(0, 0, frameRate() * 8, frameRate() * 8);
      pop();
      if (typeof Bsize === "undefined") {
        Bsize = 100;
      }
      if (frameRate() < 30) {
        Bsize = max(25, Bsize / 2); // フレームレートが低い場合、Bsizeを小さく
      } else {
        Bsize = min(1000, Bsize * 1.5); // フレームレートが高い場合、Bsizeを大きく
      }

      let start = (Bdraw - 1) * Bsize;
      let end = min(Math.pow(2, colabNum), start + Bsize);
      for (let i = start; i < end; i++) {
        //その枚数で生み出せる全ての色を生成(2角目以降)
        let binaryString = "";
        binaryString = i.toString(2).padStart(colabNum, "0"); // colabNum=2 //00,01,10,11
        (rAfter2,
          gAfter2,
          (bAfter2 = afterColorCalculates(
            binaryString,
            tape_angle_cal,
            tape_number_cal
          )));
        rAftera[i] = rAfter2;
        gAftera[i] = gAfter2;
        bAftera[i] = bAfter2;
      }
      if (end == Math.pow(2, colabNum)) {
        BisDead = true;
      }
    }

    if (BisDead == true) {
      if (!CisDead) {
        let z = 0;
        for (let i = 0; i < colabNum; i++) {
          //colabNumが3の場合, 0,1,2 (1,2,3枚)
          let num = i + 1;
          let numInput = select("#numInput-" + num);
          let rotateInput = select("#rotateInput-" + num);
          createCellophane(numInput.value(), rotateInput.value(), z, angle_1);
          z += parseInt(numInput.value());
          tape_angle[i] = rotateInput.value(); //テープの全角度を収納する
        }
        drawTapes(tape_angle, rAftera, gAftera, bAftera, DrawisDead);
        img.updatePixels();
      } else {
      }
    }
  }
}

// "画像塗分けにおける, 組数2以上での色計算と配色の処理
function colabNum2_filledimage() {
  if (colabNum !== lastCluster) {
    console.log("colabNum changed. Restarting function.");

    // **配列サイズを調整**
    if (last_otherCellophaneNums.length !== colabNum) {
      last_otherCellophaneNums = new Array(colabNum).fill(0);
    }
    if (last_targetAngles.length !== colabNum) {
      last_targetAngles = new Array(colabNum).fill(0);
    }

    clusterCount = 0; // 最初から再計算
    labels = []; // ラベルのリセット
    lastCluster = colabNum; // 最新の値を保存
    return colabNum2_filledimage(); // 関数を最初から呼び直す
  }

  if (colabNum >= 2) {
    if (clusterCount == 0) {
      lastCluster = colabNum;
      img2 = copyimg.get();
      //img2.resize(200,200); //追加
      img2.loadPixels();
      applyMedianFilter();

      let data = [];
      for (let i = 0; i < img2.pixels.length; i += 4) {
        let r = img2.pixels[i + 0];
        let g = img2.pixels[i + 1];
        let b = img2.pixels[i + 2];
        data.push([r, g, b]);
      }
      detectEdges(thresholds);
      dilateEdges();
      labels = kmeans(data, lastCluster); //2025.4.26 輪郭に色をつけるため, 画像のクラスター数を-1
      clusterCount = 1;
    }
    if (clusterCount == 1) {
      if (colabNum !== lastValue) {
        BisDead = false;
        CisDead = false;
        Bcount = 0;
        Bdraw = 0;
        DrawisDead = false;
        drawT = 0;
        drawCount = 0;
        lastValue = colabNum;
        calculate = 0;
      }

      let check = false; // 変更があったかどうかを判定するためのフラグ
      for (let n = 0; n < colabNum; n++) {
        // 0 から colabNum-1 に修正
        let numInputValue2 = parseInt(select("#numInput-" + (n + 1)).value()); // 数値型に変換
        let rotateInputValue2 = parseFloat(
          select("#rotateInput-" + (n + 1)).value()
        ); // 数値型に変換

        if (numInputValue2 !== last_otherCellophaneNums[n]) {
          last_otherCellophaneNums[n] = numInputValue2;
          check = true;
        }
        if (rotateInputValue2 !== last_targetAngles[n]) {
          last_targetAngles[n] = rotateInputValue2;
          check = true;
        }
      }
      if (check) {
        // 変更があった場合にのみリセット
        BisDead = false;
        CisDead = false;
        Bcount = 0;
        Bdraw = 0;
        DrawisDead = false;
        drawT = 0;
        drawCount = 0;
        calculate = 0;
      }

      let z = 0;
      for (let i = 0; i < colabNum; i++) {
        //colabNumが3の場合, 0,1,2 (1,2,3枚)
        let num = i + 1;
        let numInput = select("#numInput-" + num);
        let rotateInput = select("#rotateInput-" + num);
        createCellophane(numInput.value(), rotateInput.value(), z, angle_1);
        z += parseInt(numInput.value());
      }

      //枚数や角度が変更された際に再度分割計算しなおすためのコマンド(取り敢えずボタン?) //上にfunction(key..の用意)

      if (!BisDead) {
        Bdraw++;
        if (Bcount == 0) {
          // rgbを格納する配列の初期化
          rAfterak = new Array(colabNum).fill(0);
          gAfterak = new Array(colabNum).fill(0);
          bAfterak = new Array(colabNum).fill(0);
          /// hsvを格納する配列の初期化
          hAfterak = new Array(colabNum).fill(0);
          sAfterak = new Array(colabNum).fill(0);
          vAfterak = new Array(colabNum).fill(0);
          /// xyを格納する配列の初期化
          xdata = new Array(colabNum).fill(0);
          ydata = new Array(colabNum).fill(0);
          Bcount += 1;
        }

        push();
        fill(255, 0, 0);
        ellipse(0, 0, frameRate() * 8, frameRate() * 8);
        pop();

        for (let i = 1; i <= colabNum; i++) {
          //その枚数で生み出せる全ての色を生成(2角目以降)
          let binaryString = "";
          if (i == 1) {
            binaryString = (0).toString(2).padStart(colabNum, "0");
            (rAfter2,
              gAfter2,
              (bAfter2 = afterColorCalculates(
                binaryString,
                tape_angle_cal,
                tape_number_cal
              )));
            (hAfter2,
              sAfter2,
              (vAfter2 = rgbToHsv2(rAfter2, gAfter2, bAfter2)));
            rAfterak[i - 1] = rAfter2;
            gAfterak[i - 1] = gAfter2;
            bAfterak[i - 1] = bAfter2;
            hAfterak[i - 1] = hAfter2;
            sAfterak[i - 1] = sAfter2;
            vAfterak[i - 1] = vAfter2;
          } else {
            binaryString = (Math.pow(2, i - 1) - 1)
              .toString(2)
              .padStart(colabNum, "0");
            (rAfter2,
              gAfter2,
              (bAfter2 = afterColorCalculates(
                binaryString,
                tape_angle_cal,
                tape_number_cal
              )));
            (hAfter2,
              sAfter2,
              (vAfter2 = rgbToHsv2(rAfter2, gAfter2, bAfter2)));
            rAfterak[i - 1] = rAfter2;
            gAfterak[i - 1] = gAfter2;
            bAfterak[i - 1] = bAfter2;
            hAfterak[i - 1] = hAfter2;
            sAfterak[i - 1] = sAfter2;
            vAfterak[i - 1] = vAfter2;
          }
        }
        BisDead = true;
        push();
        fill(0, 255, 0);
        ellipse(0, 0, frameRate() * 8, frameRate() * 8);
        pop();
      }
      if (BisDead == true) {
        if (!CisDead) {
          smoothLabels();
          img2.loadPixels();
          for (let y = 0; y < img2.height; y++) {
            for (let x = 0; x < img2.width; x++) {
              let index = (x + y * img2.width) * 4;
              if (edgePixels[x + y * img2.width]) {
                img2.pixels[index] = 255; //2025.4.26 輪郭を最大枚数の際の色で塗るように変更.
                img2.pixels[index + 1] = 255;
                img2.pixels[index + 2] = 255;
              } else {
                let clusterIndex = labels[x + y * img2.width];
                img2.pixels[index] = rAfterak[clusterIndex]; //2025.4.26 clucterIntexは[0~k-2],要素として[1~k-1]
                img2.pixels[index + 1] = gAfterak[clusterIndex];
                img2.pixels[index + 2] = bAfterak[clusterIndex];
              }
            }
          }
          img2.updatePixels();
          CisDead = true;
        } else {
          //hsv情報を位置情報へ変換
          for (let i = 0; i < colabNum; i++) {
            xdata[i] = sAfterak[i] * Math.cos(hAfterak[i]);
            ydata[i] = sAfterak[i] * Math.sin(hAfterak[i]);
          }
          document.getElementById("mainSpectrumGraphParent").style.display =
            "none";
          document.getElementById("mainSpectrumGraphParent0").style.display =
            "block";
          //グラフの描画
          drawGraph2();
        }
      }
    }

    // 色と組数の関係を識別する為の表の作成
    for (let i = 0; i < colabNum; i++) {
      //background(255);
      let r = rAfterak[i];
      let g = gAfterak[i];
      let b = bAfterak[i];
      push();
      stroke(0);
      translate(0, 0, -50);
      strokeWeight(2);
      fill(r, g, b);
      rect(-100, 80 - 20 * i, 10, 10);
      pop();
    }
  }
}

function colorRect() {
  for (let i = 0; i < colabNum; i++) {
    let size = 50;
    let r = 50; //rAfterak[i]
    let g = 40; // gAfterak[i]
    let b = 0; //bAfterak[i]
    push();
    fill(r, g, b);
    rect(150 + i * size, 150, size, (size / 3) * 2);
    pop();
  }
}

//白画像を定位置に配置し, pixelsの色を初期値にする処理. 入力画像のサイズを設定する処理
function createStartimg() {
  img.resize(200, 200);
  centerX = 100;
  centerY = 100;
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i] = 200;
    img.pixels[i + 1] = 200;
    img.pixels[i + 2] = 200;
    img.pixels[i + 3] = 255; // 7.13までは80
  }
  img.updatePixels();
  //img2.resize(200, 200); このresizeが原因で画質が粗くなってしまっている
}

// 偏光板を描画する処理
function createPolarizer(size, x, y, z, pattern) {
  push();
  translate(x, y, z);
  noFill();
  strokeWeight(0.1);
  stroke(0, 200);
  box(size, size, 0);
  if (pattern == 0) {
    for (let i = 0; i < size; i += 5) {
      line(-size / 2 + i, size / 2, 0, -size / 2 + i, -size / 2, 0);
    }
  } else {
    for (let i = 0; i < size; i += 5) {
      line(-size / 2, -size / 2 + i, 0, size / 2, -size / 2 + i, 0);
    }
  }
  pop();
}

// セロハンを描画する処理
function createCellophane(n, rAfter, a, angle_1) {
  // noStroke()
  push();
  rotateZ((rAfter * PI) / 180);
  fill(255, 255, 255, 0); //2024.6.14 透明度を50から20へ変更 (157, 204, 224, 0)
  for (let i = 0; i < n; i++) {
    push();
    translate(-0, 0, -0.1 * (i + a));
    box(2 * radius * cos(angle_1), 2 * radius * sin(angle_1), 0.1);
    pop();
  }
  pop();
}

// 回転行列R(theta)
function r_theta(theta) {
  return [
    [cos(theta), -sin(theta)],
    [sin(theta), cos(theta)],
  ];
}

// 回転行列R(-theta)
function mai_r_theta(theta) {
  return [
    [cos(theta), sin(theta)],
    [-sin(theta), cos(theta)],
  ];
}

// ジョーンズマトリクス
function jhons(theta) {
  return [
    [sin(theta) ** 2, -sin(theta) * cos(theta)],
    [-sin(theta) * cos(theta), cos(theta) ** 2],
  ];
}

// RGBへの変換
function toRGB(a) {
  if (a <= 0.0031308) {
    a = 12.92 * a;
  } else {
    a = 1.055 * Math.pow(a, 1 / 2.4) - 0.055;
  }
  // 0〜1にクリップ
  a = Math.max(0, Math.min(1, a));
  return Math.round(a * 255);
}

// セロハンの総数の数え上げをする処理
function numInputFunction() {
  cellophaneNum = 0;
  for (let i = 0; i < colabNum; i++) {
    let num = i + 1;
    let numInput = select("#numInput-" + num);
    cellophaneNum += int(numInput.value());
  }
  return cellophaneNum;
}

// 偏光板１枚を透過したときの色の計算
function beforeColorCalculate() {
  // XYZ刺激値への変換（等色関数×スペクトル）
  for (let i = 380; i <= 750; i++) {
    xArrBefore[i - 380] =
      R_all[i - 380] * osArrOrigin[i - 380] * xLambda[i - 380];
    yArrBefore[i - 380] =
      R_all[i - 380] * osArrOrigin[i - 380] * yLambda[i - 380];
    zArrBefore[i - 380] =
      R_all[i - 380] * osArrOrigin[i - 380] * zLambda[i - 380];
    R_os[i - 380] = R_all[i - 380] * osArrOrigin[i - 380];
  }
  Intensity_all_now = math.sum(R_os);
  for (let i = 380; i <= 750; i++) {
    speyBox[i - 380] = osArrOrigin[i - 380] * yLambda[i - 380] * R_all[i - 380];
  }
  spey = math.sum(speyBox);
  K = 1.0 / spey; //0.5
  // RGBへの変換
  xSumBefore = math.sum(xArrBefore) * K;
  ySumBefore = math.sum(yArrBefore) * K;
  zSumBefore = math.sum(zArrBefore) * K;
  tosRGB = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758, 0.0415],
    [0.0557, -0.204, 1.057],
  ];
  rgbBefore = math.multiply(tosRGB, [xSumBefore, ySumBefore, zSumBefore]);
  rBefore = toRGB(rgbBefore[0]);
  gBefore = toRGB(rgbBefore[1]);
  bBefore = toRGB(rgbBefore[2]);
  // 要素へのRGBの反映
  let beforeColor = select("#beforeColor");
  beforeColor.style(
    "background-color:rgb(" +
      str(rBefore) +
      "," +
      str(gBefore) +
      "," +
      str(bBefore) +
      ")"
  );
  return (rBefore, gBefore, bBefore);
}

// セロハン及び二枚目の偏光板を透過した時の処理
function afterColorCalculate() {
  // セロハンの組数が１枚以上ある場合
  if (colabNum >= 1) {
    let ls_xArrAfter = [];
    let ls_yArrAfter = [];
    let ls_zArrAfter = [];

    // 計算には１組目のセロハンを基準とした相対角度を使う
    let referenceAngle = select("#rotateInput-1");
    let a = radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    let firstCellophaneNum = select("#numInput-1"); // セロハン１組目の枚数
    let firstopdInput = select("#opdInput-1"); // セロハン1組目の光路差
    E_1 = [[-sin(a)], [cos(a)]];

    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let delta =
        (dArr[i - 380] *
          firstCellophaneNum.value() *
          2 *
          firstopdInput.value() *
          PI) /
        l /
        100;
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      E_2 = math.multiply(cello, E_1);

      // セロハンの組数が2組以上の場合、それぞれのセロハンに関する計算を再帰的に行う
      if (colabNum >= 2) {
        for (let n = 2; n <= colabNum; n++) {
          let otherCellophaneNum = select("#numInput-" + n);
          let otheropdInput = select("#opdInput-" + n);
          let delta =
            (dArr[i - 380] *
              otherCellophaneNum.value() *
              2 *
              otheropdInput.value() *
              PI) /
            l /
            100;
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = select("#rotateInput-" + n);
          let b = radians(targetAngle.value() - referenceAngle.value());
          E_2 = math.multiply(
            r_theta(b),
            math.multiply(cello, math.multiply(mai_r_theta(b), E_2))
          );
        }
      }

      let c;
      if (polarizerSelect.value() == "平行ニコル配置") {
        c = radians(-referenceAngle.value());
      } else if (polarizerSelect.value() == "直交ニコル配置") {
        c = radians(-referenceAngle.value()) - radians(90);
      }

      E_3 = math.multiply(jhons(c), E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      osArr[i - 380] = relativeStrength * osArrOrigin[i - 380] * R_all[i - 380];
      xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380];
      yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380];
      zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      ls_xArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * xLambda[i - 380];
      ls_yArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * yLambda[i - 380];
      ls_zArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * zLambda[i - 380];
    }
    Intensity_all_now = math.sum(osArr);
    let sum_ls_xArrAfter = math.sum(ls_xArrAfter);
    let sum_ls_yArrAfter = math.sum(ls_yArrAfter);
    let sum_ls_zArrAfter = math.sum(ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      speyBox[i - 380] =
        osArrOrigin[i - 380] * yLambda[i - 380] * R_all[i - 380];
    }
    spey = math.sum(speyBox);
    K = 1.0 / spey;
    xSumAfter = math.sum(xArrAfter) * K;
    ySumAfter = math.sum(yArrAfter) * K;
    zSumAfter = math.sum(zArrAfter) * K;
    tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    rAfter = toRGB(sRGB[0]);
    gAfter = toRGB(sRGB[1]);
    bAfter = toRGB(sRGB[2]);
    let ratio;
    if (rAfter >= gAfter && rAfter >= bAfter) {
      ratio = xSumAfter / sum_ls_xArrAfter;
    } else if (gAfter >= rAfter && gAfter >= bAfter) {
      ratio = ySumAfter / sum_ls_yArrAfter;
    } else if (bAfter >= rAfter && bAfter >= gAfter) {
      ratio = zSumAfter / sum_ls_zArrAfter;
    }
    //rAfter *=ratio
    //gAfter *=ratio
    //bAfter *=ratio
  }
  // セロハンの組が0組の場合
  else {
    if (polarizerSelect.value() == "平行ニコル配置") {
      rAfter = rBefore;
      gAfter = gBefore;
      bAfter = bBefore;
    } else if (polarizerSelect.value() == "直交ニコル配置") {
      rAfter = 0;
      gAfter = 0;
      bAfter = 0;
      for (let i = 380; i <= 750; i++) {
        osArr[i - 380] = 0;
      }
    }
  }

  // 色を要素に反映
  let afterColor = select("#afterColor");
  afterColor.style(
    "background-color:rgb(" +
      str(rAfter) +
      "," +
      str(gAfter) +
      "," +
      str(bAfter) +
      ")"
  );
  return (rAfter, gAfter, bAfter);
}

// セロハン及び二枚目の偏光板を透過した時の処理(セロハン1枚のみ)
function afterColorCalculate1() {
  // セロハンの組数が１枚以上ある場合
  if (colabNum >= 1) {
    // 計算には１組目のセロハンを基準とした相対角度を使う
    let referenceAngle = select("#rotateInput-1");
    let a = radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    let firstCellophaneNum = select("#numInput-1"); // セロハン１組目の枚数
    let firstopdInput = select("#opdInput-1"); // セロハン1組目の光路差
    E_1 = [[-sin(a)], [cos(a)]];

    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let delta =
        (dArr[i - 380] *
          firstCellophaneNum.value() *
          2 *
          firstopdInput.value() *
          PI) /
        l /
        100;
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      E_2 = math.multiply(cello, E_1);
      if (polarizerSelect.value() == "平行ニコル配置") {
        c = radians(-referenceAngle.value());
      } else if (polarizerSelect.value() == "直交ニコル配置") {
        c = radians(-referenceAngle.value()) - radians(90);
      }

      E_3 = math.multiply(jhons(c), E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      osArr[i - 380] = relativeStrength * osArrOrigin[i - 380] * R_all[i - 380];
      xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380];
      yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380];
      zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      ls_xArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * xLambda[i - 380];
      ls_yArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * yLambda[i - 380];
      ls_zArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * zLambda[i - 380];
    }
    Intensity_all_now = math.sum(osArr);
    sum_ls_xArrAfter = math.sum(ls_xArrAfter);
    sum_ls_yArrAfter = math.sum(ls_yArrAfter);
    sum_ls_zArrAfter = math.sum(ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      speyBox[i - 380] =
        osArrOrigin[i - 380] * yLambda[i - 380] * R_all[i - 380];
    }
    spey = math.sum(speyBox);
    K = 1.0 / spey;
    xSumAfter = math.sum(xArrAfter) * K;
    ySumAfter = math.sum(yArrAfter) * K;
    zSumAfter = math.sum(zArrAfter) * K;
    tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    rAfter1 = toRGB(sRGB[0]);
    gAfter1 = toRGB(sRGB[1]);
    bAfter1 = toRGB(sRGB[2]);
    let ratio;
    if (rAfter2 >= gAfter2 && rAfter2 >= bAfter2) {
      ratio = xSumAfter ** (1 / 2.4) / sum_ls_xArrAfter ** (1 / 2.4);
    } else if (gAfter2 >= rAfter2 && gAfter2 >= bAfter2) {
      ratio = ySumAfter ** (1 / 2.4) / sum_ls_yArrAfter ** (1 / 2.4);
    } else if (bAfter2 >= rAfter2 && bAfter2 >= gAfter2) {
      ratio = zSumAfter ** (1 / 2.4) / sum_ls_zArrAfter ** (1 / 2.4);
    }
  }

  // セロハンの組が0組の場合
  else {
    if (polarizerSelect.value() == "平行ニコル配置") {
      rAfter1 = rBefore;
      gAfter1 = gBefore;
      bAfter1 = bBefore;
    } else if (polarizerSelect.value() == "直交ニコル配置") {
      rAfter1 = 0;
      gAfter1 = 0;
      bAfter1 = 0;
      for (let i = 380; i <= 750; i++) {
        osArr[i - 380] = 0;
      }
    }
  }

  //色を要素に反映
  //let afterColor = select("#afterColor")
  //afterColor.style("background-color:rgb(" + str(rAfter1) + "," + str(gAfter1) + "," + str(bAfter1) + ")")
  return (rAfter1, gAfter1, bAfter1);
}

// セロハン及び二枚目の偏光板を透過した時の処理
function afterColorCalculates(binaryString) {
  let bi = 0;
  let tape_sum = 0;
  let numStart = 0;
  let firstCellophaneNum;
  let referenceAngle;
  let a;
  let bit = new Array(binaryString.length).fill(0); //配列の宣言-バイナリの要素を指定する配列
  for (let j = 0; j < binaryString.length; j++) {
    bit[j] = parseInt(binaryString[j], 10);
    if (bit[j] == 0) {
      tape_sum += 1;
    }
  }

  if (bit[0] == 0) {
    //colabNum2: 00,01
    // 計算には１組目のセロハンを基準とした相対角度を使う
    referenceAngle = select("#rotateInput-1");
    a = radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    firstCellophaneNum = select("#numInput-1"); // セロハン１組目の枚数
    E_1 = [[-sin(a)], [cos(a)]];
    numStart = 1;
  } else {
    //colabNum:10,11
    for (let j = 0; j < binaryString.length - 1; j++) {
      //10等の小さい数でも探索できるように，0から探索開始 2024.6.21
      if (bit[j] == 0) {
        numStart = j; //10について, 1
        bi = 1;
        break;
      }
    }
    if (bi == 0) {
      //全て1であった場合
      if (bit[binaryString.length - 1] == 0) {
        numStart = binaryString.length - 1;
      } else {
        numStart = 0;
      }
    }
    if (numStart != 0) {
      let numS = numStart + 1;
      referenceAngle = select("#rotateInput-" + numS);
      a = radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
      firstCellophaneNum = select("#numInput-" + numS); // セロハン１組目の枚数
      E_1 = [[-sin(a)], [cos(a)]];
    }
  }

  if (numStart !== 0) {
    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let firstopdInput = select("#opdInput-1"); // セロハン1組目の光路差
      let delta =
        (dArr[i - 380] *
          firstCellophaneNum.value() *
          2 *
          firstopdInput.value() *
          PI) /
        l /
        100; //2024.6.22 firstCellophaneの値をvalueで数値化しないとだめだった!
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      E_2 = math.multiply(cello, E_1);

      if (bit[0] == 0) {
        for (let j = 1; j < colabNum; j++) {
          //2角組目以降..
          let n = j + 1;
          let otherCellophaneNum = select("#numInput-" + n);
          let otheropdInput = select("#opdInput-" + n);
          let delta =
            (dArr[i - 380] *
              otherCellophaneNum.value() *
              2 *
              otheropdInput.value() *
              PI) /
            l /
            100;
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = select("#rotateInput-" + n);
          let b = radians(targetAngle.value() - referenceAngle.value());
          if (bit[j] == 0) {
            E_2 = math.multiply(
              r_theta(b),
              math.multiply(cello, math.multiply(mai_r_theta(b), E_2))
            );
          } else {
            E_2 = E_2;
          }
        }
      } else if (tape_sum > 1) {
        for (let k = numStart + 1; k < binaryString.length; k++) {
          //2024.6.19 n=numStartから+1?
          let num = k + 1;
          let otherCellophaneNum = select("#numInput-" + num);
          let otheropdInput = select("#opdInput-" + num);
          let delta =
            (dArr[i - 380] *
              otherCellophaneNum.value() *
              2 *
              otheropdInput.value() *
              PI) /
            l /
            100;
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = select("#rotateInput-" + num);
          let b = radians(targetAngle.value() - referenceAngle.value()); //2024.6.21 いや,こっちでダメ?!
          if (bit[k] == 0) {
            E_2 = math.multiply(
              r_theta(b),
              math.multiply(cello, math.multiply(mai_r_theta(b), E_2))
            ); //2024.6.21 ここでバグが生じる
          } else {
            E_2 = E_2;
          }
        }
      }

      let c;
      if (polarizerSelect.value() == "平行ニコル配置") {
        c = radians(-referenceAngle.value());
      } else if (polarizerSelect.value() == "直交ニコル配置") {
        c = radians(-referenceAngle.value()) - radians(90);
      }

      E_3 = math.multiply(jhons(c), E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      osArr[i - 380] = relativeStrength * osArrOrigin[i - 380] * R_all[i - 380];
      xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380];
      yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380];
      zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      ls_xArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * xLambda[i - 380];
      ls_yArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * yLambda[i - 380];
      ls_zArrAfter[i - 380] =
        osArrOrigin[i - 380] * R_all[i - 380] * zLambda[i - 380];
    }
    Intensity_all_now = math.sum(osArr);
    sum_ls_xArrAfter = math.sum(ls_xArrAfter);
    sum_ls_yArrAfter = math.sum(ls_yArrAfter);
    sum_ls_zArrAfter = math.sum(ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      speyBox[i - 380] =
        osArrOrigin[i - 380] * yLambda[i - 380] * R_all[i - 380];
    }
    spey = math.sum(speyBox);
    K = 1.0 / spey;
    xSumAfter = math.sum(xArrAfter) * K;
    ySumAfter = math.sum(yArrAfter) * K;
    zSumAfter = math.sum(zArrAfter) * K;
    tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    rAfter2 = toRGB(sRGB[0]);
    gAfter2 = toRGB(sRGB[1]);
    bAfter2 = toRGB(sRGB[2]);
    let ratio;
    if (rAfter2 >= gAfter2 && rAfter2 >= bAfter2) {
      ratio = xSumAfter ** (1 / 2.4) / sum_ls_xArrAfter ** (1 / 2.4);
    } else if (gAfter2 >= rAfter2 && gAfter2 >= bAfter2) {
      ratio = ySumAfter ** (1 / 2.4) / sum_ls_yArrAfter ** (1 / 2.4);
    } else if (bAfter2 >= rAfter2 && bAfter2 >= gAfter2) {
      ratio = zSumAfter ** (1 / 2.4) / sum_ls_zArrAfter ** (1 / 2.4);
    }
    //rAfter2 *=ratio
    //gAfter2 *=ratio
    //bAfter2 *=ratio
  } else {
    if (polarizerSelect.value() == "平行ニコル配置") {
      rAfter2 = 200;
      gAfter2 = 200;
      bAfter2 = 200;
    } else if (polarizerSelect.value() == "直交ニコル配置") {
      rAfter2 = 0;
      gAfter2 = 0;
      bAfter2 = 0;
    }
  }

  // 色を要素に反映
  //let afterColor = select("#afterColor")
  //afterColor.style("background-color:rgb(" + str(rAfter) + "," + str(gAfter) + "," + str(bAfter) + ")")
  return (rAfter2, gAfter2, bAfter2);

  //rAfter2 = 255-50*tape_sum
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    Cluster1isDead = false;
    BisDead = false;
    CisDead = false;
    Bcount = 0;
    Bdraw = 0;
    DrawisDead = false;
    drawT = 0;
    drawCount = 0;
    changeisDead = false;
  }
}

// tape1枚目のみに色を塗る
function drawTape_1(rAfter1, gAfter1, bAfter1, rotateInput) {
  tape_angle_get = ((rotateInput - 90) * PI) / 180;
  getrectPoint(tape_angle_get);
  for (let i = 0; i < img.pixels.length; i += 4) {
    if (checkA(i / 4)) {
      img.pixels[i + 0] = rAfter1;
      img.pixels[i + 1] = gAfter1;
      img.pixels[i + 2] = bAfter1;
    } else {
      if (polarizerSelect.value() == "平行ニコル配置") {
        img.pixels[i + 0] = 200;
        img.pixels[i + 1] = 200;
        img.pixels[i + 2] = 200;
      } else if (polarizerSelect.value() == "直交ニコル配置") {
        img.pixels[i + 0] = 0;
        img.pixels[i + 1] = 0;
        img.pixels[i + 2] = 0;
      }
    }
  }
}

//tapeが2枚以上ある場合における，色の塗りつぶし
function drawTapes(tape_angle, rAftera, gAftera, bAftera, DrawisDead) {
  if (!DrawisDead) {
    drawT++;
    if (drawCount == 0) {
      tape_array = new Array(img.pixels.length / 4).fill("");
      tape_arraySum = new Array(img.pixels.length / 4).fill("");
      drawCount++;
    }
    drawSize = floor(img.height / colabNum);
    let startYT = (drawT - 1) * drawSize;
    let endYT = min(img.height, startYT + drawSize);
    img.loadPixels();
    for (let t = 0; t < colabNum; t++) {
      //colabNumが3の場合 t=0,1,2
      tape_angle_get = ((tape_angle[t] - 90) * PI) / 180;
      getrectPoint(tape_angle_get);

      for (let i = startYT * img.width; i < endYT * img.width; i++) {
        if (checkA(i)) {
          tape_array[i] = "0";
        } else {
          tape_array[i] = "1";
        }
        tape_arraySum[i] += tape_array[i];
      }
    }

    for (let i = startYT * img.width; i < endYT * img.width; i++) {
      zz = parseInt(tape_arraySum[i], 2); //"0"又は"1"からなるバイナリ数を数字化
      let index = i * 4;
      img.pixels[index] = rAftera[zz];
      img.pixels[index + 1] = gAftera[zz];
      img.pixels[index + 2] = bAftera[zz];
    }
    if (drawT >= colabNum) {
      DrawisDead = true;
    }
    img.updatePixels();
  } else {
    CisDead = true;
  }
}

// ある角度におけるテープの4隅の点の情報を入手
function getrectPoint(tape_angle) {
  push();
  translate(-100, -100);
  let sinValues = [
    sin(angle_1 + tape_angle - PI / 2),
    sin(angle_2 + tape_angle - PI / 2),
    sin(angle_3 + tape_angle - PI / 2),
    sin(angle_4 + tape_angle - PI / 2),
  ];
  let cosValues = [
    cos(angle_1 + tape_angle - PI / 2),
    cos(angle_2 + tape_angle - PI / 2),
    cos(angle_3 + tape_angle - PI / 2),
    cos(angle_4 + tape_angle - PI / 2),
  ];

  x1 = centerX + cosValues[0] * radius;
  y1 = centerY + sinValues[0] * radius;
  x2 = centerX + cosValues[1] * radius;
  y2 = centerY + sinValues[1] * radius;
  x3 = centerX + cosValues[2] * radius;
  y3 = centerY + sinValues[2] * radius;
  x4 = centerX + cosValues[3] * radius;
  y4 = centerY + sinValues[3] * radius;

  push();
  fill(255, 0, 0);
  //ellipse(x1, y1, 10, 10);
  //ellipse(x2, y2, 10, 10);
  //ellipse(x3, y3, 10, 10);
  //ellipse(x4, y4, 10, 10);
  pop();
  line(x1, y1, x2, y2);
  line(x2, y2, x3, y3);
  line(x3, y3, x4, y4);
  line(x4, y4, x1, y1);
  pop();
}

//そのピクセルが，tapeの内部にあるために変更を求められるかを判定
function checkA(i) {
  let x = i % img.width;
  let y = (i - x) / img.width;
  let P0 = { x: x, y: y };
  let P1 = { x: x1, y: y1 };
  let P2 = { x: x2, y: y2 };
  let P3 = { x: x3, y: y3 };
  let P4 = { x: x4, y: y4 };

  let c1 = crossProduct(P0, P1, P2);
  let c2 = crossProduct(P0, P2, P3);
  let c3 = crossProduct(P0, P3, P4);
  let c4 = crossProduct(P0, P4, P1);

  return (
    (c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0) ||
    (c1 < 0 && c2 < 0 && c3 < 0 && c4 < 0)
  );
}

//tape内部にあることを判定する外積計算S
function crossProduct(P, A, B) {
  let AB = { x: B.x - A.x, y: B.y - A.y };
  let AP = { x: P.x - A.x, y: P.y - A.y };
  return AB.x * AP.y - AB.y * AP.x;
}

function applyMedianFilter() {
  img2.loadPixels();
  let newPixels = [...img2.pixels];
  //[...img2.pixels];
  for (let y = 1; y < img2.height - 1; y++) {
    for (let x = 1; x < img2.width - 1; x++) {
      let index = (x + y * img2.width) * 4;
      let neighbors = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let nIndex = (x + dx + (y + dy) * img2.width) * 4;
          neighbors.push(img2.pixels[nIndex]);
        }
      }
      neighbors.sort((a, b) => a - b);
      newPixels[index] = neighbors[4];
      newPixels[index + 1] = neighbors[4];
      newPixels[index + 2] = neighbors[4];
    }
  }
  img2.pixels = newPixels;
  img2.updatePixels();
}

function detectEdges(thresholda) {
  edgePixels = new Array(img2.width * img2.height).fill(false);
  let threshold = thresholda;

  for (let y = 1; y < img2.height - 1; y++) {
    for (let x = 1; x < img2.width - 1; x++) {
      let index = (x + y * img2.width) * 4;
      let sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      let sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
      let gx = 0,
        gy = 0,
        i = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          let nx = x + dx;
          let ny = y + dy;
          let nIndex = (nx + ny * img2.width) * 4;
          let intensity =
            (img2.pixels[nIndex] +
              img2.pixels[nIndex + 1] +
              img2.pixels[nIndex + 2]) /
            3;
          gx += intensity * sobelX[i];
          gy += intensity * sobelY[i];
          i++;
        }
      }
      let magnitude = sqrt(gx * gx + gy * gy);
      if (magnitude > threshold) {
        edgePixels[x + y * img2.width] = true;
      }
    }
  }
}

function dilateEdges() {
  let newEdgePixels = [...edgePixels];
  for (let y = dilationSize; y < img2.height - dilationSize; y++) {
    for (let x = dilationSize; x < img2.width - dilationSize; x++) {
      let index = x + y * img2.width;
      if (!edgePixels[index]) {
        for (let dy = -dilationSize; dy <= dilationSize; dy++) {
          for (let dx = -dilationSize; dx <= dilationSize; dx++) {
            let nIndex = x + dx + (y + dy) * img2.width;
            if (edgePixels[nIndex]) {
              newEdgePixels[index] = true;
            }
          }
        }
      }
    }
  }
  edgePixels = newEdgePixels;
}

function kmeans(data, k) {
  let centroids = [];

  // **k-means++ の初期化**
  centroids.push(data[floor(random(data.length))]); // 最初のクラスタ中心をランダムに1つ選択

  for (let i = 1; i < k; i++) {
    let distances = data.map((point) =>
      Math.min(...centroids.map((c) => distSq(point, c)))
    );
    let sumDist = distances.reduce((a, b) => a + b, 0);
    let r = random(sumDist);
    let acc = 0;
    for (let j = 0; j < distances.length; j++) {
      acc += distances[j];
      if (acc >= r) {
        centroids.push(data[j]);
        break;
      }
    }
  }

  let labels = new Array(data.length).fill(0);
  let changed = true;

  while (changed) {
    changed = false;

    // **各データ点を最近のクラスタに割り当てる**
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity,
        label = 0;
      for (let j = 0; j < k; j++) {
        let dist = distSq(data[i], centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          label = j;
        }
      }
      if (labels[i] !== label) {
        labels[i] = label;
        changed = true;
      }
    }

    // **クラスタの重心を更新**
    let sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < data.length; i++) {
      let label = labels[i];
      sums[label][0] += data[i][0];
      sums[label][1] += data[i][1];
      sums[label][2] += data[i][2];
      sums[label][3] += 1;
    }

    for (let j = 0; j < k; j++) {
      if (sums[j][3] > 0) {
        centroids[j] = [
          sums[j][0] / sums[j][3],
          sums[j][1] / sums[j][3],
          sums[j][2] / sums[j][3],
        ];
      }
    }
  }
  //新しく追加
  // 1. 各クラスタのピクセル数を数える
  let clusterSizes = Array(k).fill(0);
  for (let i = 0; i < labels.length; i++) {
    clusterSizes[labels[i]]++;
  }

  // 2. ピクセル数の少ない順にクラスタのインデックスを並び替える
  let sortedClusters = Array.from({ length: k }, (_, i) => i).sort(
    (a, b) => clusterSizes[b] - clusterSizes[a]
  );

  // 3. 古いクラスタ番号 → 新しいクラスタ番号 の対応を作る
  let newLabelMap = {};
  for (let i = 0; i < k; i++) {
    newLabelMap[sortedClusters[i]] = i;
  }

  // 4. labels 配列のクラスタ番号を変換
  for (let i = 0; i < labels.length; i++) {
    labels[i] = newLabelMap[labels[i]];
  }

  return labels;
}

function distSq(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

// クラスタの平滑化処理
function smoothLabels() {
  for (let iter = 0; iter < iterations; iter++) {
    let newLabels = [...labels];

    for (let y = 0; y < img2.height; y++) {
      for (let x = 0; x < img2.width; x++) {
        let index = x + y * img2.width;
        if (edgePixels[index]) continue; // エッジ部分はラベル変更しない

        let currentLabel = labels[index];
        let neighborLabels = [];

        for (let dy = -floor(n / 2); dy <= floor(n / 2); dy++) {
          for (let dx = -floor(n / 2); dx <= floor(n / 2); dx++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < img2.width && ny >= 0 && ny < img2.height) {
              let neighborIndex = nx + ny * img2.width;
              neighborLabels.push(labels[neighborIndex]);
            }
          }
        }

        let maxLabel = currentLabel;
        let maxCount = neighborLabels.filter((l) => l === currentLabel).length;

        if (maxCount > neighborLabels.length / 2) {
          newLabels[index] = maxLabel;
        }
      }
    }

    labels = [...newLabels]; // 更新
  }
}

function rgbToHsv1(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;

  let h, s, v;
  v = max; // 明度 (V) は最大値

  // 彩度 (S) の計算（浮動小数点誤差防止）ex) console.log(0.1 + 0.2); // 0.30000000000000004
  s = max === 0 ? 0 : Math.min(d / max, 1);

  // 色相 (H) の計算
  if (max === min) {
    h = 0; // 無彩色 (グレー・白・黒) の場合
  } else {
    if (max === r) {
      h = (g - b) / d;
      if (g < b) {
        h += 6; // 負の値を補正
      }
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      // max === b
      h = (r - g) / d + 4;
    }

    h *= Math.PI / 3; // 0〜2π [rad] に変換
  }
  hAfter1 = h;
  sAfter1 = s;
  vAfter1 = v;
  return (hAfter1, sAfter1, vAfter1);
}

function rgbToHsv2(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;

  let h, s, v;
  v = max; // 明度 (V) は最大値

  // 彩度 (S) の計算（浮動小数点誤差防止）ex) console.log(0.1 + 0.2); // 0.30000000000000004
  s = max === 0 ? 0 : Math.min(d / max, 1);

  // 色相 (H) の計算
  if (max === min) {
    h = 0; // 無彩色 (グレー・白・黒) の場合
  } else {
    if (max === r) {
      h = (g - b) / d;
      if (g < b) {
        h += 6; // 負の値を補正
      }
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      // max === b
      h = (r - g) / d + 4;
    }

    h *= Math.PI / 3; // 0〜2π [rad] に変換
  }
  hAfter2 = h;
  sAfter2 = s;
  vAfter2 = v;
  return (hAfter2, sAfter2, vAfter2);
}

// windowがリサイズされたときの処理
function windowResized() {
  let p5Canvas = document.getElementById("p5Canvas");
  let canvas = resizeCanvas(p5Canvas.clientWidth, p5Canvas.clientHeight, WEBGL);
  elInit();
  for (let i = 0; i < cellophaneNum; i++) cellophaneRemoveButtonFunction();
  initValue();
  camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
  beforeColorCalculate();
}

// セロハンのDOMクラス
class Cellophane {
  constructor(n) {
    this.number = n;
    let parentDiv = createDiv()
      .parent("#cellophaneColabNum")
      .id("cellophane-" + this.number)
      .class("mb-1 pb-1");
    let inputGroup = createDiv().parent(parentDiv).class("input-group");
    let numSpan = createSpan(this.number + "組目の枚数")
      .parent(inputGroup)
      .class("input-group-text");
    let numInput = createInput(1, "number")
      .parent(inputGroup)
      .class("form-control")
      .attribute("min", 1)
      .id("numInput-" + this.number);
    let rotateSpan = createSpan(this.number + "組目の回転角")
      .parent(inputGroup)
      .class("input-group-text");
    let rotateInput = createInput(1, "number")
      .parent(inputGroup)
      .class("form-control")
      .id("rotateInput-" + this.number);
    let opdSpan = createSpan(this.number + "組目の光路差")
      .parent(inputGroup)
      .class("input-group-text");
    let opdIInput = createInput(270, "number")
      .parent(inputGroup)
      .class("form-control")
      .id("opdInput-" + this.number);
  }
}

let mainChartObj;
let subChartObj;

// HSV色空間分布の場合について
function drawGraph() {
  if (typeof mainChartObj !== "undefined" && mainChartObj) {
    mainChartObj.destroy();
  }
  //データ
  let mainData = {
    labels: waveLengthArr,
    datasets: [
      {
        label: "シミュレーションのスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: osArr,
        backgroundColor:
          "rgba(" + rAfter + "," + gAfter + "," + bAfter + ",0.5)", //点の色
        borderColor: "rgba(" + rAfter + "," + gAfter + "," + bAfter + ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
      {
        label: "１枚目の偏光板を透過した時のスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: osArrOrigin,
        backgroundColor:
          "rgba(" + rBefore + "," + gBefore + "," + bBefore + ",0.5)", //点の色
        borderColor: "rgba(" + rBefore + "," + gBefore + "," + bBefore + ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
    ],
  };

  //グラフの表示設定
  let mainOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: "１枚目の偏光板を透過した後とシミュレーションのスペクトルの比較",
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "波長(nm)",
          font: {
            size: 16,
          },
        },
        max: 750,
        min: 380,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "強度(a.u.)",
          font: {
            size: 16,
          },
        },
        max: 1,
        min: 0,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  let mainChartsetup = {
    type: "scatter",
    data: mainData,
    options: mainOptions,
  };

  //canvasにグラフを描画
  //Chart.Scatter() で散布図になる
  let mainCtx = document.getElementById("mainSpectrumGraph");
  mainChartObj = new Chart(mainCtx, mainChartsetup);
}

function drawGraph2_1(x1, y1) {
  if (typeof mainChartObj !== "undefined" && mainChartObj) {
    mainChartObj.destroy();
  }

  // 2次元データを格納する配列
  // 2次元データの例（x, y のペア）
  let osArr = [{ x: x1, y: y1 }]; // 実際のデータに置き換えてください

  // 円のデータを作成（360分割）
  let circleArr = [];
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 180) {
    // 1度刻み
    circleArr.push({ x: Math.cos(theta), y: Math.sin(theta) });
  }

  // データ設定
  let mainData = {
    datasets: [
      {
        label: "各層の色座標(円の外側程鮮やかS=1)",
        data: osArr,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(200, 200, 200, 1)",
        pointRadius: 5,
        showLine: false,
      },
      {
        label: "HSV色空間の境界",
        data: circleArr,
        borderColor: "red",
        borderWidth: 2,
        showLine: true, // 線として描画
        fill: false,
        pointRadius: 0, // 点を非表示
      },
    ],
  };

  // グラフのオプション設定
  let mainOptions = {
    plugins: {
      legend: { labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "HSV色空間上での各層の色",
        font: { size: 20 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: "x", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
      y: {
        display: true,
        title: { display: true, text: "y", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
    },
  };

  let mainChartsetup = {
    type: "scatter",
    data: mainData,
    options: mainOptions,
  };

  let mainCtx = document.getElementById("mainSpectrumGraph0");
  mainChartObj = new Chart(mainCtx, mainChartsetup);
}

function drawGraph2() {
  if (typeof mainChartObj !== "undefined" && mainChartObj) {
    mainChartObj.destroy();
  }

  // 2次元データを格納する配列
  let osArr = [];
  for (let i = 0; i < colabNum; i++) {
    let x2 = sAfterak[i] * Math.cos(hAfterak[i]);
    let y2 = sAfterak[i] * Math.sin(hAfterak[i]);

    osArr.push({ x: x2, y: y2 });
  }

  // 円のデータを作成（360分割）
  let circleArr = [];
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 180) {
    // 1度刻み
    circleArr.push({ x: Math.cos(theta), y: Math.sin(theta) });
  }

  // データ設定
  let mainData = {
    datasets: [
      {
        label: "各層の色座標(円の外側程鮮やかS=1)",
        data: osArr,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(200, 200, 200, 1)",
        pointRadius: 5,
        showLine: false,
      },
      {
        label: "HSV色空間の境界",
        data: circleArr,
        borderColor: "red",
        borderWidth: 2,
        showLine: true, // 線として描画
        fill: false,
        pointRadius: 0, // 点を非表示
      },
    ],
  };

  // グラフのオプション設定
  let mainOptions = {
    plugins: {
      legend: { labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "HSV色空間上での各層の色",
        font: { size: 20 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: "x", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
      y: {
        display: true,
        title: { display: true, text: "y", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
    },
  };

  let mainChartsetup = {
    type: "scatter",
    data: mainData,
    options: mainOptions,
  };

  let mainCtx = document.getElementById("mainSpectrumGraph0");
  mainChartObj = new Chart(mainCtx, mainChartsetup);
}
