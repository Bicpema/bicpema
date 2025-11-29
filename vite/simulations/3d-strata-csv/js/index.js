// jQueryとhtml2canvasのインポート
import $ from "jquery";
import html2canvas from "html2canvas";

// p5.jsがcommon.jsから読み込まれるのを待機
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

// html要素が全て読み込まれた後に読み込む
window.onload = function () {
  // screenshotButtonの設定
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

// 全画面表示
function fullScreen() {
  let p5Canvas = select("#p5Canvas");
  let navBar = select("#navBar");
  let canvas = createCanvas(windowWidth, windowHeight - navBar.height, WEBGL);
  canvas.parent(p5Canvas).class("rounded border border-1");
}

// フォント変数を宣言
let jaFont = null;

// 地点を追加、削除するボタン
let placeAddButton, placeRemoveButton;
// 平面を構成する地層の組を追加、削除するボタン
let strataAddButton, strataRemoveButton;
// スケール設定関連
let setRadioButton, unitSelect;
// ファイル入力
let strataFileInput;

// DOM要素の生成
function elCreate() {
  placeAddButton = select("#placeAddButton");
  placeRemoveButton = select("#placeRemoveButton");
  strataAddButton = select("#strataAddButton");
  strataRemoveButton = select("#strataRemoveButton");

  // ラジオボタンの作成
  let setRadioParent = select("#setRadioParent");
  setRadioButton = createRadio().parent(setRadioParent);
  setRadioButton.option("自動", "auto");
  setRadioButton.option("手動", "manual");
  setRadioButton.value("auto");

  // 単位選択
  unitSelect = select("#unitSelect");
  unitSelect.option("緯度・経度", "latlng");
  unitSelect.option("メートル", "meter");

  // ファイル入力
  let buttonParent = select("#buttonParent");
  strataFileInput = createFileInput(strataFileInputFunction);
  strataFileInput.position(5, buttonParent.y + buttonParent.height + 5);
}

// 地点のデータを入力するインプットの連想配列
let dataInputArr = {};

// 地点データが入力された時に動く関数
function placeNameInputFunction() {
  let placeNum = Object.keys(dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName == "") {
      placeName = place;
      dataInputArr[place].edit.html("地点" + str(i + 1) + "のデータを編集");
    } else {
      dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + str(i + 1)).onclick =
      function () {
        let win = window.open(
          "/vite/simulations/3d-strata-csv/setWindow.html?" + placeName,
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

// 地点データの追加ボタンを押した時に動く関数
function placeAddButtonFunction() {
  let placeNum = Object.keys(dataInputArr).length;
  let newPlaceNum = placeNum + 1;
  let newDom = new DOM(newPlaceNum);
  let placeName = "地点" + str(newPlaceNum);

  dataInputArr[placeName] = {
    name: newDom.placeNameInput,
    data: { x: "", y: "" },
    edit: "",
    layer: [],
  };
  dataInputArr[placeName]["data"]["x"] = newDom.xInput;
  dataInputArr[placeName]["data"]["y"] = newDom.yInput;
  dataInputArr[placeName]["edit"] = newDom.placeDataInput;

  document.getElementById("placeDataInput" + str(newPlaceNum)).onclick =
    function () {
      let win = window.open(
        "/vite/simulations/3d-strata-csv/setWindow.html?" + placeName,
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

// 平面を構成する１つ目の地点のデータに関連する処理
function firstPlaceSelectFunction() {
  let firstPlaceSelect = select("#firstPlaceSelect");
  let firstPlaceName = document.getElementById("firstPlaceName");
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
    if (strataArr && strataArr.length > 0) {
      for (let i = 0; i < trNum; i++) {
        let strataSelect = document.getElementById("select2-" + str(i + 1));
        while (strataSelect.childElementCount > 0) {
          strataSelect.remove(0);
        }
        let strataKind = select("#select1-" + str(i + 1)).value();
        let element = select("#select2-" + str(i + 1));
        for (let j = 0; j < strataArr.length; j++) {
          if (strataKind == strataArr[j][2]) {
            element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
          }
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select2-" + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する２つ目の地点のデータに関連する処理
function secondPlaceSelectFunction() {
  let secondPlaceSelect = select("#secondPlaceSelect");
  let secondPlaceName = document.getElementById("secondPlaceName");
  secondPlaceName.innerHTML = secondPlaceSelect.value();
  let placeName = secondPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
    if (strataArr && strataArr.length > 0) {
      for (let i = 0; i < trNum; i++) {
        let strataSelect = document.getElementById("select3-" + str(i + 1));
        while (strataSelect.childElementCount > 0) {
          strataSelect.remove(0);
        }
        let strataKind = select("#select1-" + str(i + 1)).value();
        let element = select("#select3-" + str(i + 1));
        for (let j = 0; j < strataArr.length; j++) {
          if (strataKind == strataArr[j][2]) {
            element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
          }
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select3-" + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する３つ目の地点のデータに関連する処理
function thirdPlaceSelectFunction() {
  let thirdPlaceSelect = select("#thirdPlaceSelect");
  let thirdPlaceName = document.getElementById("thirdPlaceName");
  thirdPlaceName.innerHTML = thirdPlaceSelect.value();
  let placeName = thirdPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
    if (strataArr && strataArr.length > 0) {
      for (let i = 0; i < trNum; i++) {
        let strataSelect = document.getElementById("select4-" + str(i + 1));
        while (strataSelect.childElementCount > 0) {
          strataSelect.remove(0);
        }
        let strataKind = select("#select1-" + str(i + 1)).value();
        let element = select("#select4-" + str(i + 1));
        for (let j = 0; j < strataArr.length; j++) {
          if (strataKind == strataArr[j][2]) {
            element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
          }
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select4-" + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
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
    if (placeName == "") {
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

// グローバルに公開（子ウィンドウからアクセスするため）
window.placeRefreshFunction = placeRefreshFunction;
window.firstPlaceSelectFunction = firstPlaceSelectFunction;
window.secondPlaceSelectFunction = secondPlaceSelectFunction;
window.thirdPlaceSelectFunction = thirdPlaceSelectFunction;

// 平面を構成する地層の組を追加するボタンを押した時の処理
function strataAddButtonFunction() {
  let NextTrNum = document.getElementById("strataSelect").childElementCount + 1;
  let tr = createElement("tr")
    .parent("strataSelect")
    .id("tr-" + NextTrNum);
  let th = createElement("th", NextTrNum + "組目")
    .parent("tr-" + NextTrNum)
    .id("th-" + NextTrNum);
  let td1 = createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td1-" + NextTrNum);
  let select1 = createSelect()
    .parent("td1-" + NextTrNum)
    .class("form-select")
    .id("select1-" + NextTrNum);
  let select1doc = document.getElementById("select1-" + NextTrNum);
  select1doc.addEventListener("change", strataSelectFunction);
  let strataArr = [
    "砂岩層",
    "泥岩層",
    "れき岩層",
    "石灰岩層",
    "凝灰岩層・火山灰層",
    "ローム層",
    "その他の層",
  ];
  for (let i = 0; i < strataArr.length; i++) select1.option(strataArr[i]);
  let td2 = createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td2-" + NextTrNum);
  let select2 = createSelect()
    .parent("td2-" + NextTrNum)
    .class("form-select")
    .id("select2-" + NextTrNum);
  let td3 = createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td3-" + NextTrNum);
  let select3 = createSelect()
    .parent("td3-" + NextTrNum)
    .class("form-select")
    .id("select3-" + NextTrNum);
  let td4 = createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td4-" + NextTrNum);
  let select4 = createSelect()
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

// スケール設定変更時の処理
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
    let coordinateData = calculateValue();
    let xMax = coordinateData.x.max;
    let zMax = coordinateData.z.max;
    let zMin = coordinateData.z.min;
    ele1.value = xMax;
    ele2.value = zMax;
    ele3.value = zMin;
    ele1.disabled = false;
    ele2.disabled = false;
    ele3.disabled = false;
  }
}

// 単位選択変更時の処理
function unitSelectFunction() {
  if (unitSelect.value() === "latlng") {
    document.getElementById("setWidthParent").hidden = true;
  } else if (unitSelect.value() === "meter") {
    document.getElementById("setWidthParent").hidden = false;
  }
}

// CSVファイル読み込み処理
function strataFileInputFunction(file) {
  if (file.type === "text") {
    dataInputArr = {};
    // 既存のDOM要素を削除
    let placePointNameInput = document.getElementById("placePointNameInput");
    while (placePointNameInput.firstChild) {
      placePointNameInput.removeChild(placePointNameInput.firstChild);
    }
    let placePointDataInput = document.getElementById("placePointDataInput");
    while (placePointDataInput.firstChild) {
      placePointDataInput.removeChild(placePointDataInput.firstChild);
    }

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

// CSV処理
function processCSV(csvText) {
  csvText = csvText.replace(/\r/g, "");
  let rows = csvText.split("\n").map((row) => row.split(","));
  let dataRows = rows.slice(1);

  let name_arr = [];
  let place_arr = [[], []];
  let test_data = {};
  let placeNum = 0;
  for (let i = 0; i < dataRows.length; i++) {
    let data = dataRows[i];
    if (!data[0] || data[0].trim() === "") continue;

    if (!name_arr.includes(data[0])) {
      placeNum++;
      name_arr.push(data[0]);
      place_arr[0].push(parseFloat(data[1]));
      place_arr[1].push(parseFloat(data[2]));
      test_data["地点" + placeNum] = [];
    }
    if (data[3] && data[4] && data[5]) {
      test_data["地点" + placeNum].push([
        parseFloat(data[3]),
        parseFloat(data[4]),
        data[5],
      ]);
    }
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
  console.log("CSVデータ読み込み完了:", dataInputArr);
}

// DOM要素の設定
function elInit() {
  placeAddButton.mousePressed(placeAddButtonFunction);
  placeRemoveButton.mousePressed(placeRemoveButtonFunction);
  strataAddButton.mousePressed(strataAddButtonFunction);
  strataRemoveButton.mousePressed(strataRemoveButtonFunction);
  setRadioButton.changed(setRadioButtonFunction);
  unitSelect.changed(unitSelectFunction);
}

// 初期値設定
function initValue() {
  camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
}

// setup関数
function setup() {
  fullScreen();
  elCreate();
  elInit();
  initValue();
  // フォントを非同期で読み込む
  loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (font) => {
      jaFont = font;
      textFont(jaFont);
      textSize(20);
      textAlign(CENTER);
    },
    () => {
      console.warn(
        "Japanese font could not be loaded. Text labels will not be displayed."
      );
    }
  );
}

// 緯度経度、深さの最小値と最大値を計算する関数
function calculateValue() {
  let setRadioButtonValue = setRadioButton ? setRadioButton.value() : "auto";
  let unitSelectValue = unitSelect ? unitSelect.value() : "latlng";

  let xMin, xMax, yMin, yMax, zMin, zMax;

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
        latitudeArr.push(parseFloat(latitude));
      } else {
        latitudeArr.push(0);
      }
      if (longitude !== "") {
        longitudeArr.push(parseFloat(longitude));
      } else {
        longitudeArr.push(0);
      }
      let layer = value.layer;
      if (layer && layer.length > 0) {
        for (let i = 0; i < layer.length; i++) {
          depthArr.push(layer[i][0], layer[i][1]);
        }
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
      xMax = parseFloat(ele1.value());
      yMin = 0;
      yMax = parseFloat(ele1.value());
    }
    zMax = parseFloat(ele2.value());
    zMin = parseFloat(ele3.value());
  }

  return {
    x: { min: xMin, max: xMax },
    y: { min: yMin, max: yMax },
    z: { min: zMin, max: zMax },
  };
}

// 背景を設定する関数
function backgroundSetting(xMin, xMax, yMin, yMax, zMin, zMax) {
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
      if (jaFont) text(nf(xMap, 1, 4), x, -10);
      pop();
    }
  }

  let xLabel, yLabel;
  if (unitSelect && unitSelect.value() === "latlng") {
    xLabel = "経度";
    yLabel = "緯度";
  } else {
    xLabel = "x方向(m)";
    yLabel = "y方向(m)";
  }
  push();
  translate(0, 0, 500);
  if (jaFont) text(xLabel, 0, -50);
  pop();

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
      if (jaFont) text(nf(zMap, 1, 4), -500, z);
      pop();
    }
  }
  push();
  translate(0, 0, -500);
  if (jaFont) text("深さ", -550, 250, 0);
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
      if (jaFont) text(nf(yMap, 1, 4), 0, -10);
      pop();
    }
  }
  push();
  rotateY(PI / 2);
  translate(0, -50, 500);
  if (jaFont) text(yLabel, 0, -10);
  pop();
}

// 子ウィンドウからデータを取得するための関数
function submit(arr) {
  let name = arr[0];
  let dataArr = arr[1];
  for (let key in dataInputArr) {
    let placeName = dataInputArr[key].name.value();
    if (placeName == "") placeName = key;
    if (placeName == name) {
      dataInputArr[key].layer = dataArr;
    }
  }
}
// グローバルに公開
window.submit = submit;

// input済みの地層データを引き継ぐ関数
function loadLayers(placeName) {
  let arrKey = placeName;
  for (let key in dataInputArr) {
    let a = dataInputArr[key].name.value();
    if (a == arrKey) {
      arrKey = key;
    }
  }
  let value = dataInputArr[arrKey];
  let layers = value.layer;
  return layers || [];
}
// グローバルに公開
window.loadLayers = loadLayers;

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
  if (jaFont) {
    text("東", x + 70, y + 8);
    text("西", x - 70, y + 8);
    text("南", x, y + 70 + 60);
    text("北", x, y - 70 - 40);
  }
  pop();
}

// 地層の平面を描画する処理
function drawStrata(key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax) {
  let name = dataInputArr[key].name.value();
  if (name == "") name = key;
  let data = dataInputArr[key].data;
  let x = data.x.value();
  if (x == "") x = 0;
  x = map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y == "") y = 0;
  y = map(y, yMin, yMax, 500, -500);
  let layer = dataInputArr[key].layer;
  if (!layer || layer.length === 0) return;

  noStroke();
  let zArr = [];
  for (let i = 0; i < layer.length; i++) {
    let z = layer[i][0];
    zArr.push(z);
    let zLength = layer[i][1] - layer[i][0];
    let kind = layer[i][2];
    if (kind == "砂岩層") fill(215, 205, 166, 200);
    else if (kind == "泥岩層") fill(156, 154, 143, 200);
    else if (kind == "れき岩層") fill(252, 180, 172, 200);
    else if (kind == "石灰岩層") fill(120, 170, 170, 200);
    else if (kind == "凝灰岩層・火山灰層") fill(200, 200, 200, 200);
    else if (kind == "ローム層") fill(112, 58, 21, 200);
    else if (kind == "その他の層") fill(0, 200);
    push();
    translate(
      x,
      map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2,
      y
    );
    box(50, map(zLength, 0, zMax - zMin, 0, 500), 50);
    translate(100, 10, 0);
    fill(0);
    if (jaFont) text(kind, 0, 0);
    pop();
    fill(0);
    push();
    if (jaFont) {
      text(
        kind,
        x,
        map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2
      );
    }
    pop();
  }
  fill(0);
  push();
  translate(x, 0, y);
  rotateY(radians(rotateTime));
  if (min(zArr) < 0) {
    translate(0, map(min(zArr), zMin, zMax, 0, 500) - 25, 0);
  } else {
    translate(0, -25, 0);
  }
  if (jaFont) text(name, 0, -55);
  fill(255, 0, 0);
  cone(10, 50, 10, 3, true);
  pop();
}

// ３点を結び平面を生成する関数
function createPlane1(x1, z1, y1, x2, z2, y2, x3, z3, y3) {
  beginShape();
  vertex(x1, y1, z1);
  vertex(x2, y2, z2);
  vertex(x3, y3, z3);
  endShape(CLOSE);
}

// ４点を結び平面を生成する関数
function createPlane2(x1, z1, y1, x2, z2, y2, x3, z3, y3, x4, z4, y4) {
  beginShape();
  vertex(x1, y1, z1);
  vertex(x2, y2, z2);
  vertex(x3, y3, z3);
  vertex(x4, y4, z4);
  endShape(CLOSE);
}

// draw関数
let rotateTime = 0;
function draw() {
  let coordinateData = calculateValue();
  let xMin = coordinateData.x.min;
  if (xMin === undefined || xMin === Infinity) xMin = 0;
  let xMax = coordinateData.x.max;
  if (xMax === undefined || xMax === -Infinity) xMax = 0;
  let yMin = coordinateData.y.min;
  if (yMin === undefined || yMin === Infinity) yMin = 0;
  let yMax = coordinateData.y.max;
  if (yMax === undefined || yMax === -Infinity) yMax = 0;
  let zMin = coordinateData.z.min;
  if (zMin === undefined || zMin === Infinity) zMin = 0;
  let zMax = coordinateData.z.max;
  if (zMax === undefined || zMax === -Infinity) zMax = 0;

  backgroundSetting(xMin, xMax, yMin, yMax, zMin, zMax);
  drawDirMark(-600, -600);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  let modalIs = $("#dataRegisterModal").is(":hidden");
  if (modalIs) {
    orbitControl(2);
  }

  rotateTime += 2;
  for (let key in dataInputArr) {
    drawStrata(key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax);
  }

  // 地層を結ぶ
  let trNum = document.getElementById("strataSelect").childElementCount;
  let p1Name = select("#firstPlaceSelect").value();
  let p2Name = select("#secondPlaceSelect").value();
  let p3Name = select("#thirdPlaceSelect").value();
  if (p1Name != "-" && p2Name != "-" && p3Name != "-") {
    let p1 = [0, 0];
    let p2 = [0, 0];
    let p3 = [0, 0];
    for (let key in dataInputArr) {
      if (dataInputArr[key].name.value() == p1Name) {
        p1[0] = dataInputArr[key].data.x.value();
        p1[0] = map(p1[0], xMin, xMax, -500, 500);
        p1[1] = dataInputArr[key].data.y.value();
        p1[1] = map(p1[1], yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() == p2Name) {
        p2[0] = dataInputArr[key].data.x.value();
        p2[0] = map(p2[0], xMin, xMax, -500, 500);
        p2[1] = dataInputArr[key].data.y.value();
        p2[1] = map(p2[1], yMin, yMax, 500, -500);
      } else if (dataInputArr[key].name.value() == p3Name) {
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

      p1Min = map(p1Min, zMin, zMax, 0, 500);
      p1Max = map(p1Max, zMin, zMax, 0, 500);
      p2Min = map(p2Min, zMin, zMax, 0, 500);
      p2Max = map(p2Max, zMin, zMax, 0, 500);
      p3Min = map(p3Min, zMin, zMax, 0, 500);
      p3Max = map(p3Max, zMin, zMax, 0, 500);

      if (select1 == "砂岩層") fill(215, 205, 166, 150);
      else if (select1 == "泥岩層") fill(156, 154, 143, 150);
      else if (select1 == "れき岩層") fill(252, 180, 172, 150);
      else if (select1 == "石灰岩層") fill(120, 170, 170, 150);
      else if (select1 == "凝灰岩層・火山灰層") fill(200, 200, 200, 150);
      else if (select1 == "ローム層") fill(112, 58, 21, 150);
      else if (select1 == "その他の層") fill(0, 150);

      createPlane1(
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

// windowがリサイズされたときの処理
function windowResized() {
  let navBar = select("#navBar");
  resizeCanvas(windowWidth, windowHeight - navBar.height);
}

// DOM要素のクラス
class DOM {
  constructor(n) {
    this.n = n;
    let placePointNameInput = select("#placePointNameInput");
    this.parentDiv = createDiv()
      .parent(placePointNameInput)
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

// p5.jsのグローバルモードのためにsetup/draw関数をwindowオブジェクトに公開
window.setup = setup;
window.draw = draw;
