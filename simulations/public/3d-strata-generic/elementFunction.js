// 地点データの追加ボタンを押した時に動く関数
function placeAddButtonFunction() {
  // 地点データの数を取得
  let placeNum = Object.keys(dataInputArr).length;
  // 新しく生成する地点データの番号
  let newPlaceNum = placeNum + 1;
  // 新しく生成する地点データ入力オブジェクト
  let newDom = new DOM(newPlaceNum);
  // 新しく生成する地点名
  let placeName = "地点" + str(newPlaceNum);
  // 生成したオブジェクトを連想配列に登録
  dataInputArr[placeName] = { name: newDom.placeNameInput, data: { x: "", y: "" }, edit: "", layer: "" };
  dataInputArr[placeName]["data"]["x"] = newDom.xInput;
  dataInputArr[placeName]["data"]["y"] = newDom.yInput;
  dataInputArr[placeName]["edit"] = newDom.placeDataInput;
  // サブウィンドウを開く機構の付与
  document.getElementById("placeDataInput" + str(newPlaceNum)).onclick = () => {
    let win = window.open(
      "/simulations/3d-strata-generic/setWindow.html?" + placeName,
      "window_name",
      "width=1000,height=500"
    );
  };
  placeRefreshFunction();
}

// 地点データの削除ボタンを押した時に動く関数
function placeRemoveButtonFunction() {
  // 地点データの個数を取得
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
  let strataArr = ["砂岩層", "泥岩層", "れき岩層", "石灰岩層", "凝灰岩層・火山灰層", "ローム層", "その他の層"];
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
  if (strataSelect.childElementCount > 0) strataSelect.removeChild(strataSelect.lastChild);
}

// 地点データが入力された時に動く関数
function placeNameInputFunction() {
  // 地点データの数
  let placeNum = Object.keys(dataInputArr).length;
  // データを編集するボタンのhtml要素を書き換える繰り返し
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName == "") {
      placeName = place;
      dataInputArr[place].edit.html("地点" + str(i + 1) + "のデータを編集");
    } else {
      dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + str(i + 1)).onclick = () => {
      let win = window.open(
        "/simulations/3d-strata-generic/setWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  }
  // 平面データの設定を常に更新
  placeRefreshFunction();
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 平面を構成する１つ目の地点のデータに関連する処理
function firstPlaceSelectFunction() {
  let firstPlaceSelect = select("#firstPlaceSelect");
  let firstPlaceName = document.getElementById("firstPlaceName");
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
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
  if (Object.keys(dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
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
  if (Object.keys(dataInputArr).length !== 0 && placeName != "-") {
    let strataArr = dataInputArr[placeName].layer;
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
  // 地点データの数
  let placeNum = Object.keys(dataInputArr).length;
  // データを編集するボタンのhtml要素を書き換える繰り返し
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

function unitSelectFunction() {
  if (unitSelect.value() === "latlng") {
    document.getElementById("setWidthParent").hidden = true;
  } else if (unitSelect.value() === "meter") {
    document.getElementById("setWidthParent").hidden = false;
  }
}
