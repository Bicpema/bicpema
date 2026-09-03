// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state, STRATA_COLORS, ALL_SET_DATA } from "./state.js";
import { computeCoordinateBounds } from "./physics.js";

/**
 * 地層の種類に応じたfill()を適用する。該当する種類がない場合は何もしない（直前のfill状態を維持する）。
 * @param {*} p p5インスタンス
 * @param {string} kind 地層の種類
 * @param {number} alpha 不透明度
 */
function applyStrataFill(p, kind, alpha) {
  const color = STRATA_COLORS[kind];
  if (color) {
    p.fill(color[0], color[1], color[2], alpha);
  }
}

/**
 * 緯度経度、深さの最小値と最大値を計算する。
 * @returns {{x: {min:number,max:number}, y: {min:number,max:number}, z: {min:number,max:number}}}
 */
function calculateValue() {
  const latitudeArr = [];
  const longitudeArr = [];
  const depthArr = [];
  for (const key in state.dataInputArr) {
    const value = state.dataInputArr[key];
    const data = value.data;
    const latitude = data.y.value();
    latitudeArr.push(latitude != "" ? latitude : 0);
    const longitude = data.x.value();
    longitudeArr.push(longitude != "" ? longitude : 0);
    const layer = value.layer;
    for (let i = 0; i < layer.length; i++) {
      depthArr.push(layer[i][0], layer[i][1]);
    }
  }
  return {
    x: computeCoordinateBounds(longitudeArr),
    y: computeCoordinateBounds(latitudeArr),
    z: computeCoordinateBounds(depthArr),
  };
}

/**
 * 背景（座標軸・格子線・ラベル）を描画する。
 * @param {*} p p5インスタンス
 */
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
    if (x % 100 == 0) {
      p.push();
      p.translate(-500, 0, 500);
      let xMap = p.map(x, 0, 1000, p.float(xMin), p.float(xMax));
      if (xMin == xMax) xMap = x / 100;
      if (state.jaFont) p.text(p.nf(xMap, 1, 4), x, -10);
      p.pop();
    }
  }
  p.push();
  p.translate(0, 0, 500);
  if (state.jaFont) p.text("経度", 0, -50);
  p.pop();

  for (let z = 0; z <= 500; z += 50) {
    p.line(-500, z, -500, 500, z, -500);
    p.line(-500, z, -500, -500, z, 500);
    p.line(-500, z, 500, 500, z, 500);
    p.line(500, z, -500, 500, z, 500);
    if (z % 100 == 0) {
      p.push();
      p.translate(0, 0, -500);
      let zMap = p.map(z, 0, 500, zMin, zMax);
      if (zMin == zMax) zMap = z;
      if (state.jaFont) p.text(p.nf(zMap, 1, 4), -500, z);
      p.pop();
    }
  }
  p.push();
  p.translate(0, 0, -500);
  if (state.jaFont) p.text("深さ", -550, 250, 0);
  p.pop();
  for (let y = 0; y <= 1000; y += 50) {
    p.line(-500, 0, y - 500, 500, 0, y - 500);
    p.line(-500, 0, y - 500, -500, 500, y - 500);
    p.line(500, 0, y - 500, 500, 500, y - 500);
    if (y % 100 == 0) {
      p.push();
      let yMap = p.map(y, 1000, 0, yMin, yMax);
      if (yMin == yMax) yMap = (1000 - y) / 100;
      p.rotateY(p.PI / 2);
      p.translate(-y + 500, 0, 500);
      if (state.jaFont) p.text(p.nf(yMap, 1, 4), 0, -10);
      p.pop();
    }
  }
  p.push();
  p.rotateY(p.PI / 2);
  p.translate(0, -50, 500);
  if (state.jaFont) p.text("緯度", 0, -10);
  p.pop();
}

/**
 * 方角を描画する。
 * @param {*} p p5インスタンス
 */
function drawDirMark(p, x, y) {
  p.push();
  p.rotateX(p.PI / 2);
  p.strokeWeight(1);
  p.stroke(0);
  p.line(x + 50, y, x - 50, y);
  p.line(x + 20, y - 50, x - 20, y - 50);
  p.line(x, y - 100, x, y + 100);
  p.line(x, y - 100, x - 20, y - 50);
  if (state.jaFont) {
    p.text("東", x + 70, y + 8);
    p.text("西", x - 70, y + 8);
    p.text("南", x, y + 70 + 60);
    p.text("北", x, y - 70 - 40);
  }
  p.pop();
}

/**
 * ３点を結び平面を生成する。
 * @param {*} p p5インスタンス
 */
function createPlane1(p, x1, z1, y1, x2, z2, y2, x3, z3, y3) {
  p.beginShape();
  p.vertex(x1, y1, z1);
  p.vertex(x2, y2, z2);
  p.vertex(x3, y3, z3);
  p.endShape(p.CLOSE);
}

/**
 * ４点を結び平面を生成する。
 * @param {*} p p5インスタンス
 */
function createPlane2(p, x1, z1, y1, x2, z2, y2, x3, z3, y3, x4, z4, y4) {
  p.beginShape();
  p.vertex(x1, y1, z1);
  p.vertex(x2, y2, z2);
  p.vertex(x3, y3, z3);
  p.vertex(x4, y4, z4);
  p.endShape(p.CLOSE);
}

/**
 * 1地点分の地層の柱状図を描画する。
 * @param {*} p p5インスタンス
 */
function drawStrata(p, key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax) {
  let name = state.dataInputArr[key].name.value();
  if (name == "") name = key;
  const data = state.dataInputArr[key].data;
  let x = data.x.value();
  if (x == "") x = 0;
  x = p.map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y == "") y = 0;
  y = p.map(y, yMin, yMax, 500, -500);
  const layer = state.dataInputArr[key].layer;
  p.noStroke();
  const zArr = [];
  for (let i = 0; i < layer.length; i++) {
    const z = layer[i][0];
    zArr.push(z);
    const zLength = layer[i][1] - layer[i][0];
    const kind = layer[i][2];
    applyStrataFill(p, kind, 200);
    p.push();
    p.translate(
      x,
      p.map(z, zMin, zMax, 0, 500) + p.map(zLength, 0, zMax - zMin, 0, 500) / 2,
      y
    );
    p.box(50, p.map(zLength, 0, zMax - zMin, 0, 500), 50);
    p.translate(100, 10, 0);
    p.fill(0);
    if (state.jaFont) p.text(kind, 0, 0);
    p.pop();
    p.fill(0);
    p.push();
    if (state.jaFont) {
      p.text(
        kind,
        x,
        p.map(z, zMin, zMax, 0, 500) +
          p.map(zLength, 0, zMax - zMin, 0, 500) / 2
      );
    }
    p.pop();
  }
  p.fill(0);
  p.push();
  p.translate(x, 0, y);
  p.rotateY(p.radians(rotateTime));
  if (p.min(zArr) < 0) {
    p.translate(0, p.map(p.min(zArr), zMin, zMax, 0, 500) - 25, 0);
  } else {
    p.translate(0, -25, 0);
  }
  if (state.jaFont) p.text(name, 0, -55);
  p.fill(255, 0, 0);
  p.cone(10, 50, 10, 3, true);
  p.pop();
}

/**
 * 選択中の3地点を結ぶ平面（層ごとの直方体）を描画する。
 * @param {*} p p5インスタンス
 */
function drawSelectedPlanes(p, xMin, xMax, yMin, yMax, zMin, zMax) {
  const trNum = document.getElementById("strataSelect").childElementCount;
  const p1Name = p.select("#firstPlaceSelect").value();
  const p2Name = p.select("#secondPlaceSelect").value();
  const p3Name = p.select("#thirdPlaceSelect").value();
  if (p1Name == "-" || p2Name == "-" || p3Name == "-") return;

  const p1 = [0, 0];
  const p2 = [0, 0];
  const p3 = [0, 0];
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == p1Name) {
      p1[0] = p.map(
        state.dataInputArr[key].data.x.value(),
        xMin,
        xMax,
        -500,
        500
      );
      p1[1] = p.map(
        state.dataInputArr[key].data.y.value(),
        yMin,
        yMax,
        500,
        -500
      );
    } else if (state.dataInputArr[key].name.value() == p2Name) {
      p2[0] = p.map(
        state.dataInputArr[key].data.x.value(),
        xMin,
        xMax,
        -500,
        500
      );
      p2[1] = p.map(
        state.dataInputArr[key].data.y.value(),
        yMin,
        yMax,
        500,
        -500
      );
    } else if (state.dataInputArr[key].name.value() == p3Name) {
      p3[0] = p.map(
        state.dataInputArr[key].data.x.value(),
        xMin,
        xMax,
        -500,
        500
      );
      p3[1] = p.map(
        state.dataInputArr[key].data.y.value(),
        yMin,
        yMax,
        500,
        -500
      );
    }
  }
  for (let i = 0; i < trNum; i++) {
    const select1 = p.select("#select1-" + (i + 1)).value();
    const select2 = p.select("#select2-" + (i + 1)).value();
    const select3 = p.select("#select3-" + (i + 1)).value();
    const select4 = p.select("#select4-" + (i + 1)).value();
    if (select2 == "" || select3 == "" || select4 == "") {
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

    p1Min = p.map(p1Min, zMin, zMax, 0, 500);
    p1Max = p.map(p1Max, zMin, zMax, 0, 500);
    p2Min = p.map(p2Min, zMin, zMax, 0, 500);
    p2Max = p.map(p2Max, zMin, zMax, 0, 500);
    p3Min = p.map(p3Min, zMin, zMax, 0, 500);
    p3Max = p.map(p3Max, zMin, zMax, 0, 500);

    applyStrataFill(p, select1, 150);
    createPlane1(
      p,
      p1[0],
      p1[1],
      p1Min,
      p2[0],
      p2[1],
      p2Min,
      p3[0],
      p3[1],
      p3Min
    );
    createPlane1(
      p,
      p1[0],
      p1[1],
      p1Max,
      p2[0],
      p2[1],
      p2Max,
      p3[0],
      p3[1],
      p3Max
    );
    createPlane2(
      p,
      p1[0],
      p1[1],
      p1Min,
      p2[0],
      p2[1],
      p2Min,
      p2[0],
      p2[1],
      p2Max,
      p1[0],
      p1[1],
      p1Max
    );
    createPlane2(
      p,
      p1[0],
      p1[1],
      p1Min,
      p3[0],
      p3[1],
      p3Min,
      p3[0],
      p3[1],
      p3Max,
      p1[0],
      p1[1],
      p1Max
    );
    createPlane2(
      p,
      p2[0],
      p2[1],
      p2Min,
      p3[0],
      p3[1],
      p3Min,
      p3[0],
      p3[1],
      p3Max,
      p2[0],
      p2[1],
      p2Max
    );
  }
}

/**
 * 「全体」ボタン用の固定平面を描画する。
 * @param {*} p p5インスタンス
 */
function drawAllSetPlanes(p) {
  for (const key in ALL_SET_DATA) {
    const { layers, coordinates, ranges } = ALL_SET_DATA[key];
    const p1 = coordinates[0];
    const p2 = coordinates[1];
    const p3 = coordinates[2];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const range = ranges[i];
      const p1Max = range[0][0];
      const p1Min = range[0][1];
      const p2Max = range[1][0];
      const p2Min = range[1][1];
      const p3Max = range[2][0];
      const p3Min = range[2][1];
      applyStrataFill(p, layer, 150);
      createPlane1(
        p,
        p1[0],
        p1[1],
        p1Min,
        p2[0],
        p2[1],
        p2Min,
        p3[0],
        p3[1],
        p3Min
      );
      createPlane1(
        p,
        p1[0],
        p1[1],
        p1Max,
        p2[0],
        p2[1],
        p2Max,
        p3[0],
        p3[1],
        p3Max
      );
      createPlane2(
        p,
        p1[0],
        p1[1],
        p1Min,
        p2[0],
        p2[1],
        p2Min,
        p2[0],
        p2[1],
        p2Max,
        p1[0],
        p1[1],
        p1Max
      );
      createPlane2(
        p,
        p1[0],
        p1[1],
        p1Min,
        p3[0],
        p3[1],
        p3Min,
        p3[0],
        p3[1],
        p3Max,
        p1[0],
        p1[1],
        p1Max
      );
      createPlane2(
        p,
        p2[0],
        p2[1],
        p2Min,
        p3[0],
        p3[1],
        p3Min,
        p3[0],
        p3[1],
        p3Max,
        p2[0],
        p2[1],
        p2Max
      );
    }
  }
}

/**
 * シミュレーションの描画を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  const coordinateData = calculateValue();
  let xMin = coordinateData.x.min;
  if (xMin == Infinity) xMin = 0;
  let xMax = coordinateData.x.max;
  if (xMax == -Infinity) xMax = 0;
  const xLen = xMax - xMin;
  let yMin = coordinateData.y.min;
  if (yMin == Infinity) yMin = 0;
  let yMax = coordinateData.y.max;
  if (yMax == -Infinity) yMax = 0;
  const yLen = yMax - yMin;
  const unitLen = p.max([xLen, yLen]);
  if (xLen <= yLen) {
    const addLenValue = (unitLen - xLen) / 2;
    xMin -= addLenValue;
    xMax += addLenValue;
  } else {
    const addLenValue = (unitLen - yLen) / 2;
    yMin = p.float(yMin);
    yMin -= addLenValue;
    yMax = p.float(yMax);
    yMax += addLenValue;
  }
  let zMin = coordinateData.z.min;
  if (zMin == Infinity) zMin = 0;
  // 緊急的な措置としての変数の代入
  // 今後軸ラベルの最小値と最大値をスライダーで変更できる仕様に変える必要がある
  zMin = -53;
  let zMax = coordinateData.z.max;
  if (zMax == -Infinity) zMax = 0;
  backgroundSetting(p, xMin, xMax, yMin, yMax, zMin, zMax);
  drawDirMark(p, -600, -600);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  const modalIs = document
    .getElementById("dataRegisterModal")
    .classList.contains("hidden");
  if (modalIs) {
    p.orbitControl(2);
  }

  state.rotateTime += 2;
  for (const key in state.dataInputArr) {
    drawStrata(p, key, state.rotateTime, xMin, xMax, yMin, yMax, zMin, zMax);
  }

  drawSelectedPlanes(p, xMin, xMax, yMin, yMax, zMin, zMax);

  if (state.allSetIs) {
    drawAllSetPlanes(p);
  }
}
