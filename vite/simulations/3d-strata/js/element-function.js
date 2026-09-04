// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { state, STRATA_KINDS } from "./state.js";
import { DOM } from "./class.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadScreenshot = createLazyImporter(() => import("modern-screenshot"));

/**
 * スクリーンショットボタンが押されたときの処理。
 * modern-screenshotはボタン押下時に初めて動的importする。
 */
export function onScreenshotClick() {
  const button = document.getElementById("screenshotButton");
  if (button) button.disabled = true;
  loadScreenshot()
    .then(({ domToPng }) => domToPng(document.body))
    .then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "screenshot.png";
      a.click();
    })
    .catch((error) => {
      console.error("スクリーンショットの取得に失敗しました。", error);
    })
    .finally(() => {
      if (button) button.disabled = false;
    });
}

/**
 * 地点名の入力欄が編集されたときの処理。
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
    document.getElementById("placeDataInput" + (i + 1)).onclick = function () {
      window.open(
        "/vite/simulations/3d-strata/childWindow.html?" +
          encodeURIComponent(placeName),
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

  document.getElementById("placeDataInput" + newPlaceNum).onclick =
    function () {
      window.open(
        "/vite/simulations/3d-strata/childWindow.html?" +
          encodeURIComponent(placeName),
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
 * 平面を構成する１つ目の地点のデータに関連する処理。
 * @param {*} p p5インスタンス
 */
export function firstPlaceSelectFunction(p) {
  const firstPlaceSelect = p.select("#firstPlaceSelect");
  const firstPlaceName = document.getElementById("firstPlaceName");
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (const key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  const trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length != 0 && placeName != "-") {
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
  if (Object.keys(state.dataInputArr).length != 0 && placeName != "-") {
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
  if (Object.keys(state.dataInputArr).length != 0 && placeName != "-") {
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
    if (placeName == "") {
      placeName = place;
    }
    firstPlaceSelect.option(placeName);
    secondPlaceSelect.option(placeName);
    thirdPlaceSelect.option(placeName);
  }
  // placeRefreshFunctionは地点の追加・削除のたびに呼び出されるため、
  // addEventListenerで都度追加すると呼び出し回数分ハンドラが多重登録されてしまう。
  // 同一要素に対して常に単一のハンドラのみを保つよう、プロパティ代入で上書きする。
  firstPlaceSelectDoc.onchange = () => firstPlaceSelectFunction(p);
  secondPlaceSelectDoc.onchange = () => secondPlaceSelectFunction(p);
  thirdPlaceSelectDoc.onchange = () => thirdPlaceSelectFunction(p);
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
 * 地点データが未登録の場合に、動作確認用のテストデータを読み込む処理。
 * @param {*} p p5インスタンス
 */
export function loadTestDataButtonFunction(p) {
  if (Object.keys(state.dataInputArr).length != 0) return;

  const nameArr = [
    "南白糸台小",
    "警察学校",
    "府中第六中",
    "府中第四小",
    "飛田給小",
    "府中第二中",
    "石原小",
  ];
  const placeArr = [
    [
      35.660552, 35.668404, 35.660752, 35.666669, 35.654647, 35.672779,
      35.660607,
    ],
    [
      139.516632, 139.519548, 139.507364, 139.507854, 139.523045, 139.508945,
      139.538435,
    ],
  ];
  const testData = {
    // "砂岩層","泥岩層","れき岩層","石灰岩層","凝灰岩層・火山灰層","ローム層","その他の層"
    // のいずれかから選択
    地点1: [
      [-36, -35, "その他の層"],
      [-35, -34, "ローム層"],
      [-34, -29, "れき岩層"],
      [-29, -25, "砂岩層"],
    ],
    地点2: [
      [-46, -44, "その他の層"],
      [-44, -42, "ローム層"],
      [-42, -37, "れき岩層"],
    ],
    地点3: [
      [-39, -38, "その他の層"],
      [-38, -35, "ローム層"],
      [-35, -27, "れき岩層"],
    ],
    地点4: [
      [-50, -49, "その他の層"],
      [-49, -48, "ローム層"],
      [-48, -44, "れき岩層"],
      [-44, -41, "砂岩層"],
      [-41, -37, "泥岩層"],
    ],
    地点5: [
      [-35, -34, "その他の層"],
      [-34, -28, "れき岩層"],
    ],
    地点6: [
      [-49, -48, "その他の層"],
      [-48, -45, "ローム層"],
      [-45, -38, "れき岩層"],
    ],
    地点7: [
      [-40, -39, "その他の層"],
      [-39, -36, "ローム層"],
      [-36, -32, "れき岩層"],
      [-32, -28, "泥岩層"],
    ],
  };
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
 * Aセットボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function aSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[1].selected = true;
  document.getElementById("secondPlaceSelect").options[3].selected = true;
  document.getElementById("thirdPlaceSelect").options[5].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
  for (let i = 0; i < 2; i++) strataAddButtonFunction(p);
  document.getElementById("select1-1").options[6].selected = true;
  document.getElementById("select1-2").options[2].selected = true;
  strataSelectFunction(p);
  document.getElementById("select2-1").options[0].selected = true;
  document.getElementById("select3-1").options[0].selected = true;
  document.getElementById("select4-1").options[0].selected = true;
  document.getElementById("select2-2").options[0].selected = true;
  document.getElementById("select3-2").options[0].selected = true;
  document.getElementById("select4-2").options[0].selected = true;
}

/**
 * Bセットボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function bSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[1].selected = true;
  document.getElementById("secondPlaceSelect").options[5].selected = true;
  document.getElementById("thirdPlaceSelect").options[7].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
  for (let i = 0; i < 2; i++) strataAddButtonFunction(p);
  document.getElementById("select1-1").options[6].selected = true;
  document.getElementById("select1-2").options[2].selected = true;
  strataSelectFunction(p);
  document.getElementById("select2-1").options[0].selected = true;
  document.getElementById("select3-1").options[0].selected = true;
  document.getElementById("select4-1").options[0].selected = true;
  document.getElementById("select2-2").options[0].selected = true;
  document.getElementById("select3-2").options[0].selected = true;
  document.getElementById("select4-2").options[0].selected = true;
}

/**
 * Cセットボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function cSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[1].selected = true;
  document.getElementById("secondPlaceSelect").options[4].selected = true;
  document.getElementById("thirdPlaceSelect").options[2].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
  for (let i = 0; i < 3; i++) strataAddButtonFunction(p);
  document.getElementById("select1-1").options[6].selected = true;
  document.getElementById("select1-2").options[5].selected = true;
  document.getElementById("select1-3").options[2].selected = true;
  strataSelectFunction(p);
  document.getElementById("select2-1").options[0].selected = true;
  document.getElementById("select3-1").options[0].selected = true;
  document.getElementById("select4-1").options[0].selected = true;
  document.getElementById("select2-2").options[0].selected = true;
  document.getElementById("select3-2").options[0].selected = true;
  document.getElementById("select4-2").options[0].selected = true;
  document.getElementById("select2-3").options[0].selected = true;
  document.getElementById("select3-3").options[0].selected = true;
  document.getElementById("select4-3").options[0].selected = true;
}

/**
 * Dセットボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function dSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[4].selected = true;
  document.getElementById("secondPlaceSelect").options[6].selected = true;
  document.getElementById("thirdPlaceSelect").options[2].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
  for (let i = 0; i < 3; i++) strataAddButtonFunction(p);
  document.getElementById("select1-1").options[6].selected = true;
  document.getElementById("select1-2").options[5].selected = true;
  document.getElementById("select1-3").options[2].selected = true;
  strataSelectFunction(p);
  document.getElementById("select2-1").options[0].selected = true;
  document.getElementById("select3-1").options[0].selected = true;
  document.getElementById("select4-1").options[0].selected = true;
  document.getElementById("select2-2").options[0].selected = true;
  document.getElementById("select3-2").options[0].selected = true;
  document.getElementById("select4-2").options[0].selected = true;
  document.getElementById("select2-3").options[0].selected = true;
  document.getElementById("select3-3").options[0].selected = true;
  document.getElementById("select4-3").options[0].selected = true;
}

/**
 * 「全体」ボタンを押した時の処理。
 * @param {*} p p5インスタンス
 */
export function allSetButtonFunction(p) {
  state.allSetIs = true;
  while (document.getElementById("strataSelect").childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[0].selected = true;
  document.getElementById("secondPlaceSelect").options[0].selected = true;
  document.getElementById("thirdPlaceSelect").options[0].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
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
    if (placeName == "") placeName = key;
    if (placeName == name) {
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
    if (state.dataInputArr[key].name.value() == arrKey) {
      arrKey = key;
    }
  }
  return state.dataInputArr[arrKey].layer;
}
