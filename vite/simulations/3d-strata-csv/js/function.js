// html要素が全て読み込まれた後に読み込む
window.onload = () => {
  // screenshotButtonの設定
  document.getElementById("screenshotButton").addEventListener("click", () => {
    html2canvas(document.body).then((canvas) => {
      downloadImage(canvas.toDataURL());
    });
  });
  downloadImage = (dataUrl) => {
    const name = "screenshot.png";
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name;
    a.click();
  };
};

let xMin, xMax, yMin, yMax, zMin, zMax;

// 緯度経度、深さの最小値と最大値を計算する関数
calculateValue = (setRadioButtonValue, unitSelectValue) => {
  if (setRadioButtonValue === "auto") {
    let latitudeArr = [];
    let longitudeArr = [];
    let depthArr = [];
    for (let key in dataInputArr) {
      let value = dataInputArr[key];
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
    x: {
      min: xMin,
      max: xMax,
    },
    y: {
      min: yMin,
      max: yMax,
    },
    z: {
      min: zMin,
      max: zMax,
    },
  };
};

//背景を設定する関数
function backgroundSetting(coordinateData) {
  let xMin = coordinateData.x.min;
  let xMax = coordinateData.x.max;
  let yMin = coordinateData.y.min;
  let yMax = coordinateData.y.max;
  let zMin = coordinateData.z.min;
  let zMax = coordinateData.z.max;
  background(240);
  strokeWeight(3);
  // x軸
  stroke(255, 0, 0);
  line(-500, 0, -500, 500, 0, -500);
  // z軸
  stroke(0, 255, 0);
  line(-500, 0, -500, -500, 500, -500);
  // y軸
  stroke(0, 0, 255);
  line(-500, 0, -500, -500, 0, 500);
  // 格子線
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
drawDirMark = (x, y) => {
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
};

// 地層の平面を描画する処理
drawStrata = (key, rotateTime, coordinateData) => {
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
    switch (kind) {
      case "砂岩層":
        fill(215, 205, 166, 200);
        break;
      case "泥岩層":
        fill(156, 154, 143, 200);
        break;
      case "れき岩層":
        fill(252, 180, 172, 200);
        break;
      case "石灰岩層":
        fill(120, 170, 170, 200);
        break;
      case "凝灰岩層・火山灰層":
        fill(200, 200, 200, 200);
        break;
      case "ローム層":
        fill(112, 58, 21, 200);
        break;
      case "その他の層":
        fill(0, 200);
        break;
      default:
        break;
    }
    push();
    translate(x, map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2, y);
    box(50, map(zLength, 0, zMax - zMin, 0, 500), 50);
    translate(100, 10, 0);
    fill(0);
    text(kind, 0, 0);
    pop();
    fill(0);
    push();
    translate();
    text(kind, x, map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2);
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
};

function connectStrata() {
  let trNum = document.getElementById("strataSelect").childElementCount;
  let p1Name = select("#firstPlaceSelect").value();
  let p2Name = select("#secondPlaceSelect").value();
  let p3Name = select("#thirdPlaceSelect").value();
  if (p1Name !== "-" && p2Name !== "-" && p3Name !== "-") {
    let p1 = [0, 0];
    let p2 = [0, 0];
    let p3 = [0, 0];
    for (let key in dataInputArr) {
      if (dataInputArr[key].name.value() === p1Name) {
        p1[0] = dataInputArr[key].data.x.value();
        p1[0] = map(p1[0], xMin, xMax, -500, 500);
        p1[1] = dataInputArr[key].data.y.value();
        p1[1] = map(p1[1], yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() === p2Name) {
        p2[0] = dataInputArr[key].data.x.value();
        p2[0] = map(p2[0], xMin, xMax, -500, 500);
        p2[1] = dataInputArr[key].data.y.value();
        p2[1] = map(p2[1], yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() === p3Name) {
        p3[0] = dataInputArr[key].data.x.value();
        p3[0] = map(p3[0], xMin, xMax, -500, 500);
        p3[1] = dataInputArr[key].data.y.value();
        p3[1] = map(p3[1], yMin, yMax, 500, -500);
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
          fill(215, 205, 166, 150);
          break;
        case "泥岩層":
          fill(156, 154, 143, 150);
          break;
        case "れき岩層":
          fill(252, 180, 172, 150);
          break;
        case "石灰岩層":
          fill(120, 170, 170, 150);
          break;
        case "凝灰岩層・火山灰層":
          fill(200, 200, 200, 150);
          break;
        case "ローム層":
          fill(112, 58, 21, 150);
          break;
        case "その他の層":
          fill(0, 150);
          break;
        default:
          break;
      }

      // ３点を結び平面を生成する関数
      const createPlane1 = (x1, z1, y1, x2, z2, y2, x3, z3, y3) => {
        beginShape();
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
        vertex(x3, y3, z3);
        endShape(CLOSE);
      };

      // ４点を結び平面を生成する関数
      const createPlane2 = (x1, z1, y1, x2, z2, y2, x3, z3, y3, x4, z4, y4) => {
        beginShape();
        vertex(x1, y1, z1);
        vertex(x2, y2, z2);
        vertex(x3, y3, z3);
        vertex(x4, y4, z4);
        endShape(CLOSE);
      };

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
