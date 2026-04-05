import $ from "jquery";
import html2canvas from "html2canvas";

// p5.jsがcommon.jsから読み込まれるのを待機
// common.jsでimport "p5"によりp5がグローバルに登録される
function waitForP5() {
  return new Promise((resolve) => {
    if (typeof window.createCanvas !== "undefined") {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window.createCanvas !== "undefined") {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
    }
  });
}

// p5が利用可能になるまで待機
await waitForP5();

// === 変数宣言 ===

// キャンバスコントローラー
let canvasController;
let coordinateSystem;

// ボタン要素
let buttonParent;
let placeAddButton, placeRemoveButton;
let strataAddButton, strataRemoveButton;
let setRadioParent;
let strataFileInput;
let setRadioButton;
let unitSelect;

// 地点のデータを入力するインプットの連想配列
let dataInputArr = {};
// データ構造
// dataInputArr = {
//   地点+地点番号:{
//     name: 地点の名前,
//     data:{
//       x: 経度,
//       y: 緯度
//     },
//     edit: データを編集するボタン,
//     layer:[
//       [
//         1層目の浅い方の深さ,
//         1層目の深い方の深さ,
//         岩層の種類,
//       ],
//       [
//         2層目の浅い方の深さ,
//         2層目の深い方の深さ,
//         岩層の種類,
//       ]
//     ]
//   }
// }

let rotateTime;
let xMin, xMax, yMin, yMax, zMin, zMax;
let coordinateData;

// === クラス定義 ===

// DOM要素のクラス
class DOM {
  constructor(n) {
    this.n = n;
    this.parentDiv = createDiv()
      .parent("placePointNameInput")
      .class("mb-2")
      .id("placeNameInput" + str(this.n));
    this.inputGroup1 = createDiv().parent(this.parentDiv).class("input-group");
    this.inputGroup2 = createDiv().parent(this.parentDiv).class("input-group");
    // input要素の上の部分
    createElement("span", "地点" + str(this.n) + "：")
      .parent(this.inputGroup1)
      .class("input-group-text");
    this.placeNameInput = createInput()
      .parent(this.inputGroup1)
      .class("form-control")
      .input(placeNameInputFunction);
    // input要素の下の部分
    createElement("span", "y方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.yInput = createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    createElement("span", "x方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.xInput = createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    createDiv("地点" + str(this.n) + "の名前、y方向、x方向を入力してください。")
      .parent(this.parentDiv)
      .class("form-text");
    // サブウィンドウ生成用のDOM
    this.placeDataInput = createA(
      "javascript:void(0)",
      "地点" + str(this.n) + "のデータを編集"
    )
      .class("btn btn-outline-primary mb-2")
      .parent("placePointDataInput")
      .id("placeDataInput" + str(this.n));
  }
}

// BicpemaCanvasControllerクラス
class BicpemaCanvasController {
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }

  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    let canvas, w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    if (this.is3D) {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL);
    } else {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio);
    }
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  resizeScreen() {
    const NAV_BAR = select("#navBar");
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}

// 3D座標系を描画するクラス
class CoordinateSystem {
  constructor(x = 500, y = 500, z = 500) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  line() {
    stroke(255, 0, 0);
    line(this.x, 0, 0, 0, 0, 0);
    stroke(0, 255, 0);
    line(0, this.y, 0, 0, 0, 0);
    stroke(0, 0, 255);
    line(0, 0, this.z, 0, 0, 0);
  }

  scale() {
    stroke(100, 100);
    for (let x = 50; x <= this.x; x += 50) {
      line(x, 0, 0, x, this.y, 0);
      line(x, 0, 0, x, 0, this.z);
    }
    for (let y = 50; y <= this.y; y += 50) {
      line(0, y, 0, this.x, y, 0);
      line(0, y, 0, 0, y, this.z);
    }
    for (let z = 50; z <= this.z; z += 50) {
      line(0, 0, z, this.x, 0, z);
      line(0, 0, z, 0, this.y, z);
    }
  }

  axisLabel(xLabel, yLabel, zLabel, size) {
    fill(0);
    textSize(size);
    push();
    translate(0, -size, 0);
    text(xLabel, this.x / 2, 0);
    pop();
    push();
    translate(-size, 0, 0);
    text(yLabel, 0, this.y / 2);
    pop();
    push();
    rotateY(PI / 2);
    translate(0, -size, 0);
    text(zLabel, -this.z / 2, 0);
    pop();
  }
}

// === ヘルパー関数 ===

// 地層の種類に応じてfillを設定する関数
function setStrataFill(kind, alpha) {
  switch (kind) {
    case "砂岩層":
      fill(215, 205, 166, alpha);
      break;
    case "泥岩層":
      fill(156, 154, 143, alpha);
      break;
    case "れき岩層":
      fill(252, 180, 172, alpha);
      break;
    case "石灰岩層":
      fill(120, 170, 170, alpha);
      break;
    case "凝灰岩層・火山灰層":
      fill(200, 200, 200, alpha);
      break;
    case "ローム層":
      fill(112, 58, 21, alpha);
      break;
    case "その他の層":
      fill(0, alpha);
      break;
    default:
      break;
  }
}

// 3点を結び平面を生成する関数
function createPlane1(x1, z1, y1, x2, z2, y2, x3, z3, y3) {
  beginShape();
  vertex(x1, y1, z1);
  vertex(x2, y2, z2);
  vertex(x3, y3, z3);
  endShape(CLOSE);
}

// 4点を結び平面を生成する関数
function createPlane2(x1, z1, y1, x2, z2, y2, x3, z3, y3, x4, z4, y4) {
  beginShape();
  vertex(x1, y1, z1);
  vertex(x2, y2, z2);
  vertex(x3, y3, z3);
  vertex(x4, y4, z4);
  endShape(CLOSE);
}

// スクリーンショットのダウンロード
function downloadImage(dataUrl) {
  const name = "screenshot.png";
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = name;
  a.click();
}

// === 初期化関数 ===

// settingInit関数: シミュレーションそのものの設定を行う
function settingInit() {
  canvasController = new BicpemaCanvasController(false, true);
  coordinateSystem = new CoordinateSystem(1000, 1000, 1000);
  canvasController.fullScreen();
  frameRate(60);
  textAlign(CENTER);
  textSize(20);
  camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
}

// elementSelectInit関数: 仮想DOMを読み込むための関数
function elementSelectInit() {
  buttonParent = select("#buttonParent");
  placeAddButton = select("#placeAddButton");
  placeRemoveButton = select("#placeRemoveButton");
  strataAddButton = select("#strataAddButton");
  strataRemoveButton = select("#strataRemoveButton");
  setRadioParent = select("#setRadioParent");
  setRadioButton = createRadio().parent(setRadioParent);
  unitSelect = select("#unitSelect");
  strataFileInput = createFileInput(strataFileInputFunction);
}

function elementPositionInit() {
  buttonParent.position(5, 65);
  placeAddButton.mousePressed(placeAddButtonFunction);
  placeRemoveButton.mousePressed(placeRemoveButtonFunction);
  strataAddButton.mousePressed(strataAddButtonFunction);
  strataRemoveButton.mousePressed(strataRemoveButtonFunction);
  setRadioButton.option("自動", "auto");
  setRadioButton.option("手動", "manual");
  setRadioButton.value("auto");
  setRadioButton.changed(setRadioButtonFunction);
  unitSelect.option("緯度・経度", "latlng");
  unitSelect.option("メートル", "meter");
  unitSelect.changed(unitSelectFunction);
  strataFileInput.position(0, buttonParent.y + buttonParent.height + 5);
}

function valueInit() {
  rotateTime = 0;
}

// === 主要関数 ===

// 緯度経度、深さの最小値と最大値を計算する関数
function calculateValue(setRadioButtonValue, unitSelectValue) {
  if (setRadioButtonValue === "auto") {
    let latitudeArr = [];
    let longitudeArr = [];
    let depthArr = [];
    for (let key in dataInputArr) {
      let value = dataInputArr[key];
      let data = value.data;
      let latitude = data.y.value();
      let longitude = data.x.value();
      latitudeArr.push(latitude !== "" ? latitude : 0);
      longitudeArr.push(longitude !== "" ? longitude : 0);
      let layer = value.layer;
      for (let i = 0; i < layer.length; i++) {
        depthArr.push(layer[i][0], layer[i][1]);
      }
    }
    xMin = min(longitudeArr);
    xMax = max(longitudeArr);
    if (xMin === Infinity) xMin = 0;
    if (xMax === -Infinity) xMax = 0;
    yMin = min(latitudeArr);
    yMax = max(latitudeArr);
    if (yMin === Infinity) yMin = 0;
    if (yMax === -Infinity) yMax = 0;
    zMin = min(depthArr);
    zMax = max(depthArr);
    if (zMin === Infinity) zMin = 0;
    if (zMax === -Infinity) zMax = 0;
    if (unitSelectValue === "meter") {
      let m = max(xMax, yMax);
      xMin = 0;
      xMax = m;
      yMin = 0;
      yMax = m;
    }
    let xLen = xMax - xMin;
    let yLen = yMax - yMin;
    let unitLen = max([xLen, yLen]);
    if (xLen <= yLen) {
      let addLenValue = (unitLen - xLen) / 2;
      xMin -= addLenValue;
      xMax += addLenValue;
    } else {
      let addLenValue = (unitLen - yLen) / 2;
      yMin -= addLenValue;
      yMax += addLenValue;
    }
  } else if (setRadioButtonValue === "manual") {
    let ele1 = select("#widthDirectionInput");
    let ele2 = select("#depthDirectionMaxInput");
    let ele3 = select("#depthDirectionMinInput");
    if (unitSelectValue === "meter") {
      xMin = 0;
      xMax = ele1.value();
      yMin = 0;
      yMax = ele1.value();
    }
    zMax = int(ele2.value());
    zMin = int(ele3.value());
  }
  return {
    x: { min: xMin, max: xMax },
    y: { min: yMin, max: yMax },
    z: { min: zMin, max: zMax },
  };
}

// 背景を設定する関数
function backgroundSetting(coordinateData) {
  let xMin = coordinateData.x.min;
  let xMax = coordinateData.x.max;
  let yMin = coordinateData.y.min;
  let yMax = coordinateData.y.max;
  let zMin = coordinateData.z.min;
  let zMax = coordinateData.z.max;
  background(240);
  strokeWeight(3);
  stroke(255, 0, 0);
  line(-500, 0, -500, 500, 0, -500);
  stroke(0, 255, 0);
  line(-500, 0, -500, -500, 500, -500);
  stroke(0, 0, 255);
  line(-500, 0, -500, -500, 0, 500);
  smooth();
  strokeWeight(1);
  stroke(170, 150);
  fill(0);
  for (let x = 0; x <= 1000; x += 50) {
    line(x - 500, 0, -500, x - 500, 500, -500);
    line(x - 500, 0, -500, x - 500, 0, 500);
    line(x - 500, 0, 500, x - 500, 500, 500);
    if (x % 100 === 0) {
      push();
      translate(-500, 0, 500);
      let xMap = map(x, 0, 1000, float(xMin), float(xMax));
      if (xMin === xMax) xMap = x / 100;
      text(nf(xMap, 1, 4), x, -10);
      pop();
    }
  }
  for (let z = 0; z <= 500; z += 50) {
    line(-500, z, -500, 500, z, -500);
    line(-500, z, -500, -500, z, 500);
    line(-500, z, 500, 500, z, 500);
    line(500, z, -500, 500, z, 500);
    if (z % 100 === 0) {
      push();
      translate(0, 0, -500);
      let zMap = map(z, 0, 500, zMin, zMax);
      if (zMin === zMax) zMap = z;
      text(nf(zMap, 1, 4), -500, z);
      pop();
    }
  }
  push();
  translate(0, 0, -500);
  text("深さ", -550, 250, 0);
  pop();
  for (let y = 0; y <= 1000; y += 50) {
    line(-500, 0, y - 500, 500, 0, y - 500);
    line(-500, 0, y - 500, -500, 500, y - 500);
    line(500, 0, y - 500, 500, 500, y - 500);
    if (y % 100 === 0) {
      push();
      let yMap = map(y, 1000, 0, yMin, yMax);
      if (yMin === yMax) yMap = (1000 - y) / 100;
      rotateY(PI / 2);
      translate(-y + 500, 0, 500);
      text(nf(yMap, 1, 4), 0, -10);
      pop();
    }
  }
  let x, y;
  if (unitSelect.value() === "latlng") {
    x = "経度";
    y = "緯度";
  } else {
    x = "x方向(m)";
    y = "y方向(m)";
  }
  push();
  translate(0, 0, 500);
  text(x, 0, -50);
  pop();
  push();
  rotateY(PI / 2);
  translate(0, -50, 500);
  text(y, 0, -10);
  pop();
}

// 子ウィンドウからデータを取得するための関数
function submit(arr) {
  let name = arr[0];
  let dataArr = arr[1];
  for (let key in dataInputArr) {
    let placeName = dataInputArr[key].name.value();
    if (placeName === "") placeName = key;
    if (placeName === name) {
      dataInputArr[key].layer = dataArr;
    }
  }
}

// input済みの地層データを引き継ぐ関数
function loadLayers(placeName) {
  let arrKey = placeName;
  for (let key in dataInputArr) {
    let a = dataInputArr[key].name.value();
    if (a === arrKey) {
      arrKey = key;
    }
  }
  let value = dataInputArr[arrKey];
  let layers = value.layer;
  return layers;
}

// 方角を描画する関数
function drawDirMark(x, y) {
  push();
  rotateX(PI / 2);
  strokeWeight(1);
  stroke(0);
  line(x + 50, y, x - 50, y);
  line(x + 20, y - 50, x - 20, y - 50);
  line(x, y - 100, x, +y + 100);
  line(x, y - 100, x - 20, y - 50);
  text("東", x + 70, y + 8);
  text("西", x - 70, y + 8);
  text("南", x, y + 70 + 60);
  text("北", x, y - 70 - 40);
  pop();
}

// 地層の平面を描画する処理
function drawStrata(key, rotateTime, coordinateData) {
  xMin = coordinateData.x.min;
  xMax = coordinateData.x.max;
  yMin = coordinateData.y.min;
  yMax = coordinateData.y.max;
  zMin = coordinateData.z.min;
  zMax = coordinateData.z.max;
  let name = dataInputArr[key].name.value();
  if (name === "") name = key;
  let data = dataInputArr[key].data;
  let x = data.x.value();
  if (x === "") x = 0;
  x = map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y === "") y = 0;
  y = map(y, yMin, yMax, 500, -500);
  let layer = dataInputArr[key].layer;
  noStroke();
  let zArr = [];
  for (let i = 0; i < layer.length; i++) {
    let z = layer[i][0];
    zArr.push(z);
    let zLength = layer[i][1] - layer[i][0];
    let kind = layer[i][2];
    setStrataFill(kind, 200);
    push();
    translate(
      x,
      map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2,
      y
    );
    box(50, map(zLength, 0, zMax - zMin, 0, 500), 50);
    translate(100, 10, 0);
    fill(0);
    text(kind, 0, 0);
    pop();
  }
  fill(0);
  push();
  translate(x, 0, y);
  rotateY(radians(rotateTime));
  translate(0, map(min(zArr), zMin, zMax, 0, 500) - 25, 0);
  if (min(zArr) > 0) {
    translate(0, -25, 0);
  }
  text(name, 0, -55);
  fill(255, 0, 0);
  cone(10, 50, 10, 3, true);
  pop();
}

function connectStrata() {
  let trNum = document.getElementById("strataSelect").childElementCount;
  let p1Name = select("#firstPlaceSelect").value();
  let p2Name = select("#secondPlaceSelect").value();
  let p3Name = select("#thirdPlaceSelect").value();
  if (p1Name != "-" && p2Name != "-" && p3Name != "-") {
    let p1 = [0, 0];
    let p2 = [0, 0];
    let p3 = [0, 0];
    for (let key in dataInputArr) {
      if (dataInputArr[key].name.value() === p1Name) {
        p1[0] = map(dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p1[1] = map(dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() === p2Name) {
        p2[0] = map(dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p2[1] = map(dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() === p3Name) {
        p3[0] = map(dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p3[1] = map(dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      }
    }
    for (let i = 0; i < trNum; i++) {
      let select1 = select("#select1-" + str(i + 1)).value();
      let select2 = select("#select2-" + str(i + 1)).value();
      let select3 = select("#select3-" + str(i + 1)).value();
      let select4 = select("#select4-" + str(i + 1)).value();
      if (select2 === "" || select3 === "" || select4 === "") {
        continue;
      }
      let p1Min = select2.substring(0, select2.indexOf("m-"));
      let p1Max = select2.substring(select2.indexOf("m-") + 2, select2.lastIndexOf("m"));
      let p2Min = select3.substring(0, select3.indexOf("m-"));
      let p2Max = select3.substring(select3.indexOf("m-") + 2, select3.lastIndexOf("m"));
      let p3Min = select4.substring(0, select4.indexOf("m-"));
      let p3Max = select4.substring(select4.indexOf("m-") + 2, select4.lastIndexOf("m"));

      setStrataFill(select1, 150);

      p1Min = map(p1Min, zMin, zMax, 0, 500);
      p1Max = map(p1Max, zMin, zMax, 0, 500);
      p2Min = map(p2Min, zMin, zMax, 0, 500);
      p2Max = map(p2Max, zMin, zMax, 0, 500);
      p3Min = map(p3Min, zMin, zMax, 0, 500);
      p3Max = map(p3Max, zMin, zMax, 0, 500);
      createPlane1(p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min);
      createPlane1(p1[0], p1[1], p1Max, p2[0], p2[1], p2Max, p3[0], p3[1], p3Max);
      createPlane2(p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p2[0], p2[1], p2Max, p1[0], p1[1], p1Max);
      createPlane2(p1[0], p1[1], p1Min, p3[0], p3[1], p3Min, p3[0], p3[1], p3Max, p1[0], p1[1], p1Max);
      createPlane2(p2[0], p2[1], p2Min, p3[0], p3[1], p3Min, p3[0], p3[1], p3Max, p2[0], p2[1], p2Max);
    }
  }
}

// === DOM操作関数 ===

// 地点データの追加ボタンを押した時に動く関数
function placeAddButtonFunction() {
  let placeNum = Object.keys(dataInputArr).length;
  let newPlaceNum = placeNum + 1;
  let newDom = new DOM(newPlaceNum);
  let placeName = "地点" + str(newPlaceNum);
  dataInputArr[placeName] = {
    name: newDom.placeNameInput,
    data: { x: newDom.xInput, y: newDom.yInput },
    edit: newDom.placeDataInput,
    layer: "",
  };
  document.getElementById("placeDataInput" + str(newPlaceNum)).onclick = () => {
    window.open(
      "/simulations/3d-strata-csv/setWindow.html?" + placeName,
      "window_name",
      "width=1000,height=500"
    );
  };
  placeRefreshFunction();
}

// 地点データの削除ボタンを押した時に動く関数
function placeRemoveButtonFunction() {
  let placeNum = Object.keys(dataInputArr).length;
  if (placeNum > 0) {
    select("#placeNameInput" + str(placeNum)).remove();
    select("#placeDataInput" + str(placeNum)).remove();
    delete dataInputArr["地点" + placeNum];
  }
  placeRefreshFunction();
}

// 平面を構成する地層の組を追加するボタンを押した時の処理
function strataAddButtonFunction() {
  let NextTrNum = document.getElementById("strataSelect").childElementCount + 1;
  let tr = createElement("tr").parent("strataSelect").id("tr-" + NextTrNum);
  let th = createElement("th", NextTrNum + "組目")
    .parent("tr-" + NextTrNum)
    .id("th-" + NextTrNum);
  let td1 = createElement("td").parent("tr-" + NextTrNum).id("td1-" + NextTrNum);
  let select1 = createSelect()
    .parent("td1-" + NextTrNum)
    .class("form-select")
    .id("select1-" + NextTrNum);
  document.getElementById("select1-" + NextTrNum).addEventListener("change", strataSelectFunction);
  const strataArr = [
    "砂岩層",
    "泥岩層",
    "れき岩層",
    "石灰岩層",
    "凝灰岩層・火山灰層",
    "ローム層",
    "その他の層",
  ];
  for (let i = 0; i < strataArr.length; i++) select1.option(strataArr[i]);
  createElement("td").parent("tr-" + NextTrNum).id("td2-" + NextTrNum);
  createSelect()
    .parent("td2-" + NextTrNum)
    .class("form-select")
    .id("select2-" + NextTrNum);
  createElement("td").parent("tr-" + NextTrNum).id("td3-" + NextTrNum);
  createSelect()
    .parent("td3-" + NextTrNum)
    .class("form-select")
    .id("select3-" + NextTrNum);
  createElement("td").parent("tr-" + NextTrNum).id("td4-" + NextTrNum);
  createSelect()
    .parent("td4-" + NextTrNum)
    .class("form-select")
    .id("select4-" + NextTrNum);
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 平面を構成する地層の組を削除するボタンを押した時の処理
function strataRemoveButtonFunction() {
  let strataSelect = document.getElementById("strataSelect");
  if (strataSelect.childElementCount > 0)
    strataSelect.removeChild(strataSelect.lastChild);
}

// 地点データが入力された時に動く関数
function placeNameInputFunction() {
  let placeNum = Object.keys(dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName === "") {
      placeName = place;
      dataInputArr[place].edit.html("地点" + str(i + 1) + "のデータを編集");
    } else {
      dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + str(i + 1)).onclick = () => {
      window.open(
        "/simulations/3d-strata-csv/setWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  }
  placeRefreshFunction();
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 地点セレクトの共通処理
function placeSelectFunction(placeSelectId, placeNameId, selectId) {
  let placeSelect = select("#" + placeSelectId);
  let placeNameEl = document.getElementById(placeNameId);
  placeNameEl.innerHTML = placeSelect.value();
  let placeName = placeNameEl.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(dataInputArr).length !== 0 && placeName !== "-") {
    let strataArr = dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById(selectId + "-" + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = select("#select1-" + str(i + 1)).value();
      let element = select("#" + selectId + "-" + str(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind === strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById(selectId + "-" + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する1つ目の地点のデータに関連する処理
function firstPlaceSelectFunction() {
  placeSelectFunction("firstPlaceSelect", "firstPlaceName", "select2");
}

// 平面を構成する2つ目の地点のデータに関連する処理
function secondPlaceSelectFunction() {
  placeSelectFunction("secondPlaceSelect", "secondPlaceName", "select3");
}

// 平面を構成する3つ目の地点のデータに関連する処理
function thirdPlaceSelectFunction() {
  placeSelectFunction("thirdPlaceSelect", "thirdPlaceName", "select4");
}

// 平面を構成する地層の種類が変わったときの処理
function strataSelectFunction() {
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 平面を構成する地点を更新する処理
function placeRefreshFunction() {
  let firstPlaceSelect = select("#firstPlaceSelect");
  let secondPlaceSelect = select("#secondPlaceSelect");
  let thirdPlaceSelect = select("#thirdPlaceSelect");
  let firstPlaceSelectDoc = document.getElementById("firstPlaceSelect");
  let secondPlaceSelectDoc = document.getElementById("secondPlaceSelect");
  let thirdPlaceSelectDoc = document.getElementById("thirdPlaceSelect");
  while (firstPlaceSelectDoc.childElementCount > 0) {
    firstPlaceSelectDoc.remove(0);
  }
  while (secondPlaceSelectDoc.childElementCount > 0) {
    secondPlaceSelectDoc.remove(0);
  }
  while (thirdPlaceSelectDoc.childElementCount > 0) {
    thirdPlaceSelectDoc.remove(0);
  }
  firstPlaceSelect.option("-");
  secondPlaceSelect.option("-");
  thirdPlaceSelect.option("-");
  let placeNum = Object.keys(dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName === "") {
      placeName = place;
    }
    firstPlaceSelect.option(placeName);
    secondPlaceSelect.option(placeName);
    thirdPlaceSelect.option(placeName);
  }
  firstPlaceSelectDoc.addEventListener("change", firstPlaceSelectFunction);
  secondPlaceSelectDoc.addEventListener("change", secondPlaceSelectFunction);
  thirdPlaceSelectDoc.addEventListener("change", thirdPlaceSelectFunction);
}

function setRadioButtonFunction() {
  let ele1 = document.getElementById("widthDirectionInput");
  let ele2 = document.getElementById("depthDirectionMaxInput");
  let ele3 = document.getElementById("depthDirectionMinInput");
  if (setRadioButton.value() === "auto") {
    ele1.value = "";
    ele2.value = "";
    ele3.value = "";
    ele1.disabled = true;
    ele2.disabled = true;
    ele3.disabled = true;
  } else if (setRadioButton.value() === "manual") {
    ele1.value = coordinateData.x.max;
    ele2.value = coordinateData.z.max;
    ele3.value = coordinateData.z.min;
    ele1.disabled = false;
    ele2.disabled = false;
    ele3.disabled = false;
  }
}

function unitSelectFunction() {
  if (unitSelect.value() === "latlng") {
    document.getElementById("setWidthParent").hidden = true;
  } else if (unitSelect.value() === "meter") {
    document.getElementById("setWidthParent").hidden = false;
  }
}

function strataFileInputFunction(file) {
  if (file.type === "text") {
    dataInputArr = {};
    let reader = new FileReader();
    reader.readAsArrayBuffer(file.file);
    reader.onload = function () {
      let decoder = new TextDecoder("shift-jis");
      let csvText = decoder.decode(reader.result);
      processCSV(csvText);
    };
  } else {
    console.log("テキストファイルではありません");
  }
}

function processCSV(csvText) {
  csvText = csvText.replace(/\r/g, "");
  let rows = csvText.split("\n").map((row) => row.split(","));
  let dataRows = rows.slice(1);
  let name_arr = [];
  let place_arr = [[], []];
  let test_data = {};
  let placeNum = 0;
  for (let i = 0; i < dataRows.length - 1; i++) {
    let data = dataRows[i];
    if (!name_arr.includes(data[0]) && data[0] !== "") {
      placeNum++;
      name_arr.push(data[0]);
      place_arr[0].push(parseFloat(data[1]));
      place_arr[1].push(parseFloat(data[2]));
      test_data["地点" + placeNum] = [];
    }
    test_data["地点" + placeNum].push([
      parseFloat(data[3]),
      parseFloat(data[4]),
      data[5],
    ]);
  }
  for (let i = 0; i < name_arr.length; i++) {
    placeAddButtonFunction();
    let el = document.getElementById("placeNameInput" + (i + 1));
    let pa1 = el.children[0];
    let pl = pa1.children[1];
    pl.value = name_arr[i];
    let pa2 = el.children[1];
    let vl = pa2.children;
    vl[1].value = place_arr[0][i];
    vl[3].value = place_arr[1][i];
    dataInputArr["地点" + (i + 1)].layer = test_data["地点" + (i + 1)];
  }
  placeNameInputFunction();
}

// === p5.jsスケッチ関数 ===

function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  // screenshotButtonの設定
  document.getElementById("screenshotButton").addEventListener("click", () => {
    html2canvas(document.body).then((canvas) => {
      downloadImage(canvas.toDataURL());
    });
  });
}

function draw() {
  background(255);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  if ($("#dataRegisterModal").is(":hidden")) {
    orbitControl();
  }

  // 緯度や経度、深さに応じてスケールを計算する
  coordinateData = calculateValue(setRadioButton.value(), unitSelect.value());

  // 計算したスケールを実際に適用
  backgroundSetting(coordinateData);

  // 方位の描画
  drawDirMark(-600, -600);

  // 地点名の回転
  rotateTime += 3;

  // それぞれの地点のボーリングデータの描画
  for (let key in dataInputArr) {
    drawStrata(key, rotateTime, coordinateData);
  }

  // それぞれの地層をつなぐ
  connectStrata();
}

function windowResized() {
  canvasController.resizeScreen();
}

// p5.jsのグローバルモードのためにwindowオブジェクトに公開
window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;

// 子ウィンドウから呼び出される関数を公開
window.submit = submit;
window.loadLayers = loadLayers;
window.placeRefreshFunction = placeRefreshFunction;
window.firstPlaceSelectFunction = firstPlaceSelectFunction;
window.secondPlaceSelectFunction = secondPlaceSelectFunction;
window.thirdPlaceSelectFunction = thirdPlaceSelectFunction;

