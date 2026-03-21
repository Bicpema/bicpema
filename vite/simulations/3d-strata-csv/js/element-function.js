import { state } from "./state.js";

// 地点入力用DOM要素クラス
class DOM {
  constructor(p, n) {
    this.n = n;
    this.parentDiv = p
      .createDiv()
      .parent("placePointNameInput")
      .class("mb-2")
      .id("placeNameInput" + String(this.n));
    this.inputGroup1 = p.createDiv().parent(this.parentDiv).class("input-group");
    this.inputGroup2 = p.createDiv().parent(this.parentDiv).class("input-group");
    // input要素の上の部分
    p.createElement("span", "地点" + String(this.n) + "：")
      .parent(this.inputGroup1)
      .class("input-group-text");
    this.placeNameInput = p
      .createInput()
      .parent(this.inputGroup1)
      .class("form-control")
      .input(() => placeNameInputFunction(p));
    // input要素の下の部分
    p.createElement("span", "y方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.yInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    p.createElement("span", "x方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.xInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    p.createDiv(
      "地点" + String(this.n) + "の名前、y方向、x方向を入力してください。"
    )
      .parent(this.parentDiv)
      .class("form-text");
    // サブウィンドウ生成用のDOM
    this.placeDataInput = p
      .createA(
        "javascript:void(0)",
        "地点" + String(this.n) + "のデータを編集"
      )
      .class("btn btn-outline-primary mb-2")
      .parent("placePointDataInput")
      .id("placeDataInput" + String(this.n));
  }
}

// 地点データの追加ボタンを押した時に動く関数
export function placeAddButtonFunction(p) {
  let placeNum = Object.keys(state.dataInputArr).length;
  let newPlaceNum = placeNum + 1;
  let newDom = new DOM(p, newPlaceNum);
  let placeName = "地点" + String(newPlaceNum);
  state.dataInputArr[placeName] = {
    name: newDom.placeNameInput,
    data: { x: "", y: "" },
    edit: "",
    layer: "",
  };
  state.dataInputArr[placeName]["data"]["x"] = newDom.xInput;
  state.dataInputArr[placeName]["data"]["y"] = newDom.yInput;
  state.dataInputArr[placeName]["edit"] = newDom.placeDataInput;
  document.getElementById("placeDataInput" + String(newPlaceNum)).onclick =
    () => {
      window.open(
        "/simulations/3d-strata-csv/setWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  placeRefreshFunction(p);
}

// 地点データの削除ボタンを押した時に動く関数
export function placeRemoveButtonFunction(p) {
  let placeNum = Object.keys(state.dataInputArr).length;
  if (placeNum > 0) {
    p.select("#placeNameInput" + String(placeNum)).remove();
    p.select("#placeDataInput" + String(placeNum)).remove();
    delete state.dataInputArr["地点" + placeNum];
  }
  placeRefreshFunction(p);
}

// 平面を構成する地層の組を追加するボタンを押した時の処理
export function strataAddButtonFunction(p) {
  let NextTrNum =
    document.getElementById("strataSelect").childElementCount + 1;
  p.createElement("tr")
    .parent("strataSelect")
    .id("tr-" + NextTrNum);
  p.createElement("th", NextTrNum + "組目")
    .parent("tr-" + NextTrNum)
    .id("th-" + NextTrNum);
  p.createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td1-" + NextTrNum);
  let select1 = p
    .createSelect()
    .parent("td1-" + NextTrNum)
    .class("form-select")
    .id("select1-" + NextTrNum);
  let select1doc = document.getElementById("select1-" + NextTrNum);
  select1doc.addEventListener("change", () => strataSelectFunction(p));
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
  p.createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td2-" + NextTrNum);
  p.createSelect()
    .parent("td2-" + NextTrNum)
    .class("form-select")
    .id("select2-" + NextTrNum);
  p.createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td3-" + NextTrNum);
  p.createSelect()
    .parent("td3-" + NextTrNum)
    .class("form-select")
    .id("select3-" + NextTrNum);
  p.createElement("td")
    .parent("tr-" + NextTrNum)
    .id("td4-" + NextTrNum);
  p.createSelect()
    .parent("td4-" + NextTrNum)
    .class("form-select")
    .id("select4-" + NextTrNum);
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

// 平面を構成する地層の組を削除するボタンを押した時の処理
export function strataRemoveButtonFunction() {
  let strataSelect = document.getElementById("strataSelect");
  if (strataSelect.childElementCount > 0)
    strataSelect.removeChild(strataSelect.lastChild);
}

// 地点データが入力された時に動く関数
export function placeNameInputFunction(p) {
  let placeNum = Object.keys(state.dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + String(i + 1);
    let placeName = state.dataInputArr[place].name.value();
    if (placeName == "") {
      placeName = place;
      state.dataInputArr[place].edit.html(
        "地点" + String(i + 1) + "のデータを編集"
      );
    } else {
      state.dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + String(i + 1)).onclick = () => {
      window.open(
        "/simulations/3d-strata-csv/setWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  }
  placeRefreshFunction(p);
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

// 平面を構成する１つ目の地点のデータに関連する処理
export function firstPlaceSelectFunction(p) {
  let firstPlaceSelect = p.select("#firstPlaceSelect");
  let firstPlaceName = document.getElementById("firstPlaceName");
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (let key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select2-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select2-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select2-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する２つ目の地点のデータに関連する処理
export function secondPlaceSelectFunction(p) {
  let secondPlaceSelect = p.select("#secondPlaceSelect");
  let secondPlaceName = document.getElementById("secondPlaceName");
  secondPlaceName.innerHTML = secondPlaceSelect.value();
  let placeName = secondPlaceName.innerHTML;
  for (let key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select3-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select3-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select3-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する３つ目の地点のデータに関連する処理
export function thirdPlaceSelectFunction(p) {
  let thirdPlaceSelect = p.select("#thirdPlaceSelect");
  let thirdPlaceName = document.getElementById("thirdPlaceName");
  thirdPlaceName.innerHTML = thirdPlaceSelect.value();
  let placeName = thirdPlaceName.innerHTML;
  for (let key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select4-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select4-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select4-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する地層の種類が変わったときの処理
export function strataSelectFunction(p) {
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

// 平面を構成する地点を更新する処理
export function placeRefreshFunction(p) {
  let firstPlaceSelect = p.select("#firstPlaceSelect");
  let secondPlaceSelect = p.select("#secondPlaceSelect");
  let thirdPlaceSelect = p.select("#thirdPlaceSelect");

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
  let placeNum = Object.keys(state.dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + String(i + 1);
    let placeName = state.dataInputArr[place].name.value();
    if (placeName === "") {
      placeName = place;
    }
    firstPlaceSelect.option(placeName);
    secondPlaceSelect.option(placeName);
    thirdPlaceSelect.option(placeName);
  }
  firstPlaceSelectDoc.addEventListener(
    "change",
    () => firstPlaceSelectFunction(p)
  );
  secondPlaceSelectDoc.addEventListener(
    "change",
    () => secondPlaceSelectFunction(p)
  );
  thirdPlaceSelectDoc.addEventListener(
    "change",
    () => thirdPlaceSelectFunction(p)
  );
}

// スケール設定ラジオボタンが変わったときの処理
export function setRadioButtonFunction() {
  let ele1 = document.getElementById("widthDirectionInput");
  let ele2 = document.getElementById("depthDirectionMaxInput");
  let ele3 = document.getElementById("depthDirectionMinInput");
  if (state.setRadioButton.value() === "auto") {
    ele1.value = "";
    ele2.value = "";
    ele3.value = "";
    ele1.disabled = true;
    ele2.disabled = true;
    ele3.disabled = true;
  } else if (state.setRadioButton.value() === "manual") {
    if (state.coordinateData) {
      let xMax = state.coordinateData.x.max;
      let zMax = state.coordinateData.z.max;
      let zMin = state.coordinateData.z.min;
      ele1.value = xMax;
      ele2.value = zMax;
      ele3.value = zMin;
    }
    ele1.disabled = false;
    ele2.disabled = false;
    ele3.disabled = false;
  }
}

// 単位選択が変わったときの処理
export function unitSelectFunction() {
  if (state.unitSelect.value() === "latlng") {
    document.getElementById("setWidthParent").hidden = true;
  } else if (state.unitSelect.value() === "meter") {
    document.getElementById("setWidthParent").hidden = false;
  }
}

// CSVファイルが選択された時の処理
export function strataFileInputFunction(p, file) {
  if (file.type === "text") {
    state.dataInputArr = {};
    let reader = new FileReader();
    reader.readAsArrayBuffer(file.file);
    reader.onload = function () {
      let decoder = new TextDecoder("shift-jis");
      let csvText = decoder.decode(reader.result);
      processCSV(p, csvText);
    };
  } else {
    console.log("テキストファイルではありません");
  }
}

function processCSV(p, csvText) {
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
    placeAddButtonFunction(p);
    let el = document.getElementById("placeNameInput" + (i + 1));
    let pa1 = el.children[0];
    let pl = pa1.children[1];
    pl.value = name_arr[i];
    let pa2 = el.children[1];
    let vl = pa2.children;
    vl[1].value = place_arr[0][i];
    vl[3].value = place_arr[1][i];
    state.dataInputArr["地点" + (i + 1)].layer = test_data["地点" + (i + 1)];
  }
  placeNameInputFunction(p);
}

// 子ウィンドウからデータを取得するための関数
export function submit(arr) {
  let name = arr[0];
  let dataArr = arr[1];
  for (let key in state.dataInputArr) {
    let placeName = state.dataInputArr[key].name.value();
    if (placeName === "") placeName = key;
    if (placeName === name) {
      state.dataInputArr[key].layer = dataArr;
    }
  }
}

// input済みの地層データを引き継ぐ関数
export function loadLayers(placeName) {
  let arrKey = placeName;
  for (let key in state.dataInputArr) {
    let a = state.dataInputArr[key].name.value();
    if (a === arrKey) {
      arrKey = key;
    }
  }
  let value = state.dataInputArr[arrKey];
  let layers = value.layer;
  return layers;
}
