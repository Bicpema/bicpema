import { state } from "./state.js";

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
    p.createElement("span", "地点" + String(this.n) + "：")
      .parent(this.inputGroup1)
      .class("input-group-text");
    this.placeNameInput = p
      .createInput()
      .parent(this.inputGroup1)
      .class("form-control")
      .input(() => placeNameInputFunction(p));
    p.createElement("span", "緯度")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.yInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    p.createElement("span", "経度")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.xInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    p.createDiv(
      "地点" + String(this.n) + "の名前、緯度、経度を入力してください。"
    )
      .parent(this.parentDiv)
      .class("form-text");
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
        "/simulations/3d-strata/childWindow.html?" + placeName,
        "window_name",
        "width=1000,height=500"
      );
    };
  placeRefreshFunction(p);
}

export function placeRemoveButtonFunction(p) {
  let placeNum = Object.keys(state.dataInputArr).length;
  if (placeNum > 0) {
    p.select("#placeNameInput" + String(placeNum)).remove();
    p.select("#placeDataInput" + String(placeNum)).remove();
    delete state.dataInputArr["地点" + placeNum];
  }
  placeRefreshFunction(p);
}

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

export function strataRemoveButtonFunction() {
  let strataSelect = document.getElementById("strataSelect");
  if (strataSelect.childElementCount > 0)
    strataSelect.removeChild(strataSelect.lastChild);
}

export function placeNameInputFunction(p) {
  let placeNum = Object.keys(state.dataInputArr).length;
  for (let i = 0; i < placeNum; i++) {
    let place = "地点" + String(i + 1);
    let placeName = state.dataInputArr[place].name.value();
    if (placeName === "") {
      placeName = place;
      state.dataInputArr[place].edit.html(
        "地点" + String(i + 1) + "のデータを編集"
      );
    } else {
      state.dataInputArr[place].edit.html(placeName + "のデータを編集");
    }
    document.getElementById("placeDataInput" + String(i + 1)).onclick = () => {
      window.open(
        "/simulations/3d-strata/childWindow.html?" + placeName,
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
  if (Object.keys(state.dataInputArr).length !== 0 && placeName !== "-") {
    let strataArr = state.dataInputArr[placeName]?.layer;
    if (!Array.isArray(strataArr)) strataArr = [];
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select2-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select2-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind === strataArr[j][2]) {
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

export function secondPlaceSelectFunction(p) {
  let secondPlaceSelect = p.select("#secondPlaceSelect");
  let secondPlaceName = document.getElementById("secondPlaceName");
  secondPlaceName.innerHTML = secondPlaceSelect.value();
  let placeName = secondPlaceName.innerHTML;
  for (let key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName !== "-") {
    let strataArr = state.dataInputArr[placeName]?.layer;
    if (!Array.isArray(strataArr)) strataArr = [];
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select3-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select3-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind === strataArr[j][2]) {
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

export function thirdPlaceSelectFunction(p) {
  let thirdPlaceSelect = p.select("#thirdPlaceSelect");
  let thirdPlaceName = document.getElementById("thirdPlaceName");
  thirdPlaceName.innerHTML = thirdPlaceSelect.value();
  let placeName = thirdPlaceName.innerHTML;
  for (let key in state.dataInputArr) {
    if (state.dataInputArr[key].name.value() === placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById("strataSelect").childElementCount;
  if (Object.keys(state.dataInputArr).length !== 0 && placeName !== "-") {
    let strataArr = state.dataInputArr[placeName]?.layer;
    if (!Array.isArray(strataArr)) strataArr = [];
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById("select4-" + String(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = p.select("#select1-" + String(i + 1)).value();
      let element = p.select("#select4-" + String(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind === strataArr[j][2]) {
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

export function strataSelectFunction(p) {
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}

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

export function loadTestDataButtonFunction(p) {
  if (Object.keys(state.dataInputArr).length === 0) {
    const name_arr = [
      "南白糸台小",
      "警察学校",
      "府中第六中",
      "府中第四小",
      "飛田給小",
      "府中第二中",
      "石原小",
    ];
    const place_arr = [
      [
        35.660552, 35.668404, 35.660752, 35.666669, 35.654647, 35.672779,
        35.660607,
      ],
      [
        139.516632, 139.519548, 139.507364, 139.507854, 139.523045, 139.508945,
        139.538435,
      ],
    ];
    const test_data = {
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
}

export function aSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount !== 0) {
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

export function bSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount !== 0) {
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

export function cSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount !== 0) {
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

export function dSetButtonFunction(p) {
  state.allSetIs = false;
  while (document.getElementById("strataSelect").childElementCount !== 0) {
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

export function allSetButtonFunction(p) {
  state.allSetIs = true;
  while (document.getElementById("strataSelect").childElementCount !== 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById("firstPlaceSelect").options[0].selected = true;
  document.getElementById("secondPlaceSelect").options[0].selected = true;
  document.getElementById("thirdPlaceSelect").options[0].selected = true;
  firstPlaceSelectFunction(p);
  secondPlaceSelectFunction(p);
  thirdPlaceSelectFunction(p);
}
