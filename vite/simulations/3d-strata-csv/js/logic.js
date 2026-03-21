import $ from "jquery";
import { state } from "./state.js";

/**
 * 緯度経度・深さの最小値と最大値を計算する関数
 * @param {*} p p5インスタンス。
 * @param {string} setRadioButtonValue スケール設定値（"auto" | "manual"）
 * @param {string} unitSelectValue 単位設定値（"latlng" | "meter"）
 * @returns {{x: {min, max}, y: {min, max}, z: {min, max}}}
 */
function calculateValue(p, setRadioButtonValue, unitSelectValue) {
  let xMin, xMax, yMin, yMax, zMin, zMax;
  if (setRadioButtonValue === "auto") {
    let latitudeArr = [];
    let longitudeArr = [];
    let depthArr = [];
    for (let key in state.dataInputArr) {
      let value = state.dataInputArr[key];
      let data = value.data;
      let latitude = data.y.value();
      let longitude = data.x.value();
      if (latitude !== "") {
        latitudeArr.push(latitude);
      } else {
        latitudeArr.push(0);
      }
      if (longitude !== "") {
        longitudeArr.push(longitude);
      } else {
        longitudeArr.push(0);
      }
      let layer = value.layer;
      for (let i = 0; i < layer.length; i++) {
        depthArr.push(layer[i][0], layer[i][1]);
      }
    }
    xMin = p.min(longitudeArr);
    xMax = p.max(longitudeArr);
    if (xMin === Infinity) xMin = 0;
    if (xMax === -Infinity) xMax = 0;
    yMin = p.min(latitudeArr);
    yMax = p.max(latitudeArr);
    if (yMin === Infinity) yMin = 0;
    if (yMax === -Infinity) yMax = 0;
    zMin = p.min(depthArr);
    zMax = p.max(depthArr);
    if (zMin == Infinity) zMin = 0;
    if (zMax == -Infinity) zMax = 0;
    if (unitSelectValue === "meter") {
      let m = p.max(xMax, yMax);
      xMin = 0;
      xMax = m;
      yMin = 0;
      yMax = m;
    }
    let xLen = xMax - xMin;
    let yLen = yMax - yMin;
    let unitLen = p.max([xLen, yLen]);
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
    let ele1 = p.select("#widthDirectionInput");
    let ele2 = p.select("#depthDirectionMaxInput");
    let ele3 = p.select("#depthDirectionMinInput");
    if (unitSelectValue === "meter") {
      xMin = 0;
      xMax = ele1.value();
      yMin = 0;
      yMax = ele1.value();
    }
    zMax = parseInt(ele2.value());
    zMin = parseInt(ele3.value());
  }
  return {
    x: { min: xMin, max: xMax },
    y: { min: yMin, max: yMax },
    z: { min: zMin, max: zMax },
  };
}

// 背景を設定する関数
function backgroundSetting(p, coordinateData) {
  let xMin = coordinateData.x.min;
  let xMax = coordinateData.x.max;
  let yMin = coordinateData.y.min;
  let yMax = coordinateData.y.max;
  let zMin = coordinateData.z.min;
  let zMax = coordinateData.z.max;
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
  let x, y;
  if (state.unitSelect.value() === "latlng") {
    x = "経度";
    y = "緯度";
  } else {
    x = "x方向(m)";
    y = "y方向(m)";
  }
  p.push();
  p.translate(0, 0, 500);
  p.text(x, 0, -50);
  p.pop();
  p.push();
  p.rotateY(p.PI / 2);
  p.translate(0, -50, 500);
  p.text(y, 0, -10);
  p.pop();
}

// 方角を描画する関数
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

// 地層の平面を描画する処理
function drawStrata(p, key, rotateTime, coordinateData) {
  let xMin = coordinateData.x.min;
  let xMax = coordinateData.x.max;
  let yMin = coordinateData.y.min;
  let yMax = coordinateData.y.max;
  let zMin = coordinateData.z.min;
  let zMax = coordinateData.z.max;
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
  p.noStroke();
  let zArr = [];
  for (let i = 0; i < layer.length; i++) {
    let z = layer[i][0];
    zArr.push(z);
    let zLength = layer[i][1] - layer[i][0];
    let kind = layer[i][2];
    switch (kind) {
      case "砂岩層":
        p.fill(215, 205, 166, 200);
        break;
      case "泥岩層":
        p.fill(156, 154, 143, 200);
        break;
      case "れき岩層":
        p.fill(252, 180, 172, 200);
        break;
      case "石灰岩層":
        p.fill(120, 170, 170, 200);
        break;
      case "凝灰岩層・火山灰層":
        p.fill(200, 200, 200, 200);
        break;
      case "ローム層":
        p.fill(112, 58, 21, 200);
        break;
      case "その他の層":
        p.fill(0, 200);
        break;
      default:
        break;
    }
    p.push();
    p.translate(
      x,
      p.map(z, zMin, zMax, 0, 500) +
        p.map(zLength, 0, zMax - zMin, 0, 500) / 2,
      y
    );
    p.box(50, p.map(zLength, 0, zMax - zMin, 0, 500), 50);
    p.translate(100, 10, 0);
    p.fill(0);
    p.text(kind, 0, 0);
    p.pop();
    p.fill(0);
    p.push();
    p.translate();
    p.text(
      kind,
      x,
      p.map(z, zMin, zMax, 0, 500) +
        p.map(zLength, 0, zMax - zMin, 0, 500) / 2
    );
    p.pop();
  }
  p.fill(0);
  p.push();
  p.translate(x, 0, y);
  p.rotateY(p.radians(rotateTime));
  p.translate(0, p.map(p.min(zArr), zMin, zMax, 0, 500) - 25, 0);
  if (p.min(zArr) > 0) {
    p.translate(0, -25, 0);
  }
  p.text(name, 0, -55);
  p.fill(255, 0, 0);
  p.cone(10, 50, 10, 3, true);
  p.pop();
}

// 地層の平面をつなぐ処理
function connectStrata(p) {
  let trNum = document.getElementById("strataSelect").childElementCount;
  let p1Name = p.select("#firstPlaceSelect").value();
  let p2Name = p.select("#secondPlaceSelect").value();
  let p3Name = p.select("#thirdPlaceSelect").value();
  if (p1Name != "-" && p2Name != "-" && p3Name != "-") {
    let xMin = state.coordinateData.x.min;
    let xMax = state.coordinateData.x.max;
    let yMin = state.coordinateData.y.min;
    let yMax = state.coordinateData.y.max;
    let zMin = state.coordinateData.z.min;
    let zMax = state.coordinateData.z.max;
    let p1 = [0, 0];
    let p2 = [0, 0];
    let p3 = [0, 0];
    for (let key in state.dataInputArr) {
      if (state.dataInputArr[key].name.value() === p1Name) {
        p1[0] = state.dataInputArr[key].data.x.value();
        p1[0] = p.map(p1[0], xMin, xMax, -500, 500);
        p1[1] = state.dataInputArr[key].data.y.value();
        p1[1] = p.map(p1[1], yMin, yMax, 500, -500);
      } else if (state.dataInputArr[key].name.value() === p2Name) {
        p2[0] = state.dataInputArr[key].data.x.value();
        p2[0] = p.map(p2[0], xMin, xMax, -500, 500);
        p2[1] = state.dataInputArr[key].data.y.value();
        p2[1] = p.map(p2[1], yMin, yMax, 500, -500);
      } else if (state.dataInputArr[key].name.value() === p3Name) {
        p3[0] = state.dataInputArr[key].data.x.value();
        p3[0] = p.map(p3[0], xMin, xMax, -500, 500);
        p3[1] = state.dataInputArr[key].data.y.value();
        p3[1] = p.map(p3[1], yMin, yMax, 500, -500);
      }
    }

    // ３点を結び平面を生成する関数
    const createPlane1 = (x1, z1, y1, x2, z2, y2, x3, z3, y3) => {
      p.beginShape();
      p.vertex(x1, y1, z1);
      p.vertex(x2, y2, z2);
      p.vertex(x3, y3, z3);
      p.endShape(p.CLOSE);
    };

    // ４点を結び平面を生成する関数
    const createPlane2 = (
      x1,
      z1,
      y1,
      x2,
      z2,
      y2,
      x3,
      z3,
      y3,
      x4,
      z4,
      y4
    ) => {
      p.beginShape();
      p.vertex(x1, y1, z1);
      p.vertex(x2, y2, z2);
      p.vertex(x3, y3, z3);
      p.vertex(x4, y4, z4);
      p.endShape(p.CLOSE);
    };

    for (let i = 0; i < trNum; i++) {
      let select1 = p.select("#select1-" + String(i + 1)).value();
      let select2 = p.select("#select2-" + String(i + 1)).value();
      let select3 = p.select("#select3-" + String(i + 1)).value();
      let select4 = p.select("#select4-" + String(i + 1)).value();
      if (select2 === "" || select3 === "" || select4 === "") {
        continue;
      }
      let p1Min = select2.substr(0, select2.indexOf("m-"));
      let p1Max = select2.substr(select2.indexOf("m-") + 2);
      p1Max = p1Max.substr(0, p1Max.indexOf("m"));
      let p2Min = select3.substr(0, select3.indexOf("m-"));
      let p2Max = select3.substr(select3.indexOf("m-") + 2);
      p2Max = p2Max.substr(0, p2Max.indexOf("m"));
      let p3Min = select4.substr(0, select4.indexOf("m-"));
      let p3Max = select4.substr(select4.indexOf("m-") + 2);
      p3Max = p3Max.substr(0, p3Max.indexOf("m"));

      switch (select1) {
        case "砂岩層":
          p.fill(215, 205, 166, 150);
          break;
        case "泥岩層":
          p.fill(156, 154, 143, 150);
          break;
        case "れき岩層":
          p.fill(252, 180, 172, 150);
          break;
        case "石灰岩層":
          p.fill(120, 170, 170, 150);
          break;
        case "凝灰岩層・火山灰層":
          p.fill(200, 200, 200, 150);
          break;
        case "ローム層":
          p.fill(112, 58, 21, 150);
          break;
        case "その他の層":
          p.fill(0, 150);
          break;
        default:
          break;
      }

      p1Min = p.map(p1Min, zMin, zMax, 0, 500);
      p1Max = p.map(p1Max, zMin, zMax, 0, 500);
      p2Min = p.map(p2Min, zMin, zMax, 0, 500);
      p2Max = p.map(p2Max, zMin, zMax, 0, 500);
      p3Min = p.map(p3Min, zMin, zMax, 0, 500);
      p3Max = p.map(p3Max, zMin, zMax, 0, 500);
      createPlane1(p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min);
      createPlane1(p1[0], p1[1], p1Max, p2[0], p2[1], p2Max, p3[0], p3[1], p3Max);
      createPlane2(
        p1[0], p1[1], p1Min,
        p2[0], p2[1], p2Min,
        p2[0], p2[1], p2Max,
        p1[0], p1[1], p1Max
      );
      createPlane2(
        p1[0], p1[1], p1Min,
        p3[0], p3[1], p3Min,
        p3[0], p3[1], p3Max,
        p1[0], p1[1], p1Max
      );
      createPlane2(
        p2[0], p2[1], p2Min,
        p3[0], p3[1], p3Min,
        p3[0], p3[1], p3Max,
        p2[0], p2[1], p2Max
      );
    }
  }
}

/**
 * シミュレーションの描画を行う関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  if ($("#dataRegisterModal").is(":hidden")) {
    p.orbitControl();
  }

  // 緯度や経度、深さに応じてスケールを計算する
  state.coordinateData = calculateValue(
    p,
    state.setRadioButton.value(),
    state.unitSelect.value()
  );

  // 計算したスケールを実際に適応
  backgroundSetting(p, state.coordinateData);
  // 方位の描画
  drawDirMark(p, -600, -600);

  // 地点名の回転
  state.rotateTime += 3;

  // それぞれの地点のボーリングデータの描画
  for (let key in state.dataInputArr) {
    drawStrata(p, key, state.rotateTime, state.coordinateData);
  }

  // それぞれの地層をつなぐ
  connectStrata(p);
}
