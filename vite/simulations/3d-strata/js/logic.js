import $ from "jquery";
import { state } from "./state.js";

const allSetData = {
  aSet: {
    layers: ["その他の層", "れき岩層"],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [-500, 95.29786617744429],
      [4.682823211423681, 291.78333494271374],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [267.85714285714283, 250],
        [339.2857142857143, 321.42857142857144],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [464.2857142857143, 321.42857142857144],
        [446.42857142857144, 339.2857142857143],
      ],
    ],
  },
  bSet: {
    layers: ["その他の層", "れき岩層"],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [4.682823211423681, 291.78333494271374],
      [500, 99.9645972129245],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [339.2857142857143, 321.42857142857144],
        [250, 232.14285714285714],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [446.42857142857144, 339.2857142857143],
        [375, 303.57142857142856],
      ],
    ],
  },
  cSet: {
    layers: ["その他の層", "ローム層", "れき岩層"],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [-484.2296675352107, -95.13694441755285],
      [-107.86585562126254, -150.97679508228043],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [71.42857142857143, 53.57142857142857],
        [160.71428571428572, 125],
      ],
      [
        [339.2857142857143, 321.42857142857144],
        [89.28571428571429, 71.42857142857143],
        [196.42857142857142, 160.71428571428572],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [160.71428571428572, 89.28571428571429],
        [285.7142857142857, 196.42857142857142],
      ],
    ],
  },
  dSet: {
    layers: ["その他の層", "ローム層", "れき岩層"],
    coordinates: [
      [-484.2296675352107, -95.13694441755285],
      [-449.11653953796264, -291.7833349424851],
      [-107.86585562126254, -150.97679508228043],
    ],
    ranges: [
      [
        [71.42857142857143, 53.57142857142857],
        [89.28571428571429, 71.42857142857143],
        [160.71428571428572, 125],
      ],
      [
        [89.28571428571429, 71.42857142857143],
        [142.85714285714286, 89.28571428571429],
        [196.42857142857142, 160.71428571428572],
      ],
      [
        [160.71428571428572, 89.28571428571429],
        [267.85714285714283, 142.85714285714286],
        [285.7142857142857, 196.42857142857142],
      ],
    ],
  },
};

function setFillByKind(p, kind, alpha) {
  switch (kind) {
    case "砂岩層":
      p.fill(215, 205, 166, alpha);
      break;
    case "泥岩層":
      p.fill(156, 154, 143, alpha);
      break;
    case "れき岩層":
      p.fill(252, 180, 172, alpha);
      break;
    case "石灰岩層":
      p.fill(120, 170, 170, alpha);
      break;
    case "凝灰岩層・火山灰層":
      p.fill(200, 200, 200, alpha);
      break;
    case "ローム層":
      p.fill(112, 58, 21, alpha);
      break;
    case "その他の層":
      p.fill(0, alpha);
      break;
    default:
      break;
  }
}

function calculateValue(p) {
  let latitudeArr = [];
  let longitudeArr = [];
  let depthArr = [];
  for (let key in state.dataInputArr) {
    let value = state.dataInputArr[key];
    let data = value.data;
    let latitude = data.y.value();
    let longitude = data.x.value();
    latitudeArr.push(latitude !== "" ? latitude : 0);
    longitudeArr.push(longitude !== "" ? longitude : 0);
    let layer = value.layer;
    if (Array.isArray(layer)) {
      for (let i = 0; i < layer.length; i++) {
        depthArr.push(layer[i][0], layer[i][1]);
      }
    }
  }

  let xMin = longitudeArr.length > 0 ? p.min(longitudeArr) : 0;
  let xMax = longitudeArr.length > 0 ? p.max(longitudeArr) : 0;
  if (xMin === Infinity) xMin = 0;
  if (xMax === -Infinity) xMax = 0;

  let yMin = latitudeArr.length > 0 ? p.min(latitudeArr) : 0;
  let yMax = latitudeArr.length > 0 ? p.max(latitudeArr) : 0;
  if (yMin === Infinity) yMin = 0;
  if (yMax === -Infinity) yMax = 0;

  let zMin = depthArr.length > 0 ? p.min(depthArr) : 0;
  let zMax = depthArr.length > 0 ? p.max(depthArr) : 0;
  if (zMin === Infinity) zMin = 0;
  if (zMax === -Infinity) zMax = 0;

  let xLen = xMax - xMin;
  let yLen = yMax - yMin;
  let unitLen = p.max([xLen, yLen]);
  if (xLen <= yLen) {
    let addLenValue = (unitLen - xLen) / 2;
    xMin -= addLenValue;
    xMax += addLenValue;
  } else {
    let addLenValue = (unitLen - yLen) / 2;
    yMin = parseFloat(yMin) - addLenValue;
    yMax = parseFloat(yMax) + addLenValue;
  }

  // 緊急的な措置としての変数の代入
  // 今後軸ラベルの最小値と最大値をスライダーで変更できる仕様に変える必要がある
  zMin = -53;

  return { xMin, xMax, yMin, yMax, zMin, zMax };
}

function backgroundSetting(p, xMin, xMax, yMin, yMax, zMin, zMax) {
  p.background(240);
  p.strokeWeight(3);
  // x軸
  p.stroke(255, 0, 0);
  p.line(-500, 0, -500, 500, 0, -500);
  // z軸
  p.stroke(0, 255, 0);
  p.line(-500, 0, -500, -500, 500, -500);
  // y軸
  p.stroke(0, 0, 255);
  p.line(-500, 0, -500, -500, 0, 500);
  // 格子線
  p.smooth();
  p.strokeWeight(1);
  p.stroke(170, 150);
  p.fill(0);
  for (let x = 0; x <= 1000; x += 50) {
    p.line(x - 500, 0, -500, x - 500, 500, -500);
    p.line(x - 500, 0, -500, x - 500, 0, 500);
    p.line(x - 500, 0, 500, x - 500, 500, 500);
    if (x % 100 === 0) {
      p.push();
      p.translate(-500, 0, 500);
      let xMap = p.map(x, 0, 1000, parseFloat(xMin), parseFloat(xMax));
      if (xMin === xMax) xMap = x / 100;
      p.text(p.nf(xMap, 1, 4), x, -10);
      p.pop();
    }
  }
  p.push();
  p.translate(0, 0, 500);
  p.text("経度", 0, -50);
  p.pop();

  for (let z = 0; z <= 500; z += 50) {
    p.line(-500, z, -500, 500, z, -500);
    p.line(-500, z, -500, -500, z, 500);
    p.line(-500, z, 500, 500, z, 500);
    p.line(500, z, -500, 500, z, 500);
    if (z % 100 === 0) {
      p.push();
      p.translate(0, 0, -500);
      let zMap = p.map(z, 0, 500, zMin, zMax);
      if (zMin === zMax) zMap = z;
      p.text(p.nf(zMap, 1, 4), -500, z);
      p.pop();
    }
  }
  p.push();
  p.translate(0, 0, -500);
  p.text("深さ", -550, 250, 0);
  p.pop();

  for (let y = 0; y <= 1000; y += 50) {
    p.line(-500, 0, y - 500, 500, 0, y - 500);
    p.line(-500, 0, y - 500, -500, 500, y - 500);
    p.line(500, 0, y - 500, 500, 500, y - 500);
    if (y % 100 === 0) {
      p.push();
      let yMap = p.map(y, 1000, 0, yMin, yMax);
      if (yMin === yMax) yMap = (1000 - y) / 100;
      p.rotateY(p.PI / 2);
      p.translate(-y + 500, 0, 500);
      p.text(p.nf(yMap, 1, 4), 0, -10);
      p.pop();
    }
  }
  p.push();
  p.rotateY(p.PI / 2);
  p.translate(0, -50, 500);
  p.text("緯度", 0, -10);
  p.pop();
}

function drawDirMark(p, x, y) {
  p.push();
  p.rotateX(p.PI / 2);
  p.strokeWeight(1);
  p.stroke(0);
  p.line(x + 50, y, x - 50, y);
  p.line(x + 20, y - 50, x - 20, y - 50);
  p.line(x, y - 100, x, +y + 100);
  p.line(x, y - 100, x - 20, y - 50);
  p.text("東", x + 70, y + 8);
  p.text("西", x - 70, y + 8);
  p.text("南", x, y + 70 + 60);
  p.text("北", x, y - 70 - 40);
  p.pop();
}

function drawStrata(p, key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax) {
  let name = state.dataInputArr[key].name.value();
  if (name === "") name = key;
  let data = state.dataInputArr[key].data;
  let x = data.x.value();
  if (x === "") x = 0;
  x = p.map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y === "") y = 0;
  y = p.map(y, yMin, yMax, 500, -500);
  let layer = state.dataInputArr[key].layer;
  if (!Array.isArray(layer)) {
    p.push();
    p.fill(0);
    p.translate(x, -25, y);
    p.rotateY(p.radians(rotateTime));
    p.text(name, 0, -55);
    p.fill(255, 0, 0);
    p.cone(10, 50, 10, 3, true);
    p.pop();
    return;
  }
  p.noStroke();
  let zArr = [];
  for (let i = 0; i < layer.length; i++) {
    let z = layer[i][0];
    zArr.push(z);
    let zLength = layer[i][1] - layer[i][0];
    let kind = layer[i][2];
    setFillByKind(p, kind, 200);
    p.push();
    p.translate(
      x,
      p.map(z, zMin, zMax, 0, 500) + p.map(zLength, 0, zMax - zMin, 0, 500) / 2,
      y
    );
    p.box(50, p.map(zLength, 0, zMax - zMin, 0, 500), 50);
    p.translate(100, 10, 0);
    p.fill(0);
    p.text(kind, 0, 0);
    p.pop();
    p.fill(0);
    p.push();
    p.text(
      kind,
      x,
      p.map(z, zMin, zMax, 0, 500) + p.map(zLength, 0, zMax - zMin, 0, 500) / 2
    );
    p.pop();
  }
  p.fill(0);
  p.push();
  p.translate(x, 0, y);
  p.rotateY(p.radians(rotateTime));
  if (zArr.length > 0 && p.min(zArr) < 0) {
    p.translate(0, p.map(p.min(zArr), zMin, zMax, 0, 500) - 25, 0);
  } else {
    p.translate(0, -25, 0);
  }
  p.text(name, 0, -55);
  p.fill(255, 0, 0);
  p.cone(10, 50, 10, 3, true);
  p.pop();
}

function createPlane1(p, x1, z1, y1, x2, z2, y2, x3, z3, y3) {
  p.beginShape();
  p.vertex(x1, y1, z1);
  p.vertex(x2, y2, z2);
  p.vertex(x3, y3, z3);
  p.endShape(p.CLOSE);
}

function createPlane2(p, x1, z1, y1, x2, z2, y2, x3, z3, y3, x4, z4, y4) {
  p.beginShape();
  p.vertex(x1, y1, z1);
  p.vertex(x2, y2, z2);
  p.vertex(x3, y3, z3);
  p.vertex(x4, y4, z4);
  p.endShape(p.CLOSE);
}

function connectStrata(p, xMin, xMax, yMin, yMax, zMin, zMax) {
  let trNum = document.getElementById("strataSelect").childElementCount;
  let p1Name = p.select("#firstPlaceSelect").value();
  let p2Name = p.select("#secondPlaceSelect").value();
  let p3Name = p.select("#thirdPlaceSelect").value();
  if (p1Name !== "-" && p2Name !== "-" && p3Name !== "-") {
    let p1 = [0, 0];
    let p2 = [0, 0];
    let p3 = [0, 0];
    for (let key in state.dataInputArr) {
      let nameVal = state.dataInputArr[key].name.value();
      if (nameVal === p1Name) {
        p1[0] = p.map(state.dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p1[1] = p.map(state.dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      } else if (nameVal === p2Name) {
        p2[0] = p.map(state.dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p2[1] = p.map(state.dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      } else if (nameVal === p3Name) {
        p3[0] = p.map(state.dataInputArr[key].data.x.value(), xMin, xMax, -500, 500);
        p3[1] = p.map(state.dataInputArr[key].data.y.value(), yMin, yMax, 500, -500);
      }
    }
    for (let i = 0; i < trNum; i++) {
      let select1 = p.select("#select1-" + String(i + 1)).value();
      let select2 = p.select("#select2-" + String(i + 1)).value();
      let select3 = p.select("#select3-" + String(i + 1)).value();
      let select4 = p.select("#select4-" + String(i + 1)).value();
      if (select2 === "" || select3 === "" || select4 === "") continue;

      let p1MinStr = select2.substr(0, select2.indexOf("m-"));
      let p1MaxStr = select2.substr(select2.indexOf("m-") + 2);
      p1MaxStr = p1MaxStr.substr(0, p1MaxStr.indexOf("m"));
      let p2MinStr = select3.substr(0, select3.indexOf("m-"));
      let p2MaxStr = select3.substr(select3.indexOf("m-") + 2);
      p2MaxStr = p2MaxStr.substr(0, p2MaxStr.indexOf("m"));
      let p3MinStr = select4.substr(0, select4.indexOf("m-"));
      let p3MaxStr = select4.substr(select4.indexOf("m-") + 2);
      p3MaxStr = p3MaxStr.substr(0, p3MaxStr.indexOf("m"));

      setFillByKind(p, select1, 150);

      let p1Min = p.map(p1MinStr, zMin, zMax, 0, 500);
      let p1Max = p.map(p1MaxStr, zMin, zMax, 0, 500);
      let p2Min = p.map(p2MinStr, zMin, zMax, 0, 500);
      let p2Max = p.map(p2MaxStr, zMin, zMax, 0, 500);
      let p3Min = p.map(p3MinStr, zMin, zMax, 0, 500);
      let p3Max = p.map(p3MaxStr, zMin, zMax, 0, 500);

      createPlane1(p, p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min);
      createPlane1(p, p1[0], p1[1], p1Max, p2[0], p2[1], p2Max, p3[0], p3[1], p3Max);
      createPlane2(p, p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p2[0], p2[1], p2Max, p1[0], p1[1], p1Max);
      createPlane2(p, p1[0], p1[1], p1Min, p3[0], p3[1], p3Min, p3[0], p3[1], p3Max, p1[0], p1[1], p1Max);
      createPlane2(p, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min, p3[0], p3[1], p3Max, p2[0], p2[1], p2Max);
    }
  }
}

function drawAllSet(p, zMin, zMax) {
  for (let key in allSetData) {
    let layers = allSetData[key].layers;
    let coordinates = allSetData[key].coordinates;
    let ranges = allSetData[key].ranges;
    let pt1 = coordinates[0];
    let pt2 = coordinates[1];
    let pt3 = coordinates[2];
    for (let i = 0; i < layers.length; i++) {
      let layer = layers[i];
      let range = ranges[i];
      let p1Max = range[0][0];
      let p1Min = range[0][1];
      let p2Max = range[1][0];
      let p2Min = range[1][1];
      let p3Max = range[2][0];
      let p3Min = range[2][1];
      setFillByKind(p, layer, 150);
      createPlane1(p, pt1[0], pt1[1], p1Min, pt2[0], pt2[1], p2Min, pt3[0], pt3[1], p3Min);
      createPlane1(p, pt1[0], pt1[1], p1Max, pt2[0], pt2[1], p2Max, pt3[0], pt3[1], p3Max);
      createPlane2(p, pt1[0], pt1[1], p1Min, pt2[0], pt2[1], p2Min, pt2[0], pt2[1], p2Max, pt1[0], pt1[1], p1Max);
      createPlane2(p, pt1[0], pt1[1], p1Min, pt3[0], pt3[1], p3Min, pt3[0], pt3[1], p3Max, pt1[0], pt1[1], p1Max);
      createPlane2(p, pt2[0], pt2[1], p2Min, pt3[0], pt3[1], p3Min, pt3[0], pt3[1], p3Max, pt2[0], pt2[1], p2Max);
    }
  }
}

/**
 * シミュレーションの描画を行う関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  const { xMin, xMax, yMin, yMax, zMin, zMax } = calculateValue(p);
  backgroundSetting(p, xMin, xMax, yMin, yMax, zMin, zMax);
  drawDirMark(p, -600, -600);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  if ($("#dataRegisterModal").is(":hidden")) {
    p.orbitControl(2);
  }

  state.rotateTime += 2;
  for (let key in state.dataInputArr) {
    drawStrata(p, key, state.rotateTime, xMin, xMax, yMin, yMax, zMin, zMax);
  }

  connectStrata(p, xMin, xMax, yMin, yMax, zMin, zMax);

  if (state.allSetIs) {
    drawAllSet(p, zMin, zMax);
  }
}
