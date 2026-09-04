// logic.jsはシミュレーションの描画処理と物理・色計算専用のファイルです。

import Chart from "chart.js/auto";
import * as math from "mathjs";
import { state } from "./state.js";
import { computePhaseRetardation } from "./physics.js";

// グラフの背景が暗い配色(body: bg-neutral-900)の上に透明で表示されるため、
// Chart.jsの既定の文字色(#666、白背景向け)のままだとコントラスト不足で見えづらい。
// 暗い背景でも視認できる明るい色に変更する。
Chart.defaults.color = "#e5e5e5";

// ★ draw相当のメイン処理
export function drawSimulation(p) {
  state.currentValue = state.optRadio.value();
  state.radius = 111;
  prenormal(p);
  colabNum1_normal(p);
  colabNum2_normal(p);
  if (state.lineradio.value() === "補助線あり") {
    checked(p);
  } else {
  }
  afterColorCalculate(p);
  document.getElementById("mainSpectrumGraphParent0").style.display = "none";
  document.getElementById("mainSpectrumGraphParent").style.display = "block";
  // グラフの描画
  drawGraph();
  if (state.preValue !== state.currentValue) {
    optChanged();
    p.ellipse(0, 0, 50, 50);
  }
}

// checkboxによって実行される補助線の記述
export function checked(p) {
  //基準線(0°)
  p.push();
  p.translate(0, 0, -60);
  p.stroke(255, 0, 0);
  p.line(0, 100, 0, -100);
  p.pop();
  for (let i = 0; i < state.colabNum; i++) {
    //colabNumが3の場合, 0,1,2 (1,2,3枚)
    let num = i + 1;
    let rotateInput = p.select("#rotateInput-" + num);
    p.push();
    p.rotateZ((rotateInput.value() * p.PI) / 180);
    p.stroke(0, 0, 0); //2024.6.14 透明度を50から20へ変更 (157, 204, 224, 0)
    p.push();
    p.translate(0, 0, -60);
    p.line(0, 100, 0, -100);
    p.pop();
    p.pop();
  }
}

//スライダーやラジオボタンを作成する処理
export function createSliderandRadio(p) {
  state.slider = p.createSlider(10, 400, 75); //テープの幅を決定するslider
  state.slider.position(50, 100);
  state.lastSlider = state.slider.value();
  state.lineradio = p.createRadio();
  state.lineradio.option("補助線あり");
  state.lineradio.option("補助線なし");
  state.lineradio.selected("補助線なし");
  state.lineradio.position(400, 130);
  state.optRadio = p.createRadio();
  state.optRadio.option("セロハンテープ");
  state.optRadio.option("OPPフィルム");
  state.optRadio.position(400, 100);
  state.optRadio.selected("セロハンテープ");
  state.preValue = state.optRadio.value();
}

//normalにおける配列用意や画像の貼り付け, テープ幅の設定, 偏光板の表示など
export function prenormal(p) {
  p.frameRate(60);
  state.tape_angle = new Array(state.colabNum).fill(0);
  state.tape_angle_cal = new Array(state.colabNum).fill(0); //配列の宣言(1枚目以降) 1,2,3,4,5..colabNum
  state.tape_number_cal = new Array(state.colabNum).fill(0);

  // テープ描画における条件設定(幅)
  state.angle_1 = p.atan2(100, state.slider.value());
  state.angle_2 = p.PI - p.atan2(100, state.slider.value());
  state.angle_3 = p.PI + p.atan2(100, state.slider.value());
  state.angle_4 = 2 * p.PI - p.atan2(100, state.slider.value());

  // 回転の設定
  //rotateTime += 0.5
  p.rotateY((180 * p.PI) / 180); //本来回転時はrotateY(rotateTime * PI / 180)
  // 背景色の設定
  p.background(state.rBefore, state.gBefore, state.bBefore);
  p.push();
  p.translate(-100, -100);
  p.image(state.img, 0, 0);
  p.pop();
  state.img.loadPixels();

  // 偏光板の描画
  createPolarizer(p, 200, 0, 0, 0, 0);
  state.cellophaneNum = numInputFunction(p);
  if (state.polarizerSelect.value() == "平行ニコル配置")
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 0);
  if (state.polarizerSelect.value() == "直交ニコル配置")
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 1);
}

//"画像塗分け"における配列用意や画像の貼り付け, テープ幅の設定, 偏光板の表示など
export function prefilledimage(p) {
  p.frameRate(60);
  state.tape_angle = new Array(state.colabNum).fill(0);
  state.tape_angle_cal = new Array(state.colabNum).fill(0); //配列の宣言(1枚目以降) 1,2,3,4,5..colabNum
  state.tape_number_cal = new Array(state.colabNum).fill(0);

  // edige検出の為の処理
  state.thresholds = state.edgieSlider.value();

  // テープ描画における条件設定(幅)
  state.angle_1 = p.atan2(100, state.slider.value());
  state.angle_2 = p.PI - p.atan2(100, state.slider.value());
  state.angle_3 = p.PI + p.atan2(100, state.slider.value());
  state.angle_4 = 2 * p.PI - p.atan2(100, state.slider.value());

  // 回転の設定
  p.rotateY((180 * p.PI) / 180);
  // 背景色の設定
  p.background(200);
  p.push();
  p.translate(-100, -100);
  p.image(state.img2, 0, 0, 200, 200); // 画質を良くするために200,200のサイズ宣言は必要.
  p.pop();
  //img2.loadPixels();

  // 偏光板の描画
  createPolarizer(p, 200, 0, 0, 0, 0);
  state.cellophaneNum = numInputFunction(p);
  if (state.polarizerSelect.value() == "平行ニコル配置")
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 0);
  if (state.polarizerSelect.value() == "直交ニコル配置")
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 1);
}

// normalにおける, 組数1での色計算と配色の処理
export function colabNum1_normal(p) {
  if (state.colabNum == 1) {
    let z = 0;
    let i = 0;
    let num = i + 1;
    let numInput = p.select("#numInput-" + num);
    let rotateInput = p.select("#rotateInput-" + num);
    createCellophane(
      p,
      numInput.value(),
      rotateInput.value(),
      z,
      state.angle_1
    );
    z += parseInt(numInput.value());
    //tape1枚のみに色を塗る
    afterColorCalculate1(p);
    drawTape_1(
      p,
      state.rAfter1,
      state.gAfter1,
      state.bAfter1,
      rotateInput.value()
    );
    state.img.updatePixels();
  }
}

// normalにおける, 組数2以上での色計算と配色の処理
export function colabNum2_normal(p) {
  if (state.colabNum >= 2) {
    if (state.count2 === 0) {
      for (let i = 0; i < state.img.pixels.length; i += 4) {
        state.img.pixels[i] = 200;
        state.img.pixels[i + 1] = 200;
        state.img.pixels[i + 2] = 200;
        state.img.pixels[i + 3] = 255; //7.13までは80
      }
      state.img.updatePixels();
      state.count2 = 1;
    }

    //組数が変更された際に再度分割計算しなおすためのコマンド
    if (state.colabNum !== state.lastValue) {
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.lastValue = state.colabNum;
      state.calculate = 0;
    }
    state.currentSlider = state.slider.value();
    let check = 0;
    for (let n = 1; n <= state.colabNum; n++) {
      //1でなく2では..?
      let numInputValue = parseInt(p.select("#numInput-" + n).value()); // 数値型に変換
      let rotateInputValue = parseFloat(
        p.select("#rotateInput-" + n).value()
      ); // 数値型に変換
      let optInputValue = state.opdInput.value(); // 数値型に変換
      let nowpolarizer = state.polarizerSelect.value();
      if (numInputValue !== state.last_otherCellophaneNums[n - 2]) {
        check++;
        state.last_otherCellophaneNums[n - 2] = numInputValue;
      }
      if (rotateInputValue !== state.last_targetAngles[n - 2]) {
        check++;
        state.last_targetAngles[n - 2] = rotateInputValue;
      }
      if (optInputValue !== state.last_opt1) {
        check++;
        state.last_opt1 = optInputValue;
      }
      if (nowpolarizer !== state.last_polarizer) {
        check++;
        state.last_polarizer = nowpolarizer;
      }
    }
    if (state.lastSlider !== state.currentSlider) {
      state.lastSlider = state.currentSlider;
      state.Cluster1isDead = false;
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.changeisDead = false;
    }
    if (check >= 1) {
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.calculate = 0;
    }

    //枚数や角度が変更された際に再度分割計算しなおすためのコマンド(取り敢えずボタン?) //上にfunction(key..の用意)

    if (!state.BisDead) {
      state.Bdraw++;
      if (state.Bcount == 0) {
        // rgbを格納する配列の初期化
        state.rAftera = new Array(Math.pow(2, state.colabNum)); //2024.6.17 colabNum修正 colabNum-1から
        state.gAftera = new Array(Math.pow(2, state.colabNum));
        state.bAftera = new Array(Math.pow(2, state.colabNum));
        state.Bcount += 1;
      }
      //if(colabNum<=15){
      //Bsize = Math.pow(colabNum,2);s
      p.push();
      p.fill(255, 0, 0, 10);
      p.ellipse(0, 0, p.frameRate() * 8, p.frameRate() * 8);
      p.pop();
      if (typeof state.Bsize === "undefined") {
        state.Bsize = 100;
      }
      if (p.frameRate() < 30) {
        state.Bsize = p.max(25, state.Bsize / 2); // フレームレートが低い場合、Bsizeを小さく
      } else {
        state.Bsize = p.min(1000, state.Bsize * 1.5); // フレームレートが高い場合、Bsizeを大きく
      }

      let start = (state.Bdraw - 1) * state.Bsize;
      let end = p.min(Math.pow(2, state.colabNum), start + state.Bsize);
      for (let i = start; i < end; i++) {
        //その枚数で生み出せる全ての色を生成(2角目以降)
        let binaryString = "";
        binaryString = i.toString(2).padStart(state.colabNum, "0"); // colabNum=2 //00,01,10,11
        afterColorCalculates(
          p,
          binaryString,
          state.tape_angle_cal,
          state.tape_number_cal
        );
        state.rAftera[i] = state.rAfter2;
        state.gAftera[i] = state.gAfter2;
        state.bAftera[i] = state.bAfter2;
      }
      if (end == Math.pow(2, state.colabNum)) {
        state.BisDead = true;
      }
    }

    if (state.BisDead == true) {
      if (!state.CisDead) {
        let z = 0;
        for (let i = 0; i < state.colabNum; i++) {
          //colabNumが3の場合, 0,1,2 (1,2,3枚)
          let num = i + 1;
          let numInput = p.select("#numInput-" + num);
          let rotateInput = p.select("#rotateInput-" + num);
          createCellophane(
            p,
            numInput.value(),
            rotateInput.value(),
            z,
            state.angle_1
          );
          z += parseInt(numInput.value());
          state.tape_angle[i] = rotateInput.value(); //テープの全角度を収納する
        }
        drawTapes(
          p,
          state.tape_angle,
          state.rAftera,
          state.gAftera,
          state.bAftera
        );
      } else {
      }
    }
  }
}

export function colorRect(p) {
  for (let i = 0; i < state.colabNum; i++) {
    let size = 50;
    let r = 50; //rAfterak[i]
    let g = 40; // gAfterak[i]
    let b = 0; //bAfterak[i]
    p.push();
    p.fill(r, g, b);
    p.rect(150 + i * size, 150, size, (size / 3) * 2);
    p.pop();
  }
}

//白画像を定位置に配置し, pixelsの色を初期値にする処理. 入力画像のサイズを設定する処理
export function createStartimg() {
  state.img.resize(200, 200);
  state.centerX = 100;
  state.centerY = 100;
  state.img.loadPixels();
  for (let i = 0; i < state.img.pixels.length; i += 4) {
    state.img.pixels[i] = 200;
    state.img.pixels[i + 1] = 200;
    state.img.pixels[i + 2] = 200;
    state.img.pixels[i + 3] = 255; // 7.13までは80
  }
  state.img.updatePixels();
  //img2.resize(200, 200);
}

// 偏光板を描画する処理
export function createPolarizer(p, size, x, y, z, pattern) {
  p.push();
  p.translate(x, y, z);
  p.noFill();
  p.strokeWeight(0.1);
  p.stroke(0, 200);
  p.box(size, size, 0);
  if (pattern == 0) {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2 + i, size / 2, 0, -size / 2 + i, -size / 2, 0);
    }
  } else {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2, -size / 2 + i, 0, size / 2, -size / 2 + i, 0);
    }
  }
  p.pop();
}

// セロハンを描画する処理
export function createCellophane(p, n, rAfter, a, angle_1) {
  // noStroke()
  p.push();
  p.rotateZ((rAfter * p.PI) / 180);
  p.fill(255, 255, 255, 0); //2024.6.14 透明度を50から20へ変更 (157, 204, 224, 0)
  for (let i = 0; i < n; i++) {
    p.push();
    p.translate(-0, 0, -0.1 * (i + a));
    p.box(
      2 * state.radius * p.cos(angle_1),
      2 * state.radius * p.sin(angle_1),
      0.1
    );
    p.pop();
  }
  p.pop();
}

// 回転行列R(theta)
export function r_theta(p, theta) {
  return [
    [p.cos(theta), -p.sin(theta)],
    [p.sin(theta), p.cos(theta)],
  ];
}

// 回転行列R(-theta)
export function mai_r_theta(p, theta) {
  return [
    [p.cos(theta), p.sin(theta)],
    [-p.sin(theta), p.cos(theta)],
  ];
}

// ジョーンズマトリクス
export function jhons(p, theta) {
  return [
    [p.sin(theta) ** 2, -p.sin(theta) * p.cos(theta)],
    [-p.sin(theta) * p.cos(theta), p.cos(theta) ** 2],
  ];
}

// RGBへの変換
export function toRGB(a) {
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
export function numInputFunction(p) {
  state.cellophaneNum = 0;
  for (let i = 0; i < state.colabNum; i++) {
    let num = i + 1;
    let numInput = p.select("#numInput-" + num);
    state.cellophaneNum += p.int(numInput.value());
  }
  return state.cellophaneNum;
}

// 偏光板１枚を透過したときの色の計算
export function beforeColorCalculate(p) {
  // XYZ刺激値への変換（等色関数×スペクトル）
  for (let i = 380; i <= 750; i++) {
    state.xArrBefore[i - 380] =
      state.R_all[i - 380] *
      state.osArrOrigin[i - 380] *
      state.xLambda[i - 380];
    state.yArrBefore[i - 380] =
      state.R_all[i - 380] *
      state.osArrOrigin[i - 380] *
      state.yLambda[i - 380];
    state.zArrBefore[i - 380] =
      state.R_all[i - 380] *
      state.osArrOrigin[i - 380] *
      state.zLambda[i - 380];
    state.R_os[i - 380] = state.R_all[i - 380] * state.osArrOrigin[i - 380];
  }
  state.Intensity_all_now = math.sum(state.R_os);
  for (let i = 380; i <= 750; i++) {
    state.speyBox[i - 380] =
      state.osArrOrigin[i - 380] *
      state.yLambda[i - 380] *
      state.R_all[i - 380];
  }
  state.spey = math.sum(state.speyBox);
  state.K = 1.0 / state.spey; //0.5
  // RGBへの変換
  state.xSumBefore = math.sum(state.xArrBefore) * state.K;
  state.ySumBefore = math.sum(state.yArrBefore) * state.K;
  state.zSumBefore = math.sum(state.zArrBefore) * state.K;
  state.tosRGB = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758, 0.0415],
    [0.0557, -0.204, 1.057],
  ];
  state.rgbBefore = math.multiply(state.tosRGB, [
    state.xSumBefore,
    state.ySumBefore,
    state.zSumBefore,
  ]);
  state.rBefore = toRGB(state.rgbBefore[0]);
  state.gBefore = toRGB(state.rgbBefore[1]);
  state.bBefore = toRGB(state.rgbBefore[2]);
  // 要素へのRGBの反映
  let beforeColor = p.select("#beforeColor");
  beforeColor.style(
    "background-color:rgb(" +
      p.str(state.rBefore) +
      "," +
      p.str(state.gBefore) +
      "," +
      p.str(state.bBefore) +
      ")"
  );
}

// セロハン及び二枚目の偏光板を透過した時の処理
export function afterColorCalculate(p) {
  // セロハンの組数が１枚以上ある場合
  if (state.colabNum >= 1) {
    let ls_xArrAfter = [];
    let ls_yArrAfter = [];
    let ls_zArrAfter = [];

    // 計算には１組目のセロハンを基準とした相対角度を使う
    let referenceAngle = p.select("#rotateInput-1");
    let a = p.radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    let firstCellophaneNum = p.select("#numInput-1"); // セロハン１組目の枚数
    let firstopdInput = p.select("#opdInput"); // セロハン1組目の光路差
    state.E_1 = [[-p.sin(a)], [p.cos(a)]];

    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let delta = computePhaseRetardation(
        state.dArr[i - 380],
        firstCellophaneNum.value(),
        firstopdInput.value(),
        l
      );
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      state.E_2 = math.multiply(cello, state.E_1);

      // セロハンの組数が2組以上の場合、それぞれのセロハンに関する計算を再帰的に行う
      if (state.colabNum >= 2) {
        for (let n = 2; n <= state.colabNum; n++) {
          let otherCellophaneNum = p.select("#numInput-" + n);
          let otheropdInput = p.select("#opdInput");
          let delta = computePhaseRetardation(
            state.dArr[i - 380],
            otherCellophaneNum.value(),
            otheropdInput.value(),
            l
          );
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = p.select("#rotateInput-" + n);
          let b = p.radians(targetAngle.value() - referenceAngle.value());
          state.E_2 = math.multiply(
            r_theta(p, b),
            math.multiply(cello, math.multiply(mai_r_theta(p, b), state.E_2))
          );
        }
      }

      let c;
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        c = p.radians(-referenceAngle.value());
      } else if (state.polarizerSelect.value() == "直交ニコル配置") {
        c = p.radians(-referenceAngle.value()) - p.radians(90);
      }

      state.E_3 = math.multiply(jhons(p, c), state.E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(state.E_3[0], state.E_3[0])) +
          math.abs(math.multiply(state.E_3[1], state.E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      ls_xArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.xLambda[i - 380];
      ls_yArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.yLambda[i - 380];
      ls_zArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    let sum_ls_xArrAfter = math.sum(ls_xArrAfter);
    let sum_ls_yArrAfter = math.sum(ls_yArrAfter);
    let sum_ls_zArrAfter = math.sum(ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] *
        state.yLambda[i - 380] *
        state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    state.xSumAfter = math.sum(state.xArrAfter) * state.K;
    state.ySumAfter = math.sum(state.yArrAfter) * state.K;
    state.zSumAfter = math.sum(state.zArrAfter) * state.K;
    state.tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    state.sRGB = math.multiply(state.tosRGB, [
      state.xSumAfter,
      state.ySumAfter,
      state.zSumAfter,
    ]);
    state.rAfter = toRGB(state.sRGB[0]);
    state.gAfter = toRGB(state.sRGB[1]);
    state.bAfter = toRGB(state.sRGB[2]);
    let ratio;
    if (state.rAfter >= state.gAfter && state.rAfter >= state.bAfter) {
      ratio = state.xSumAfter / sum_ls_xArrAfter;
    } else if (state.gAfter >= state.rAfter && state.gAfter >= state.bAfter) {
      ratio = state.ySumAfter / sum_ls_yArrAfter;
    } else if (state.bAfter >= state.rAfter && state.bAfter >= state.gAfter) {
      ratio = state.zSumAfter / sum_ls_zArrAfter;
    }
    //rAfter *=ratio
    //gAfter *=ratio
    //bAfter *=ratio
  }
  // セロハンの組が0組の場合
  else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter = state.rBefore;
      state.gAfter = state.gBefore;
      state.bAfter = state.bBefore;
    } else if (state.polarizerSelect.value() == "直交ニコル配置") {
      state.rAfter = 0;
      state.gAfter = 0;
      state.bAfter = 0;
      for (let i = 380; i <= 750; i++) {
        state.osArr[i - 380] = 0;
      }
    }
  }

  // 色を要素に反映
  let afterColor = p.select("#afterColor");
  afterColor.style(
    "background-color:rgb(" +
      p.str(state.rAfter) +
      "," +
      p.str(state.gAfter) +
      "," +
      p.str(state.bAfter) +
      ")"
  );
}

// セロハン及び二枚目の偏光板を透過した時の処理(セロハン1枚のみ)
export function afterColorCalculate1(p) {
  // セロハンの組数が１枚以上ある場合
  if (state.colabNum >= 1) {
    // 計算には１組目のセロハンを基準とした相対角度を使う
    let referenceAngle = p.select("#rotateInput-1");
    let a = p.radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    let firstCellophaneNum = p.select("#numInput-1"); // セロハン１組目の枚数
    let firstopdInput = p.select("#opdInput"); // セロハン1組目の光路差
    state.E_1 = [[-p.sin(a)], [p.cos(a)]];

    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let delta = computePhaseRetardation(
        state.dArr[i - 380],
        firstCellophaneNum.value(),
        firstopdInput.value(),
        l
      );
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      state.E_2 = math.multiply(cello, state.E_1);
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        state.c = p.radians(-referenceAngle.value());
      } else if (state.polarizerSelect.value() == "直交ニコル配置") {
        state.c = p.radians(-referenceAngle.value()) - p.radians(90);
      }

      state.E_3 = math.multiply(jhons(p, state.c), state.E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(state.E_3[0], state.E_3[0])) +
          math.abs(math.multiply(state.E_3[1], state.E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      state.ls_xArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.xLambda[i - 380];
      state.ls_yArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.yLambda[i - 380];
      state.ls_zArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    state.sum_ls_xArrAfter = math.sum(state.ls_xArrAfter);
    state.sum_ls_yArrAfter = math.sum(state.ls_yArrAfter);
    state.sum_ls_zArrAfter = math.sum(state.ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] *
        state.yLambda[i - 380] *
        state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    state.xSumAfter = math.sum(state.xArrAfter) * state.K;
    state.ySumAfter = math.sum(state.yArrAfter) * state.K;
    state.zSumAfter = math.sum(state.zArrAfter) * state.K;
    state.tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    state.sRGB = math.multiply(state.tosRGB, [
      state.xSumAfter,
      state.ySumAfter,
      state.zSumAfter,
    ]);
    state.rAfter1 = toRGB(state.sRGB[0]);
    state.gAfter1 = toRGB(state.sRGB[1]);
    state.bAfter1 = toRGB(state.sRGB[2]);
    let ratio;
    if (state.rAfter1 >= state.gAfter1 && state.rAfter1 >= state.bAfter1) {
      ratio =
        state.xSumAfter ** (1 / 2.4) / state.sum_ls_xArrAfter ** (1 / 2.4);
    } else if (
      state.gAfter1 >= state.rAfter1 &&
      state.gAfter1 >= state.bAfter1
    ) {
      ratio =
        state.ySumAfter ** (1 / 2.4) / state.sum_ls_yArrAfter ** (1 / 2.4);
    } else if (
      state.bAfter1 >= state.rAfter1 &&
      state.bAfter1 >= state.gAfter1
    ) {
      ratio =
        state.zSumAfter ** (1 / 2.4) / state.sum_ls_zArrAfter ** (1 / 2.4);
    }
  }

  // セロハンの組が0組の場合
  else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter1 = state.rBefore;
      state.gAfter1 = state.gBefore;
      state.bAfter1 = state.bBefore;
    } else if (state.polarizerSelect.value() == "直交ニコル配置") {
      state.rAfter1 = 0;
      state.gAfter1 = 0;
      state.bAfter1 = 0;
      for (let i = 380; i <= 750; i++) {
        state.osArr[i - 380] = 0;
      }
    }
  }

  //色を要素に反映
  //let afterColor = select("#afterColor")
  //afterColor.style("background-color:rgb(" + str(rAfter1) + "," + str(gAfter1) + "," + str(bAfter1) + ")")
}

// セロハン及び二枚目の偏光板を透過した時の処理
export function afterColorCalculates(p, binaryString) {
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
    referenceAngle = p.select("#rotateInput-1");
    a = p.radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
    firstCellophaneNum = p.select("#numInput-1"); // セロハン１組目の枚数
    state.E_1 = [[-p.sin(a)], [p.cos(a)]];
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
      referenceAngle = p.select("#rotateInput-" + numS);
      a = p.radians(-referenceAngle.value()); // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
      firstCellophaneNum = p.select("#numInput-" + numS); // セロハン１組目の枚数
      state.E_1 = [[-p.sin(a)], [p.cos(a)]];
    }
  }

  if (numStart !== 0) {
    // それぞれの波長毎に計算
    for (let i = 380; i <= 750; i++) {
      let l = i;
      let firstopdInput = p.select("#opdInput"); // セロハン1組目の光路差
      let delta = computePhaseRetardation(
        state.dArr[i - 380],
        firstCellophaneNum.value(),
        firstopdInput.value(),
        l
      ); //2024.6.22 firstCellophaneの値をvalueで数値化しないとだめだった!
      let cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      state.E_2 = math.multiply(cello, state.E_1);

      if (bit[0] == 0) {
        for (let j = 1; j < state.colabNum; j++) {
          //2角組目以降..
          let n = j + 1;
          let otherCellophaneNum = p.select("#numInput-" + n);
          let otheropdInput = p.select("#opdInput");
          let delta = computePhaseRetardation(
            state.dArr[i - 380],
            otherCellophaneNum.value(),
            otheropdInput.value(),
            l
          );
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = p.select("#rotateInput-" + n);
          let b = p.radians(targetAngle.value() - referenceAngle.value());
          if (bit[j] == 0) {
            state.E_2 = math.multiply(
              r_theta(p, b),
              math.multiply(
                cello,
                math.multiply(mai_r_theta(p, b), state.E_2)
              )
            );
          } else {
            state.E_2 = state.E_2;
          }
        }
      } else if (tape_sum > 1) {
        for (let k = numStart + 1; k < binaryString.length; k++) {
          //2024.6.19 n=numStartから+1?
          let num = k + 1;
          let otherCellophaneNum = p.select("#numInput-" + num);
          let otheropdInput = p.select("#opdInput");
          let delta = computePhaseRetardation(
            state.dArr[i - 380],
            otherCellophaneNum.value(),
            otheropdInput.value(),
            l
          );
          let cello = [
            [1, 0],
            [0, math.exp(math.complex(0, -delta))],
          ];
          let targetAngle = p.select("#rotateInput-" + num);
          let b = p.radians(targetAngle.value() - referenceAngle.value());
          if (bit[k] == 0) {
            state.E_2 = math.multiply(
              r_theta(p, b),
              math.multiply(
                cello,
                math.multiply(mai_r_theta(p, b), state.E_2)
              )
            ); //2024.6.21 ここでバグが生じる
          } else {
            state.E_2 = state.E_2;
          }
        }
      }

      let c;
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        c = p.radians(-referenceAngle.value());
      } else if (state.polarizerSelect.value() == "直交ニコル配置") {
        c = p.radians(-referenceAngle.value()) - p.radians(90);
      }

      state.E_3 = math.multiply(jhons(p, c), state.E_2);
      let relativeStrength = math.abs(
        math.abs(math.multiply(state.E_3[0], state.E_3[0])) +
          math.abs(math.multiply(state.E_3[1], state.E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
      // 明度の表現の為の, 光源スペクトル成分*等色関数*補正関数
      state.ls_xArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.xLambda[i - 380];
      state.ls_yArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.yLambda[i - 380];
      state.ls_zArrAfter[i - 380] =
        state.osArrOrigin[i - 380] *
        state.R_all[i - 380] *
        state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    state.sum_ls_xArrAfter = math.sum(state.ls_xArrAfter);
    state.sum_ls_yArrAfter = math.sum(state.ls_yArrAfter);
    state.sum_ls_zArrAfter = math.sum(state.ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] *
        state.yLambda[i - 380] *
        state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    state.xSumAfter = math.sum(state.xArrAfter) * state.K;
    state.ySumAfter = math.sum(state.yArrAfter) * state.K;
    state.zSumAfter = math.sum(state.zArrAfter) * state.K;
    state.tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    state.sRGB = math.multiply(state.tosRGB, [
      state.xSumAfter,
      state.ySumAfter,
      state.zSumAfter,
    ]);
    state.rAfter2 = toRGB(state.sRGB[0]);
    state.gAfter2 = toRGB(state.sRGB[1]);
    state.bAfter2 = toRGB(state.sRGB[2]);
    let ratio;
    if (state.rAfter2 >= state.gAfter2 && state.rAfter2 >= state.bAfter2) {
      ratio =
        state.xSumAfter ** (1 / 2.4) / state.sum_ls_xArrAfter ** (1 / 2.4);
    } else if (
      state.gAfter2 >= state.rAfter2 &&
      state.gAfter2 >= state.bAfter2
    ) {
      ratio =
        state.ySumAfter ** (1 / 2.4) / state.sum_ls_yArrAfter ** (1 / 2.4);
    } else if (
      state.bAfter2 >= state.rAfter2 &&
      state.bAfter2 >= state.gAfter2
    ) {
      ratio =
        state.zSumAfter ** (1 / 2.4) / state.sum_ls_zArrAfter ** (1 / 2.4);
    }
    //rAfter2 *=ratio
    //gAfter2 *=ratio
    //bAfter2 *=ratio
  } else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter2 = 200;
      state.gAfter2 = 200;
      state.bAfter2 = 200;
    } else if (state.polarizerSelect.value() == "直交ニコル配置") {
      state.rAfter2 = 0;
      state.gAfter2 = 0;
      state.bAfter2 = 0;
    }
  }

  // 色を要素に反映
  //let afterColor = select("#afterColor")
  //afterColor.style("background-color:rgb(" + str(rAfter) + "," + str(gAfter) + "," + str(bAfter) + ")")

  //rAfter2 = 255-50*tape_sum
}

// tape1枚目のみに色を塗る
export function drawTape_1(p, rAfter1, gAfter1, bAfter1, rotateInput) {
  state.tape_angle_get = ((rotateInput - 90) * p.PI) / 180;
  getrectPoint(p, state.tape_angle_get);
  for (let i = 0; i < state.img.pixels.length; i += 4) {
    if (checkA(i / 4)) {
      state.img.pixels[i + 0] = rAfter1;
      state.img.pixels[i + 1] = gAfter1;
      state.img.pixels[i + 2] = bAfter1;
    } else {
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        state.img.pixels[i + 0] = 200;
        state.img.pixels[i + 1] = 200;
        state.img.pixels[i + 2] = 200;
      } else if (state.polarizerSelect.value() == "直交ニコル配置") {
        state.img.pixels[i + 0] = 0;
        state.img.pixels[i + 1] = 0;
        state.img.pixels[i + 2] = 0;
      }
    }
  }
}

//tapeが2枚以上ある場合における，色の塗りつぶし
export function drawTapes(p, tape_angle, rAftera, gAftera, bAftera) {
  if (!state.DrawisDead) {
    state.drawT++;
    if (state.drawCount == 0) {
      state.tape_array = new Array(state.img.pixels.length / 4).fill("");
      state.tape_arraySum = new Array(state.img.pixels.length / 4).fill("");
      state.drawCount++;
    }
    state.drawSize = p.floor(state.img.height / state.colabNum);
    let startYT = (state.drawT - 1) * state.drawSize;
    let endYT = p.min(state.img.height, startYT + state.drawSize);
    state.img.loadPixels();
    for (let t = 0; t < state.colabNum; t++) {
      //colabNumが3の場合 t=0,1,2
      state.tape_angle_get = ((tape_angle[t] - 90) * p.PI) / 180;
      getrectPoint(p, state.tape_angle_get);

      for (
        let i = startYT * state.img.width;
        i < endYT * state.img.width;
        i++
      ) {
        if (checkA(i)) {
          state.tape_array[i] = "0";
        } else {
          state.tape_array[i] = "1";
        }
        state.tape_arraySum[i] += state.tape_array[i];
      }
    }

    for (
      let i = startYT * state.img.width;
      i < endYT * state.img.width;
      i++
    ) {
      state.zz = parseInt(state.tape_arraySum[i], 2); //"0"又は"1"からなるバイナリ数を数字化
      let index = i * 4;
      state.img.pixels[index] = rAftera[state.zz];
      state.img.pixels[index + 1] = gAftera[state.zz];
      state.img.pixels[index + 2] = bAftera[state.zz];
    }
    if (state.drawT >= state.colabNum) {
      state.DrawisDead = true;
    }
    state.img.updatePixels();
  } else {
    state.CisDead = true;
  }
}

// ある角度におけるテープの4隅の点の情報を入手
export function getrectPoint(p, tape_angle) {
  p.push();
  p.translate(-100, -100);
  let sinValues = [
    p.sin(state.angle_1 + tape_angle - p.PI / 2),
    p.sin(state.angle_2 + tape_angle - p.PI / 2),
    p.sin(state.angle_3 + tape_angle - p.PI / 2),
    p.sin(state.angle_4 + tape_angle - p.PI / 2),
  ];
  let cosValues = [
    p.cos(state.angle_1 + tape_angle - p.PI / 2),
    p.cos(state.angle_2 + tape_angle - p.PI / 2),
    p.cos(state.angle_3 + tape_angle - p.PI / 2),
    p.cos(state.angle_4 + tape_angle - p.PI / 2),
  ];

  state.x1 = state.centerX + cosValues[0] * state.radius;
  state.y1 = state.centerY + sinValues[0] * state.radius;
  state.x2 = state.centerX + cosValues[1] * state.radius;
  state.y2 = state.centerY + sinValues[1] * state.radius;
  state.x3 = state.centerX + cosValues[2] * state.radius;
  state.y3 = state.centerY + sinValues[2] * state.radius;
  state.x4 = state.centerX + cosValues[3] * state.radius;
  state.y4 = state.centerY + sinValues[3] * state.radius;

  p.push();
  p.fill(255, 0, 0);
  //ellipse(x1, y1, 10, 10);
  //ellipse(x2, y2, 10, 10);
  //ellipse(x3, y3, 10, 10);
  //ellipse(x4, y4, 10, 10);
  p.pop();
  p.line(state.x1, state.y1, state.x2, state.y2);
  p.line(state.x2, state.y2, state.x3, state.y3);
  p.line(state.x3, state.y3, state.x4, state.y4);
  p.line(state.x4, state.y4, state.x1, state.y1);
  p.pop();
}

//そのピクセルが，tapeの内部にあるために変更を求められるかを判定
export function checkA(i) {
  let x = i % state.img.width;
  let y = (i - x) / state.img.width;
  let P0 = { x: x, y: y };
  let P1 = { x: state.x1, y: state.y1 };
  let P2 = { x: state.x2, y: state.y2 };
  let P3 = { x: state.x3, y: state.y3 };
  let P4 = { x: state.x4, y: state.y4 };

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
export function crossProduct(P, A, B) {
  let AB = { x: B.x - A.x, y: B.y - A.y };
  let AP = { x: P.x - A.x, y: P.y - A.y };
  return AB.x * AP.y - AB.y * AP.x;
}

// 光源の強度値の算出
export function intensity_max() {
  for (let i = 380; i <= 750; i++) {
    state.Intensity_all_box[i - 380] = state.osArrOrigin[i - 380];
  }
  state.Intensity_all = math.sum(state.Intensity_all_box);
  return state.Intensity_all;
}

export function optChanged() {
  if (state.optRadio.value() == "セロハンテープ") {
    state.dArr = state.dTable.getColumn("d");
    state.dRowNum = state.dTable.getRowCount();
    state.preValue = state.optRadio.value();
  }
  if (state.optRadio.value() == "OPPフィルム") {
    state.dArr = state.dTableOPP.getColumn("d");
    state.dRowNum = state.dTableOPP.getRowCount();
    state.preValue = state.optRadio.value();
  }
}

// HSV色空間分布の場合について
export function drawGraph() {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }
  //データ
  let mainData = {
    labels: state.waveLengthArr,
    datasets: [
      {
        label: "シミュレーションのスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: state.osArr,
        backgroundColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",0.5)", //点の色
        borderColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
      {
        label: "１枚目の偏光板を透過した時のスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: state.osArrOrigin,
        backgroundColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",0.5)", //点の色
        borderColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",1)",
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
  state.mainChartObj = new Chart(mainCtx, mainChartsetup);
}

export function drawGraph2_1(x1, y1) {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
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
  state.mainChartObj = new Chart(mainCtx, mainChartsetup);
}

export function drawGraph2() {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }

  // 2次元データを格納する配列
  let osArr = [];
  for (let i = 0; i < state.colabNum; i++) {
    let x2 = state.sAfterak[i] * Math.cos(state.hAfterak[i]);
    let y2 = state.sAfterak[i] * Math.sin(state.hAfterak[i]);

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
  state.mainChartObj = new Chart(mainCtx, mainChartsetup);
}
