// html要素が全て読み込まれた後に読み込まれる
window.onload = () => {
  // 受け取った地点名入りURLから地点名を抽出
  placeName = decodeURI(location.search);
  placeName = placeName.substring(1, placeName.length);
  // 親ウィンドウがない場合の処理
  if (!window.opener || window.opener.closed) {
    window.alert("親ウィンドウがありません。");
    return false;
  }
  document.getElementById("placeName").innerHTML = placeName + "のデータを編集";
  document.title = placeName + "のデータを編集";

  // 入力済み地層データがあれば引き継ぎinputに入力
  let layers = window.opener.loadLayers(placeName);
  let layersNum = layers.length;
  for (let i = 0; i < layersNum; i++) {
    trAddButtonFunction();
    document.getElementById("td1Input" + (i + 1).toString()).value =
      layers[i][0];
    document.getElementById("td2Input" + (i + 1).toString()).value =
      layers[i][1];
    document.getElementById("td3Select" + (i + 1).toString()).value =
      layers[i][2];
  }
};

// 現在のtr要素の数
let trNum = 0;
// tr要素の要素の累計生成数
let trSum = 0;
// 現在のtr要素のidが格納されている
let idArr = [];
// 現在のtr要素が格納されている配列
let trArr = [];

// tr要素を追加するボタンを押した時の処理
function trAddButtonFunction() {
  trNum += 1;
  trSum += 1;
  let tr = new TR(trSum);
  trArr.push(tr);
  return trSum;
}

// DOM要素の生成
let trAddButton;
function elCreate() {
  trAddButton = select("#trAddButton");
}

// DOM要素の設定
function elInit() {
  trAddButton.mousePressed(trAddButtonFunction);
}

// setup関数
function setup() {
  createCanvas(0, 0);
  elCreate();
  elInit();
}

// draw関数
function draw() {
  // 取得した地層データの配列
  let strataData = [];

  // input要素からvalueを取得
  for (let i = 0; i < trArr.length; i++) {
    strataData.push([
      trArr[i].td1Input.value(),
      trArr[i].td2Input.value(),
      trArr[i].td3Select.value(),
    ]);
  }

  // ヘッダー部分のhtml要素から地点名を取得
  let name = document.getElementById("placeName").innerHTML;
  name = name.split("のデータを編集")[0];

  // 地点名と地層データが格納された配列を生成
  let arr = [name, strataData];

  // 親ウィンドウに送信
  window.opener.submit(arr);

  // 平面データの設定を常に更新
  window.opener.placeRefreshFunction();
  window.opener.firstPlaceSelectFunction();
  window.opener.secondPlaceSelectFunction();
  window.opener.thirdPlaceSelectFunction();
}

// 新しく生成するtable要素内のtrクラス
class TR {
  constructor(n) {
    // 新しく生成するtr要素の番号
    let num = n;

    // tr要素に関連するinput要素などの生成
    this.tr = createElement("tr")
      .id("tr" + num)
      .parent("tablebody");
    this.th = createElement("th")
      .id("th" + num)
      .html(trNum + "層目")
      .parent("tr" + num);
    this.td1 = createElement("td")
      .id("td1" + num)
      .parent("tr" + num);
    this.td1Input = createInput(0, "number")
      .id("td1Input" + num)
      .parent("td1" + num)
      .class("form-control");
    this.td2 = createElement("td")
      .id("td2" + num)
      .parent("tr" + num);
    this.td2Input = createInput(0, "number")
      .id("td2Input" + num)
      .parent("td2" + num)
      .class("form-control");
    this.td3 = createElement("td")
      .id("td3" + num)
      .parent("tr" + num);
    this.td3Select = createSelect()
      .id("td3Select" + num)
      .parent("td3" + num)
      .class("form-select");
    this.td4 = createElement("td")
      .id("td4" + num)
      .parent("tr" + num);

    // select要素（td3）にoption（選択肢）の追加
    this.td3SelectOptionArr = [
      "砂岩層",
      "泥岩層",
      "れき岩層",
      "石灰岩層",
      "凝灰岩層・火山灰層",
      "ローム層",
      "その他の層",
    ];
    for (let i = 0; i < this.td3SelectOptionArr.length; i++) {
      this.td3Select.option(this.td3SelectOptionArr[i]);
    }

    // 削除ボタンを押した時の処理
    function _removeButtonFunction() {
      select("#tr" + str(num)).remove();
      trArr.pop(num);
      trNum -= 1;
      idArr.splice(
        idArr.findIndex((idIndex) => idIndex == str(num)),
        1
      );
      for (let i = 0; i < idArr.length; i++) {
        select("#th" + idArr[i]).html(i + 1 + "層目");
      }
    }
    this.trRemoveButton = createButton("削除")
      .parent("td4" + num)
      .class("btn btn-outline-danger w-100")
      .id("trRemoveButton" + num)
      .mousePressed(_removeButtonFunction);
    idArr.push(str(num));
  }
}
