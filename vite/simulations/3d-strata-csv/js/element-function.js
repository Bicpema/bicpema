// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { domToPng } from "modern-screenshot";
import { state, STRATA_KINDS } from "./state.js";
import { DOM } from "./class.js";

/**
 * スクリーンショットボタンが押されたときの処理。
 */
export function onScreenshotClick() {
  domToPng(document.body).then((dataUrl) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "screenshot.png";
    a.click();
  });
}

/**
 * 地点データが入力された時に動く処理。
 * @param {*} p p5インスタンス
 */
export function placeNameInputFunction(p) {
  const placeNum = Object.keys(state.dataInputArr).length;

  for (let i = 0; i < placeNum; i++) {
    const place = "地点" + (i + 1);
    let placeName = state.dataInputArr[place].name.value();
    if (placeName == "") {
      placeName = place;
      state.dataInputArr[place].edit.html("地点" + (i + 1) + "のデータを編集");
    } else {
      state.dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + (i + 1)).onclick = () => {
      window.open(
        "/vite/simulations/3d-strata-csv/setWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  }
  // 平面データの設定を常に更新
  placeRefreshFunction(p);
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

/**
 * 地点データの追加ボタンを押した時に動く処理。
 * @param {*} p p5インスタンス
 */
export function placeAddButtonFunction(p) {
  const placeNum = Object.keys(state.dataInputArr).length;
  const newPlaceNum = placeNum + 1;
  const newDom = new DOM(newPlaceNum, p);
  const placeName = "地点" + newPlaceNum;

  state.dataInputArr[placeName] = {
    name: newDom.placeNameInput,
    data: { x: "", y: "" },
    edit: "",
    layer: "",
  };
  state.dataInputArr[placeName].data.x = newDom.xInput;
  state.dataInputArr[placeName].data.y = newDom.yInput;
  state.dataInputArr[placeName].edit = newDom.placeDataInput;

  document.getElementById("placeDataInput" + newPlaceNum).onclick = () => {
    window.open(
      "/vite/simulations/3d-strata-csv/setWindow.html?" + placeName,
      "window_name",
      "width=1000,height=500"
    );
  };
  placeRefreshFunction(p);
}

/**
 * 地点データの削除ボタンを押した時に動く処理。
 * @param {*} p p5インスタンス
 */
export function placeRemoveButtonFunction(p) {
  const placeNum = Object.keys(state.dataInputArr).length;
  if (placeNum > 0) {
    p.select("#placeNameInput" + placeNum).remove();
    p.select("#placeDataInput" + placeNum).remove();
    delete state.dataInputArr["地点" + placeNum];
  }
  placeRefreshFunction(p);
}

/**
 * 平面を構成する地層の組を追加するボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function strataAddButtonFunction(p) {
  const nextTrNum =
    document.getElementById("strataSelect").childElementCount + 1;
  p.createElement("tr")
    .parent("strataSelect")
    .id("tr-" + nextTrNum);
  p.createElement("th", nextTrNum + "組目")
    .parent("tr-" + nextTrNum)
    .class("border border-neutral-300 px-2 py-1 text-center")
    .id("th-" + nextTrNum);
  p.createElement("td")
    .parent("tr-" + nextTrNum)
    .class("border border-neutral-300 px-2 py-1")
    .id("td1-" + nextTrNum);
  const select1 = p
    .createSelect()
    .parent("td1-" + nextTrNum)
    .class(
      "block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
    )
    .id("select1-" + nextTrNum);
  document
    .getElementById("select1-" + nextTrNum)
    .addEventListener("change", () => strataSelectFunction(p));
  for (let i = 0; i < STRATA_KINDS.length; i++) select1.option(STRATA_KINDS[i]);
  p.createElement("td")
    .parent("tr-" + nextTrNum)
    .class("border border-neutral-300 px-2 py-1")
    .id("td2-" + nextTrNum);
  p.createSelect()
    .parent("td2-" + nextTrNum)
    .class(
      "block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
    )
    .id("select2-" + nextTrNum);
  p.createElement("td")
    .parent("tr-" + nextTrNum)
    .class("border border-neutral-300 px-2 py-1")
    .id("td3-" + nextTrNum);
  p.createSelect()
    .parent("td3-" + nextTrNum)
    .class(
      "block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
    )
    .id("select3-" + nextTrNum);
  p.createElement("td")
    .parent("tr-" + nextTrNum)
    .class("border border-neutral-300 px-2 py-1")
    .id("td4-" + nextTrNum);
  p.createSelect()
    .parent("td4-" + nextTrNum)
    .class(
      "block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
    )
    .id("select4-" + nextTrNum);
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

/**
 * 平面を構成する地層の組を削除するボタンを押した時の処理。
 */
export function strataRemoveButtonFunction() {
  const strataSelect = document.getElementById("strataSelect");
  if (strataSelect.childElementCount > 0) {
    strataSelect.removeChild(strataSelect.lastChild);
  }
}

/**
 * 平面を構成する１つ目の地点のデータに関連する処理。
 * @param {*} p p5インスタンス
 */
export function firstPlaceSelectFunction(p) {
  const firstPlaceSelect = p.select("#firstPlaceSelect");
  const firstPlaceName = document.getElementById("firstPlaceName");
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  const trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    const strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select2-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      const strataKind = p.select("#select1-" + (i + 1)).value();
      const element = p.select("#select2-" + (i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select2-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

/**
 * 平面を構成する２つ目の地点のデータに関連する処理。
 * @param {*} p p5インスタンス
 */
export function secondPlaceSelectFunction(p) {
  const secondPlaceSelect = p.select("#secondPlaceSelect");
  const secondPlaceName = document.getElementById("secondPlaceName");
  secondPlaceName.innerHTML = secondPlaceSelect.value();
  let placeName = secondPlaceName.innerHTML;
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  const trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    const strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select3-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      const strataKind = p.select("#select1-" + (i + 1)).value();
      const element = p.select("#select3-" + (i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select3-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

/**
 * 平面を構成する３つ目の地点のデータに関連する処理。
 * @param {*} p p5インスタンス
 */
export function thirdPlaceSelectFunction(p) {
  const thirdPlaceSelect = p.select("#thirdPlaceSelect");
  const thirdPlaceName = document.getElementById("thirdPlaceName");
  thirdPlaceName.innerHTML = thirdPlaceSelect.value();
  let placeName = thirdPlaceName.innerHTML;
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  const trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName != "-") {
    const strataArr = state.dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select4-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      const strataKind = p.select("#select1-" + (i + 1)).value();
      const element = p.select("#select4-" + (i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + "m-" + strataArr[j][1] + "m");
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      const strataSelect = document.getElementById("select4-" + (i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

/**
 * 平面を構成する地層の種類が変わったときの処理。
 * @param {*} p p5インスタンス
 */
export function strataSelectFunction(p) {
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

/**
 * 平面を構成する地点の選択肢を更新する処理。
 * @param {*} p p5インスタンス
 */
export function placeRefreshFunction(p) {
  const firstPlaceSelect = p.select("#firstPlaceSelect");
  const secondPlaceSelect = p.select("#secondPlaceSelect");
  const thirdPlaceSelect = p.select("#thirdPlaceSelect");

  const firstPlaceSelectDoc = document.getElementById("firstPlaceSelect");
  const secondPlaceSelectDoc = document.getElementById("secondPlaceSelect");
  const thirdPlaceSelectDoc = document.getElementById("thirdPlaceSelect");

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

  const placeNum = Object.keys(state.dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    const place = "地点" + (i + 1);
    let placeName = state.dataInputArr[place].name.value();
    if (placeName === "") {
      placeName = place;
    }
    firstPlaceSelect.option(placeName);
    secondPlaceSelect.option(placeName);
    thirdPlaceSelect.option(placeName);
  }
  // placeRefreshFunctionは地点の追加・削除・名前入力のたびに呼び出されるため、
  // addEventListenerで都度追加すると呼び出し回数分ハンドラが多重登録されてしまう。
  // 同一要素に対して常に単一のハンドラのみを保つよう、プロパティ代入で上書きする。
  firstPlaceSelectDoc.onchange = () => firstPlaceSelectFunction(p);
  secondPlaceSelectDoc.onchange = () => secondPlaceSelectFunction(p);
  thirdPlaceSelectDoc.onchange = () => thirdPlaceSelectFunction(p);
}

/**
 * スケール設定の「自動」「手動」ラジオボタンが変更された時の処理。
 */
export function setRadioButtonFunction() {
  const ele1 = document.getElementById("widthDirectionInput");
  const ele2 = document.getElementById("depthDirectionMaxInput");
  const ele3 = document.getElementById("depthDirectionMinInput");
  if (state.setRadioButton.value() === "auto") {
    ele1.value = "";
    ele2.value = "";
    ele3.value = "";
    ele1.disabled = true;
    ele2.disabled = true;
    ele3.disabled = true;
  } else if (state.setRadioButton.value() === "manual") {
    ele1.value = state.xMax;
    ele2.value = state.zMax;
    ele3.value = state.zMin;
    ele1.disabled = false;
    ele2.disabled = false;
    ele3.disabled = false;
  }
}

/**
 * 単位（緯度・経度／メートル）のセレクトボックスが変更された時の処理。
 */
export function unitSelectFunction() {
  if (state.unitSelect.value() === "latlng") {
    document.getElementById("setWidthParent").hidden = true;
  } else if (state.unitSelect.value() === "meter") {
    document.getElementById("setWidthParent").hidden = false;
  }
}

/**
 * CSVファイルが選択された時の処理。
 * @param {object} file p5.jsのファイルオブジェクト
 * @param {*} p p5インスタンス
 */
export function strataFileInputFunction(file, p) {
  if (file.type === "text") {
    state.dataInputArr = {};
    // FileReader を使ってバイナリデータを読み込む
    const reader = new FileReader();
    reader.readAsArrayBuffer(file.file); // ArrayBuffer で読み込む

    reader.onload = function () {
      // UTF-8でデコード
      const decoder = new TextDecoder("utf-8");
      const csvText = decoder.decode(reader.result);

      processCSV(csvText, p);
    };
  } else {
    console.log("テキストファイルではありません");
  }
}

/**
 * CSVテキストを解析し、地点・地層データとして読み込む。
 * @param {string} csvText CSVファイルの内容
 * @param {*} p p5インスタンス
 */
export function processCSV(csvText, p) {
  // 改行コードを統一（\r を削除）
  csvText = csvText.replace(/\r/g, "");

  // CSV を行ごとに分割
  const rows = csvText.split("\n").map((row) => row.split(","));

  const dataRows = rows.slice(1); // 2行目以降のデータ

  const nameArr = [];
  const placeArr = [[], []];
  const testData = {};
  let placeNum = 0;
  for (let i = 0; i < dataRows.length - 1; i++) {
    const data = dataRows[i];
    if (!nameArr.includes(data[0]) && data[0] !== "") {
      placeNum++;
      nameArr.push(data[0]);
      placeArr[0].push(parseFloat(data[1]));
      placeArr[1].push(parseFloat(data[2]));
      testData["地点" + placeNum] = [];
    }
    testData["地点" + placeNum].push([
      parseFloat(data[3]),
      parseFloat(data[4]),
      data[5],
    ]);
  }
  for (let i = 0; i < nameArr.length; i++) {
    placeAddButtonFunction(p);
    const el = document.getElementById("placeNameInput" + (i + 1));
    const pa1 = el.children[0];
    const pl = pa1.children[1];
    pl.value = nameArr[i];
    const pa2 = el.children[1];
    const vl = pa2.children;
    vl[1].value = placeArr[0][i];
    vl[3].value = placeArr[1][i];
    state.dataInputArr["地点" + (i + 1)].layer = testData["地点" + (i + 1)];
  }
  placeNameInputFunction(p);
}

/**
 * 子ウィンドウ（地層データ編集画面）から地層データを受け取る処理。
 * window.opener経由で子ウィンドウから直接呼び出されるため、windowへの公開が必要。
 * @param {[string, Array]} arr [地点名, 地層データ配列]
 */
export function submit(arr) {
  const [name, dataArr] = arr;
  for (const key in state.dataInputArr) {
    let placeName = state.dataInputArr[key].name.value();
    if (placeName === "") placeName = key;
    if (placeName === name) {
      state.dataInputArr[key].layer = dataArr;
    }
  }
}

/**
 * 入力済みの地層データを子ウィンドウに引き継ぐための処理。
 * window.opener経由で子ウィンドウから直接呼び出されるため、windowへの公開が必要。
 * @param {string} placeName 地点名
 * @returns {Array} 地層データ配列
 */
export function loadLayers(placeName) {
  let arrKey = placeName;
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() === arrKey) {
      arrKey = key;
    }
  }
  return state.dataInputArr[arrKey].layer;
}
