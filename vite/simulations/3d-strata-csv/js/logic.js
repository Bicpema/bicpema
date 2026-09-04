// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import { state, STRATA_COLORS } from "./state.js";
import { computeCoordinateBounds, computeSquareBounds } from "./physics.js";

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
 * x方向・y方向・深さの表示範囲を計算する。
 * 「手動」設定時は直前の値を引き継ぐため、結果をstateに書き込む。
 * @param {*} p p5インスタンス
 * @returns {{x: {min:number,max:number}, y: {min:number,max:number}, z: {min:number,max:number}}}
 */
function calculateValue(p) {
  const setRadioButtonValue = state.setRadioButton.value();
  const unitSelectValue = state.unitSelect.value();
  if (setRadioButtonValue === "auto") {
    const latitudeArr = [];
    const longitudeArr = [];
    const depthArr = [];
    for (const key in state.dataInputArr) {
      const value = state.dataInputArr[key];
      const data = value.data;
      // input要素のvalue()は文字列を返すため、min/max比較が文字列比較になる
      // （例: "9" > "10"）のを避けるためNumber()で数値に正規化する。
      const latitude = data.y.value();
      latitudeArr.push(latitude !== "" ? Number(latitude) : 0);
      const longitude = data.x.value();
      longitudeArr.push(longitude !== "" ? Number(longitude) : 0);
      const layer = value.layer;
      for (let i = 0; i < layer.length; i++) {
        depthArr.push(layer[i][0], layer[i][1]);
      }
    }
    ({ min: state.xMin, max: state.xMax } =
      computeCoordinateBounds(longitudeArr));
    ({ min: state.yMin, max: state.yMax } =
      computeCoordinateBounds(latitudeArr));
    ({ min: state.zMin, max: state.zMax } = computeCoordinateBounds(depthArr));
    if (unitSelectValue === "meter") {
      const m = p.max(state.xMax, state.yMax);
      state.xMin = 0;
      state.xMax = m;
      state.yMin = 0;
      state.yMax = m;
    }
    ({
      xMin: state.xMin,
      xMax: state.xMax,
      yMin: state.yMin,
      yMax: state.yMax,
    } = computeSquareBounds(state.xMin, state.xMax, state.yMin, state.yMax));
  } else if (setRadioButtonValue === "manual") {
    const ele1 = p.select("#widthDirectionInput");
    const ele2 = p.select("#depthDirectionMaxInput");
    const ele3 = p.select("#depthDirectionMinInput");
    if (unitSelectValue === "meter") {
      // widthDirectionInputのvalue()は文字列を返すため、他の経路（auto時の
      // computeCoordinateBounds等）と型を揃えて数値として保持する。
      state.xMin = 0;
      state.xMax = p.float(ele1.value());
      state.yMin = 0;
      state.yMax = p.float(ele1.value());
    }
    state.zMax = p.int(ele2.value());
    state.zMin = p.int(ele3.value());
  }
  return {
    x: { min: state.xMin, max: state.xMax },
    y: { min: state.yMin, max: state.yMax },
    z: { min: state.zMin, max: state.zMax },
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
    if (x % 100 === 0) {
      p.push();
      p.translate(-500, 0, 500);
      let xMap = p.map(x, 0, 1000, p.float(xMin), p.float(xMax));
      if (xMin === xMax) xMap = x / 100;
      if (state.jaFont) p.text(p.nf(xMap, 1, 4), x, -10);
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
    if (y % 100 === 0) {
      p.push();
      let yMap = p.map(y, 1000, 0, yMin, yMax);
      if (yMin === yMax) yMap = (1000 - y) / 100;
      p.rotateY(p.PI / 2);
      p.translate(-y + 500, 0, 500);
      if (state.jaFont) p.text(p.nf(yMap, 1, 4), 0, -10);
      p.pop();
    }
  }

  let xLabel, yLabel;
  if (state.unitSelect.value() === "latlng") {
    xLabel = "経度";
    yLabel = "緯度";
  } else {
    xLabel = "x方向(m)";
    yLabel = "y方向(m)";
  }
  p.push();
  p.translate(0, 0, 500);
  if (state.jaFont) p.text(xLabel, 0, -50);
  p.pop();
  p.push();
  p.rotateY(p.PI / 2);
  p.translate(0, -50, 500);
  if (state.jaFont) p.text(yLabel, 0, -10);
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
  if (name === "") name = key;
  const data = state.dataInputArr[key].data;
  let x = data.x.value();
  if (x === "") x = 0;
  x = p.map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y === "") y = 0;
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
    p.translate();
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
  p.translate(0, p.map(p.min(zArr), zMin, zMax, 0, 500) - 25, 0);
  if (p.min(zArr) > 0) {
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
function connectStrata(p, xMin, xMax, yMin, yMax, zMin, zMax) {
  const trNum = document.getElementById("strataSelect").childElementCount;
  const p1Name = p.select("#firstPlaceSelect").value();
  const p2Name = p.select("#secondPlaceSelect").value();
  const p3Name = p.select("#thirdPlaceSelect").value();
  if (p1Name == "-" || p2Name == "-" || p3Name == "-") return;

  const p1 = [0, 0];
  const p2 = [0, 0];
  const p3 = [0, 0];
  for (const key in state.dataInputArr) {
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
  for (let i = 0; i < trNum; i++) {
    const select1 = p.select("#select1-" + (i + 1)).value();
    const select2 = p.select("#select2-" + (i + 1)).value();
    const select3 = p.select("#select3-" + (i + 1)).value();
    const select4 = p.select("#select4-" + (i + 1)).value();
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

    applyStrataFill(p, select1, 150);

    p1Min = p.map(p1Min, zMin, zMax, 0, 500);
    p1Max = p.map(p1Max, zMin, zMax, 0, 500);
    p2Min = p.map(p2Min, zMin, zMax, 0, 500);
    p2Max = p.map(p2Max, zMin, zMax, 0, 500);
    p3Min = p.map(p3Min, zMin, zMax, 0, 500);
    p3Max = p.map(p3Max, zMin, zMax, 0, 500);
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
 * シミュレーションの描画を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);

  // いずれかのモーダルを開いている時はオービットコントロールを無効化
  const isAnyModalOpen = ["dataRegisterModal", "csvExampleModal"].some(
    (id) => !document.getElementById(id).classList.contains("hidden")
  );
  if (!isAnyModalOpen) {
    p.orbitControl();
  }

  // x方向・y方向、深さに応じてスケールを計算する
  const coordinateData = calculateValue(p);
  const xMin = coordinateData.x.min;
  const xMax = coordinateData.x.max;
  const yMin = coordinateData.y.min;
  const yMax = coordinateData.y.max;
  const zMin = coordinateData.z.min;
  const zMax = coordinateData.z.max;

  // 計算したスケールを実際に適応
  backgroundSetting(p, xMin, xMax, yMin, yMax, zMin, zMax);
  // 方位の描画
  drawDirMark(p, -600, -600);

  // 地点名の回転
  state.rotateTime += 3;

  // それぞれの地点のボーリングデータの描画
  for (const key in state.dataInputArr) {
    drawStrata(p, key, state.rotateTime, xMin, xMax, yMin, yMax, zMin, zMax);
  }

  // それぞれの地層をつなぐ
  connectStrata(p, xMin, xMax, yMin, yMax, zMin, zMax);
}
