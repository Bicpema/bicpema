// jQueryとhtml2canvasのインポート
import $ from 'jquery';
import html2canvas from 'html2canvas';

// p5.jsがcommon.jsから読み込まれるのを待機
// common.jsでimport "p5"によりp5がグローバルに登録される
function waitForP5() {
  return new Promise(resolve => {
    if (typeof window.createCanvas !== 'undefined') {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window.createCanvas !== 'undefined') {
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
  document.getElementById('screenshotButton').addEventListener('click', () => {
    html2canvas(document.body).then(canvas => {
      downloadImage(canvas.toDataURL());
    });
  });
  function downloadImage(dataUrl) {
    const name = 'screenshot.png';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = name;
    a.click();
  }
};

//全画面表示
function fullScreen() {
  let p5Canvas = select('#p5Canvas');
  let canvas = createCanvas(windowWidth, windowHeight - 60, WEBGL);
  canvas.parent(p5Canvas).class('rounded border border-1');
}

// 外部ファイルの読み込み
// フォント変数を宣言（後で非同期で読み込む）
// Note: jaFont is declared in the global scope to ensure accessibility throughout the script
// after being loaded asynchronously via loadFont() in setup().
let jaFont = null;

// 地点を追加、削除するボタン
let placeAddButton, placeRemoveButton;

// 平面を構成する地層の組を追加、削除するボタン
let strataAddButton, strataRemoveButton;
let aSetButton, bSetButton, cSetButton, dSetButton, allSetButton;

// DOM要素の生成
function elCreate() {
  placeAddButton = select('#placeAddButton');
  placeRemoveButton = select('#placeRemoveButton');
  strataAddButton = select('#strataAddButton');
  strataRemoveButton = select('#strataRemoveButton');
  aSetButton = select('#aSetButton');
  bSetButton = select('#bSetButton');
  cSetButton = select('#cSetButton');
  dSetButton = select('#dSetButton');
  allSetButton = select('#allSetButton');
}

// 地点のデータを入力するインプットの連想配列
let dataInputArr = {};
// データ構造
// dataInputArr {地点+地点番号:
// {
// name: 地点の名前,
// data:
//     {
//         x: 経度,
//         y: 緯度
//     },
// edit: データを編集するボタン,
// layer:
//      [
//          [
//              1層目の浅い方の深さ,
//              1層目の深い方の深さ,
//              岩層の種類,
//          ],
//          [
//              2層目の浅い方の深さ,
//              2層目の深い方の深さ,
//              岩層の種類,
//          ]
//      ]
// }

// 地点データが入力された時に動く関数
function placeNameInputFunction() {
  // 地点データの数
  let placeNum = Object.keys(dataInputArr).length;

  // データを編集するボタンのhtml要素を書き換える繰り返し
  for (let i = 0; i < placeNum; i++) {
    let place = '地点' + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName == '') {
      placeName = place;
      dataInputArr[place].edit.html('地点' + str(i + 1) + 'のデータを編集');
    } else {
      dataInputArr[place].edit.html(placeName + 'のデータを編集');
    }
    document.getElementById('placeDataInput' + str(i + 1)).onclick = function () {
      let win = window.open(
        '/vite/simulations/3d-strata/childWindow.html?' + placeName,
        'window_name',
        'width=1000,height=500'
      );
    };
  }

  // 平面データの設定を常に更新
  placeRefreshFunction();
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 地点データの追加ボタンを押した時に動く関数
function placeAddButtonFunction() {
  // 地点データの数
  let placeNum = Object.keys(dataInputArr).length;

  // 新しく生成する地点データの番号
  let newPlaceNum = placeNum + 1;

  // 新しく生成する地点データ入力オブジェクト
  let newDom = new DOM(newPlaceNum);

  // 新しく生成する地点名
  let placeName = '地点' + str(newPlaceNum);

  // 生成したオブジェクトを連想配列に登録
  dataInputArr[placeName] = {
    name: newDom.placeNameInput,
    data: { x: '', y: '' },
    edit: '',
    layer: '',
  };
  dataInputArr[placeName]['data']['x'] = newDom.xInput;
  dataInputArr[placeName]['data']['y'] = newDom.yInput;
  dataInputArr[placeName]['edit'] = newDom.placeDataInput;

  // サブウィンドウを開く機構の付与
  document.getElementById('placeDataInput' + str(newPlaceNum)).onclick = function () {
    let win = window.open(
      '/vite/simulations/3d-strata/childWindow.html?' + placeName,
      'window_name',
      'width=1000,height=500'
    );
  };

  placeRefreshFunction();
}

// 地点データの削除ボタンを押した時に動く関数
function placeRemoveButtonFunction() {
  // 地点データの個数を取得
  let placeNum = Object.keys(dataInputArr).length;

  if (placeNum > 0) {
    select('#placeNameInput' + str(placeNum)).remove();
    select('#placeDataInput' + str(placeNum)).remove();
    delete dataInputArr['地点' + placeNum];
  }

  placeRefreshFunction();
}

// 平面を構成する１つ目の地点のデータに関連する処理
function firstPlaceSelectFunction() {
  let firstPlaceSelect = select('#firstPlaceSelect');
  let firstPlaceName = document.getElementById('firstPlaceName');
  firstPlaceName.innerHTML = firstPlaceSelect.value();
  let placeName = firstPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById('strataSelect').childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != '-') {
    let strataArr = dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select2-' + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = select('#select1-' + str(i + 1)).value();
      let element = select('#select2-' + str(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + 'm-' + strataArr[j][1] + 'm');
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select2-' + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する２つ目の地点のデータに関連する処理
function secondPlaceSelectFunction() {
  let secondPlaceSelect = select('#secondPlaceSelect');
  let secondPlaceName = document.getElementById('secondPlaceName');
  secondPlaceName.innerHTML = secondPlaceSelect.value();
  let placeName = secondPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById('strataSelect').childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != '-') {
    let strataArr = dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select3-' + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = select('#select1-' + str(i + 1)).value();
      let element = select('#select3-' + str(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + 'm-' + strataArr[j][1] + 'm');
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select3-' + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
    }
  }
}

// 平面を構成する３つ目の地点のデータに関連する処理
function thirdPlaceSelectFunction() {
  let thirdPlaceSelect = select('#thirdPlaceSelect');
  let thirdPlaceName = document.getElementById('thirdPlaceName');
  thirdPlaceName.innerHTML = thirdPlaceSelect.value();
  let placeName = thirdPlaceName.innerHTML;
  for (let key in dataInputArr) {
    if (dataInputArr[key].name.value() == placeName) {
      placeName = key;
    }
  }
  let trNum = document.getElementById('strataSelect').childElementCount;
  if (Object.keys(dataInputArr).length != 0 && placeName != '-') {
    let strataArr = dataInputArr[placeName].layer;
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select4-' + str(i + 1));
      while (strataSelect.childElementCount > 0) {
        strataSelect.remove(0);
      }
      let strataKind = select('#select1-' + str(i + 1)).value();
      let element = select('#select4-' + str(i + 1));
      for (let j = 0; j < strataArr.length; j++) {
        if (strataKind == strataArr[j][2]) {
          element.option(strataArr[j][0] + 'm-' + strataArr[j][1] + 'm');
        }
      }
    }
  } else {
    for (let i = 0; i < trNum; i++) {
      let strataSelect = document.getElementById('select4-' + str(i + 1));
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
  let firstPlaceSelect = select('#firstPlaceSelect');
  let secondPlaceSelect = select('#secondPlaceSelect');
  let thirdPlaceSelect = select('#thirdPlaceSelect');

  let firstPlaceSelectDoc = document.getElementById('firstPlaceSelect');
  let secondPlaceSelectDoc = document.getElementById('secondPlaceSelect');
  let thirdPlaceSelectDoc = document.getElementById('thirdPlaceSelect');

  while (firstPlaceSelectDoc.childElementCount > 0) {
    firstPlaceSelectDoc.remove(0);
  }
  while (secondPlaceSelectDoc.childElementCount > 0) {
    secondPlaceSelectDoc.remove(0);
  }
  while (thirdPlaceSelectDoc.childElementCount > 0) {
    thirdPlaceSelectDoc.remove(0);
  }
  firstPlaceSelect.option('-');
  secondPlaceSelect.option('-');
  thirdPlaceSelect.option('-');
  // 地点データの数
  let placeNum = Object.keys(dataInputArr).length;
  // データを編集するボタンのhtml要素を書き換える繰り返し
  for (let i = 0; i < placeNum; i++) {
    let place = '地点' + str(i + 1);
    let placeName = dataInputArr[place].name.value();
    if (placeName == '') {
      placeName = place;
    }
    firstPlaceSelect.option(placeName);
    secondPlaceSelect.option(placeName);
    thirdPlaceSelect.option(placeName);
  }
  firstPlaceSelectDoc.addEventListener('change', firstPlaceSelectFunction);
  secondPlaceSelectDoc.addEventListener('change', secondPlaceSelectFunction);
  thirdPlaceSelectDoc.addEventListener('change', thirdPlaceSelectFunction);
}
// グローバルに公開
window.placeRefreshFunction = placeRefreshFunction;
window.firstPlaceSelectFunction = firstPlaceSelectFunction;
window.secondPlaceSelectFunction = secondPlaceSelectFunction;
window.thirdPlaceSelectFunction = thirdPlaceSelectFunction;

// 平面を構成する地層の組を追加するボタンを押した時の処理
function strataAddButtonFunction() {
  let NextTrNum = document.getElementById('strataSelect').childElementCount + 1;
  let tr = createElement('tr')
    .parent('strataSelect')
    .id('tr-' + NextTrNum);
  let th = createElement('th', NextTrNum + '組目')
    .parent('tr-' + NextTrNum)
    .id('th-' + NextTrNum);
  let td1 = createElement('td')
    .parent('tr-' + NextTrNum)
    .id('td1-' + NextTrNum);
  let select1 = createSelect()
    .parent('td1-' + NextTrNum)
    .class('form-select')
    .id('select1-' + NextTrNum);
  let select1doc = document.getElementById('select1-' + NextTrNum);
  select1doc.addEventListener('change', strataSelectFunction);
  let strataArr = [
    '砂岩層',
    '泥岩層',
    'れき岩層',
    '石灰岩層',
    '凝灰岩層・火山灰層',
    'ローム層',
    'その他の層',
  ];
  for (let i = 0; i < strataArr.length; i++) select1.option(strataArr[i]);
  let td2 = createElement('td')
    .parent('tr-' + NextTrNum)
    .id('td2-' + NextTrNum);
  let select2 = createSelect()
    .parent('td2-' + NextTrNum)
    .class('form-select')
    .id('select2-' + NextTrNum);
  let td3 = createElement('td')
    .parent('tr-' + NextTrNum)
    .id('td3-' + NextTrNum);
  let select3 = createSelect()
    .parent('td3-' + NextTrNum)
    .class('form-select')
    .id('select3-' + NextTrNum);
  let td4 = createElement('td')
    .parent('tr-' + NextTrNum)
    .id('td4-' + NextTrNum);
  let select4 = createSelect()
    .parent('td4-' + NextTrNum)
    .class('form-select')
    .id('select4-' + NextTrNum);
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// 平面を構成する地層の組を削除するボタンを押した時の処理
function strataRemoveButtonFunction() {
  let strataSelect = document.getElementById('strataSelect');
  if (strataSelect.childElementCount > 0) strataSelect.removeChild(strataSelect.lastChild);
}

function loadTestDataButtonFunction() {
  if (Object.keys(dataInputArr).length == 0) {
    let name_arr = [
      '南白糸台小',
      '警察学校',
      '府中第六中',
      '府中第四小',
      '飛田給小',
      '府中第二中',
      '石原小',
    ];
    let place_arr = [
      [35.660552, 35.668404, 35.660752, 35.666669, 35.654647, 35.672779, 35.660607],
      [139.516632, 139.519548, 139.507364, 139.507854, 139.523045, 139.508945, 139.538435],
    ];
    let test_data = {
      // "砂岩層","泥岩層","れき岩層","石灰岩層","凝灰岩層・火山灰層","ローム層","その他の層"
      // のいずれかから選択
      地点1: [
        // [-53, -36, "その他の層"],
        [-36, -35, 'その他の層'],
        [-35, -34, 'ローム層'],
        [-34, -29, 'れき岩層'],
        [-29, -25, '砂岩層'],
      ],
      地点2: [
        // [-53, -46, "その他の層"],
        [-46, -44, 'その他の層'],
        [-44, -42, 'ローム層'],
        [-42, -37, 'れき岩層'],
      ],
      地点3: [
        // [-53, -39, "その他の層"],
        [-39, -38, 'その他の層'],
        [-38, -35, 'ローム層'],
        [-35, -27, 'れき岩層'],
      ],
      地点4: [
        // [-53, -50, "その他の層"],
        [-50, -49, 'その他の層'],
        [-49, -48, 'ローム層'],
        [-48, -44, 'れき岩層'],
        [-44, -41, '砂岩層'],
        [-41, -37, '泥岩層'],
      ],
      地点5: [
        // [-53, -35, "その他の層"],
        [-35, -34, 'その他の層'],
        [-34, -28, 'れき岩層'],
      ],
      地点6: [
        // [-53, -49, "その他の層"],
        [-49, -48, 'その他の層'],
        [-48, -45, 'ローム層'],
        [-45, -38, 'れき岩層'],
      ],
      地点7: [
        // [-53, -40, "その他の層"],
        [-40, -39, 'その他の層'],
        [-39, -36, 'ローム層'],
        [-36, -32, 'れき岩層'],
        [-32, -28, '泥岩層'],
      ],
    };
    for (let i = 0; i < name_arr.length; i++) {
      placeAddButtonFunction();
      let el = document.getElementById('placeNameInput' + (i + 1));
      let pa1 = el.children[0];
      let pl = pa1.children[1];
      pl.value = name_arr[i];
      let pa2 = el.children[1];
      let vl = pa2.children;
      vl[1].value = place_arr[0][i];
      vl[3].value = place_arr[1][i];
      dataInputArr['地点' + (i + 1)].layer = test_data['地点' + (i + 1)];
    }
    placeNameInputFunction();
  }
}

function aSetButtonFunction() {
  allSetIs = false;
  while (document.getElementById('strataSelect').childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById('firstPlaceSelect').options[1].selected = true;
  document.getElementById('secondPlaceSelect').options[3].selected = true;
  document.getElementById('thirdPlaceSelect').options[5].selected = true;
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
  for (let i = 0; i < 2; i++) strataAddButtonFunction();
  document.getElementById('select1-1').options[6].selected = true;
  document.getElementById('select1-2').options[2].selected = true;
  strataSelectFunction();
  // １層目
  document.getElementById('select2-1').options[0].selected = true;
  document.getElementById('select3-1').options[0].selected = true;
  document.getElementById('select4-1').options[0].selected = true;
  // ２層目
  document.getElementById('select2-2').options[0].selected = true;
  document.getElementById('select3-2').options[0].selected = true;
  document.getElementById('select4-2').options[0].selected = true;
}

function bSetButtonFunction() {
  allSetIs = false;
  while (document.getElementById('strataSelect').childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById('firstPlaceSelect').options[1].selected = true;
  document.getElementById('secondPlaceSelect').options[5].selected = true;
  document.getElementById('thirdPlaceSelect').options[7].selected = true;
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
  for (let i = 0; i < 2; i++) strataAddButtonFunction();
  document.getElementById('select1-1').options[6].selected = true;
  document.getElementById('select1-2').options[2].selected = true;
  strataSelectFunction();
  // １層目
  document.getElementById('select2-1').options[0].selected = true;
  document.getElementById('select3-1').options[0].selected = true;
  document.getElementById('select4-1').options[0].selected = true;
  // ２層目
  document.getElementById('select2-2').options[0].selected = true;
  document.getElementById('select3-2').options[0].selected = true;
  document.getElementById('select4-2').options[0].selected = true;
}

function cSetButtonFunction() {
  allSetIs = false;
  while (document.getElementById('strataSelect').childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById('firstPlaceSelect').options[1].selected = true;
  document.getElementById('secondPlaceSelect').options[4].selected = true;
  document.getElementById('thirdPlaceSelect').options[2].selected = true;
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
  for (let i = 0; i < 3; i++) strataAddButtonFunction();
  document.getElementById('select1-1').options[6].selected = true;
  document.getElementById('select1-2').options[5].selected = true;
  document.getElementById('select1-3').options[2].selected = true;
  strataSelectFunction();
  // １層目
  document.getElementById('select2-1').options[0].selected = true;
  document.getElementById('select3-1').options[0].selected = true;
  document.getElementById('select4-1').options[0].selected = true;
  // ２層目
  document.getElementById('select2-2').options[0].selected = true;
  document.getElementById('select3-2').options[0].selected = true;
  document.getElementById('select4-2').options[0].selected = true;
  // ３層目
  document.getElementById('select2-3').options[0].selected = true;
  document.getElementById('select3-3').options[0].selected = true;
  document.getElementById('select4-3').options[0].selected = true;
}
function dSetButtonFunction() {
  allSetIs = false;
  while (document.getElementById('strataSelect').childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById('firstPlaceSelect').options[4].selected = true;
  document.getElementById('secondPlaceSelect').options[6].selected = true;
  document.getElementById('thirdPlaceSelect').options[2].selected = true;
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
  for (let i = 0; i < 3; i++) strataAddButtonFunction();
  document.getElementById('select1-1').options[6].selected = true;
  document.getElementById('select1-2').options[5].selected = true;
  document.getElementById('select1-3').options[2].selected = true;
  strataSelectFunction();
  // １層目
  document.getElementById('select2-1').options[0].selected = true;
  document.getElementById('select3-1').options[0].selected = true;
  document.getElementById('select4-1').options[0].selected = true;
  // ２層目
  document.getElementById('select2-2').options[0].selected = true;
  document.getElementById('select3-2').options[0].selected = true;
  document.getElementById('select4-2').options[0].selected = true;
  // ３層目
  document.getElementById('select2-3').options[0].selected = true;
  document.getElementById('select3-3').options[0].selected = true;
  document.getElementById('select4-3').options[0].selected = true;
}
// DOM要素の設定
function elInit() {
  placeAddButton.mousePressed(placeAddButtonFunction);
  placeRemoveButton.mousePressed(placeRemoveButtonFunction);
  strataAddButton.mousePressed(strataAddButtonFunction);
  strataRemoveButton.mousePressed(strataRemoveButtonFunction);
  aSetButton.mousePressed(aSetButtonFunction);
  bSetButton.mousePressed(bSetButtonFunction);
  cSetButton.mousePressed(cSetButtonFunction);
  dSetButton.mousePressed(dSetButtonFunction);
  allSetButton.mousePressed(allSetButtonFunction);
}

// 全体表示の判定
let allSetIs;
// 初期値やシミュレーションの設定
function initValue() {
  camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
  allSetIs = false;
}

// setup関数
function setup() {
  fullScreen();
  elCreate();
  elInit();
  initValue();
  loadTestDataButtonFunction();
  // フォントを非同期で読み込む（読み込み失敗してもシミュレーションは動作する）
  loadFont(
    'https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580',
    font => {
      jaFont = font;
      textFont(jaFont);
      textSize(25);
      textAlign(CENTER);
    },
    () => {
      // フォント読み込み失敗時はテキストを表示しない
      console.warn('Japanese font could not be loaded. Text labels will not be displayed.');
    }
  );
}

// 緯度経度、深さの最小値と最大値を計算する関数
function calculateValue() {
  let latitudeArr = [];
  let longitudeArr = [];
  let depthArr = [];
  for (let key in dataInputArr) {
    let value = dataInputArr[key];
    let data = value.data;
    let latitude = data.y.value();
    let longitude = data.x.value();
    if (latitude != '') {
      latitudeArr.push(latitude);
    } else {
      latitudeArr.push(0);
    }
    if (longitude != '') {
      longitudeArr.push(longitude);
    } else {
      longitudeArr.push(0);
    }
    let layer = value.layer;
    for (let i = 0; i < layer.length; i++) {
      depthArr.push(layer[i][0], layer[i][1]);
    }
  }
  return {
    x: {
      min: min(longitudeArr),
      max: max(longitudeArr),
    },
    y: {
      min: min(latitudeArr),
      max: max(latitudeArr),
    },
    z: {
      min: min(depthArr),
      max: max(depthArr),
    },
  };
}

//背景を設定する関数
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
    if (x % 100 == 0) {
      push();
      translate(-500, 0, 500);
      let xMap = map(x, 0, 1000, float(xMin), float(xMax));
      if (xMin == xMax) xMap = x / 100;
      if (jaFont) text(nf(xMap, 1, 4), x, -10);
      pop();
    }
  }
  push();
  translate(0, 0, 500);
  if (jaFont) text('経度', 0, -50);
  pop();

  for (let z = 0; z <= 500; z += 50) {
    line(-500, z, -500, 500, z, -500);
    line(-500, z, -500, -500, z, 500);
    line(-500, z, 500, 500, z, 500);
    line(500, z, -500, 500, z, 500);
    if (z % 100 == 0) {
      push();
      translate(0, 0, -500);
      let zMap = map(z, 0, 500, zMin, zMax);
      if (zMin == zMax) zMap = z;
      if (jaFont) text(nf(zMap, 1, 4), -500, z);
      pop();
    }
  }
  push();
  translate(0, 0, -500);
  if (jaFont) text('深さ', -550, 250, 0);
  pop();
  for (let y = 0; y <= 1000; y += 50) {
    line(-500, 0, y - 500, 500, 0, y - 500);
    line(-500, 0, y - 500, -500, 500, y - 500);
    line(500, 0, y - 500, 500, 500, y - 500);
    if (y % 100 == 0) {
      push();
      let yMap = map(y, 1000, 0, yMin, yMax);
      if (yMin == yMax) yMap = (1000 - y) / 100;
      rotateY(PI / 2);
      translate(-y + 500, 0, 500);
      if (jaFont) text(nf(yMap, 1, 4), 0, -10);
      pop();
    }
  }
  push();
  rotateY(PI / 2);
  translate(0, -50, 500);
  if (jaFont) text('緯度', 0, -10);
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

// 子ウィンドウからデータを取得するための関数
function submit(arr) {
  let name = arr[0];
  let dataArr = arr[1];
  for (let key in dataInputArr) {
    let placeName = dataInputArr[key].name.value();
    if (placeName == '') placeName = key;
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
  return layers;
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
    text('東', x + 70, y + 8);
    text('西', x - 70, y + 8);
    text('南', x, y + 70 + 60);
    text('北', x, y - 70 - 40);
  }
  pop();
}

// 地層の平面を描画する処理
function drawStrata(key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax) {
  let name = dataInputArr[key].name.value();
  if (name == '') name = key;
  let data = dataInputArr[key].data;
  let x = data.x.value();
  if (x == '') x = 0;
  x = map(x, xMin, xMax, -500, 500);
  let y = data.y.value();
  if (y == '') y = 0;
  y = map(y, yMin, yMax, 500, -500);
  let layer = dataInputArr[key].layer;
  noStroke();
  let zArr = [];
  for (let i = 0; i < layer.length; i++) {
    let z = layer[i][0];
    zArr.push(z);
    let zLength = layer[i][1] - layer[i][0];
    let kind = layer[i][2];
    if (kind == '砂岩層') fill(215, 205, 166, 200);
    if (kind == '泥岩層') fill(156, 154, 143, 200);
    if (kind == 'れき岩層') fill(252, 180, 172, 200);
    if (kind == '石灰岩層') fill(120, 170, 170, 200);
    if (kind == '凝灰岩層・火山灰層') fill(200, 200, 200, 200);
    if (kind == 'ローム層') fill(112, 58, 21, 200);
    if (kind == 'その他の層') fill(0, 200);
    push();
    translate(x, map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2, y);
    box(50, map(zLength, 0, zMax - zMin, 0, 500), 50);
    translate(100, 10, 0);
    fill(0);
    if (jaFont) text(kind, 0, 0);
    pop();
    fill(0);
    push();
    if (jaFont) {
      text(kind, x, map(z, zMin, zMax, 0, 500) + map(zLength, 0, zMax - zMin, 0, 500) / 2);
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

let allSetData = {
  aSet: {
    layers: ['その他の層', 'れき岩層'],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [-500, 95.29786617744429],
      [4.682823211423681, 291.78333494271374],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [267.85714285714283, 250],
        [339.2857142857143, 321.42857142857144],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [464.2857142857143, 321.42857142857144],
        [446.42857142857144, 339.2857142857143],
      ],
    ],
  },
  bSet: {
    layers: ['その他の層', 'れき岩層'],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [4.682823211423681, 291.78333494271374],
      [500, 99.9645972129245],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [339.2857142857143, 321.42857142857144],
        [250, 232.14285714285714],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [446.42857142857144, 339.2857142857143],
        [375, 303.57142857142856],
      ],
    ],
  },
  cSet: {
    layers: ['その他の層', 'ローム層', 'れき岩層'],
    coordinates: [
      [-201.7154259601411, 101.7347365710445],
      [-484.2296675352107, -95.13694441755285],
      [-107.86585562126254, -150.97679508228043],
    ],
    ranges: [
      [
        [321.42857142857144, 303.57142857142856],
        [71.42857142857143, 53.57142857142857],
        [160.71428571428572, 125],
      ],
      [
        [339.2857142857143, 321.42857142857144],
        [89.28571428571429, 71.42857142857143],
        [196.42857142857142, 160.71428571428572],
      ],
      [
        [428.57142857142856, 339.2857142857143],
        [160.71428571428572, 89.28571428571429],
        [285.7142857142857, 196.42857142857142],
      ],
    ],
  },
  dSet: {
    layers: ['その他の層', 'ローム層', 'れき岩層'],
    coordinates: [
      [-484.2296675352107, -95.13694441755285],
      [-449.11653953796264, -291.7833349424851],
      [-107.86585562126254, -150.97679508228043],
    ],
    ranges: [
      [
        [71.42857142857143, 53.57142857142857],
        [89.28571428571429, 71.42857142857143],
        [160.71428571428572, 125],
      ],
      [
        [89.28571428571429, 71.42857142857143],
        [142.85714285714286, 89.28571428571429],
        [196.42857142857142, 160.71428571428572],
      ],
      [
        [160.71428571428572, 89.28571428571429],
        [267.85714285714283, 142.85714285714286],
        [285.7142857142857, 196.42857142857142],
      ],
    ],
  },
};

// draw関数
let rotateTime = 0;
function draw() {
  let coordinateData = calculateValue();
  let xMin = coordinateData.x.min;
  if (xMin == Infinity) xMin = 0;
  let xMax = coordinateData.x.max;
  if (xMax == -Infinity) xMax = 0;
  let xLen = xMax - xMin;
  let yMin = coordinateData.y.min;
  if (yMin == Infinity) yMin = 0;
  let yMax = coordinateData.y.max;
  if (yMax == -Infinity) yMax = 0;
  let yLen = yMax - yMin;
  let unitLen = max([xLen, yLen]);
  if (xLen <= yLen) {
    let addLenValue = (unitLen - xLen) / 2;
    xMin -= addLenValue;
    xMax += addLenValue;
  } else {
    let addLenValue = (unitLen - yLen) / 2;
    yMin = float(yMin);
    yMin -= addLenValue;
    yMax = float(yMax);
    yMax += addLenValue;
  }
  let zMin = coordinateData.z.min;
  if (zMin == Infinity) zMin = 0;
  // 緊急的な措置としての変数の代入
  // 今後軸ラベルの最小値と最大値をスライダーで変更できる仕様に変える必要がある
  zMin = -53;
  let zMax = coordinateData.z.max;
  if (zMax == -Infinity) zMax = 0;
  backgroundSetting(xMin, xMax, yMin, yMax, zMin, zMax);
  drawDirMark(-600, -600);

  // データ登録モーダルを開いている時にオービットコントロールを無効化
  let modalIs = $('#dataRegisterModal').is(':hidden');
  if (modalIs) {
    orbitControl(2);
  }

  rotateTime += 2;
  for (let key in dataInputArr) {
    drawStrata(key, rotateTime, xMin, xMax, yMin, yMax, zMin, zMax);
  }

  let trNum = document.getElementById('strataSelect').childElementCount;
  let p1Name = select('#firstPlaceSelect').value();
  let p2Name = select('#secondPlaceSelect').value();
  let p3Name = select('#thirdPlaceSelect').value();
  if (p1Name != '-' && p2Name != '-' && p3Name != '-') {
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
      let select1 = select('#select1-' + str(i + 1)).value();
      let select2 = select('#select2-' + str(i + 1)).value();
      let select3 = select('#select3-' + str(i + 1)).value();
      let select4 = select('#select4-' + str(i + 1)).value();
      if (select2 == '' || select3 == '' || select4 == '') {
        continue;
      }
      let p1Min = select2.substr(0, select2.indexOf('m-'));
      let p1Max = select2.substr(select2.indexOf('m-') + 2);
      p1Max = p1Max.substr(0, p1Max.indexOf('m'));
      let p2Min = select3.substr(0, select3.indexOf('m-'));
      let p2Max = select3.substr(select3.indexOf('m-') + 2);
      p2Max = p2Max.substr(0, p2Max.indexOf('m'));
      let p3Min = select4.substr(0, select4.indexOf('m-'));
      let p3Max = select4.substr(select4.indexOf('m-') + 2);
      p3Max = p3Max.substr(0, p3Max.indexOf('m'));

      p1Min = map(p1Min, zMin, zMax, 0, 500);
      p1Max = map(p1Max, zMin, zMax, 0, 500);
      p2Min = map(p2Min, zMin, zMax, 0, 500);
      p2Max = map(p2Max, zMin, zMax, 0, 500);
      p3Min = map(p3Min, zMin, zMax, 0, 500);
      p3Max = map(p3Max, zMin, zMax, 0, 500);

      if (select1 == '砂岩層') fill(215, 205, 166, 150);
      if (select1 == '泥岩層') fill(156, 154, 143, 150);
      if (select1 == 'れき岩層') fill(252, 180, 172, 150);
      if (select1 == '石灰岩層') fill(120, 170, 170, 150);
      if (select1 == '凝灰岩層・火山灰層') fill(200, 200, 200, 150);
      if (select1 == 'ローム層') fill(112, 58, 21, 150);
      if (select1 == 'その他の層') fill(0, 150);
      createPlane1(p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min);
      createPlane1(p1[0], p1[1], p1Max, p2[0], p2[1], p2Max, p3[0], p3[1], p3Max);
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
  if (allSetIs) {
    for (let key in allSetData) {
      let layers = allSetData[key].layers;
      let coordinates = allSetData[key].coordinates;
      let ranges = allSetData[key].ranges;
      let p1 = coordinates[0];
      let p2 = coordinates[1];
      let p3 = coordinates[2];
      for (let i = 0; i < layers.length; i++) {
        let layer = layers[i];
        let range = ranges[i];
        let p1Max = range[0][0];
        let p1Min = range[0][1];
        let p2Max = range[1][0];
        let p2Min = range[1][1];
        let p3Max = range[2][0];
        let p3Min = range[2][1];
        if (layer == '砂岩層') fill(215, 205, 166, 150);
        if (layer == '泥岩層') fill(156, 154, 143, 150);
        if (layer == 'れき岩層') fill(252, 180, 172, 150);
        if (layer == '石灰岩層') fill(120, 170, 170, 150);
        if (layer == '凝灰岩層・火山灰層') fill(200, 200, 200, 150);
        if (layer == 'ローム層') fill(112, 58, 21, 150);
        if (layer == 'その他の層') fill(0, 150);
        createPlane1(p1[0], p1[1], p1Min, p2[0], p2[1], p2Min, p3[0], p3[1], p3Min);
        createPlane1(p1[0], p1[1], p1Max, p2[0], p2[1], p2Max, p3[0], p3[1], p3Max);
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
}

// windowがリサイズされたときの処理
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 60);
  elInit();
  initValue();
}

function allSetButtonFunction() {
  allSetIs = true;
  while (document.getElementById('strataSelect').childElementCount != 0) {
    strataRemoveButtonFunction();
  }
  document.getElementById('firstPlaceSelect').options[0].selected = true;
  document.getElementById('secondPlaceSelect').options[0].selected = true;
  document.getElementById('thirdPlaceSelect').options[0].selected = true;
  firstPlaceSelectFunction();
  secondPlaceSelectFunction();
  thirdPlaceSelectFunction();
}

// DOM要素のクラス
class DOM {
  constructor(n) {
    this.n = n;
    this.parentDiv = createDiv()
      .parent(placePointNameInput)
      .class('mb-2')
      .id('placeNameInput' + str(this.n));
    this.inputGroup1 = createDiv().parent(this.parentDiv).class('input-group');
    this.inputGroup2 = createDiv().parent(this.parentDiv).class('input-group');
    // input要素の上の部分
    createElement('span', '地点' + str(this.n) + '：')
      .parent(this.inputGroup1)
      .class('input-group-text');
    this.placeNameInput = createInput()
      .parent(this.inputGroup1)
      .class('form-control')
      .input(placeNameInputFunction);
    // input要素の下の部分
    createElement('span', '緯度').parent(this.inputGroup2).class('input-group-text');
    this.yInput = createInput(0, 'number').parent(this.inputGroup2).class('form-control');
    createElement('span', '経度').parent(this.inputGroup2).class('input-group-text');
    this.xInput = createInput(0, 'number').parent(this.inputGroup2).class('form-control');
    createDiv('地点' + str(this.n) + 'の名前、緯度、経度を入力してください。')
      .parent(this.parentDiv)
      .class('form-text');
    // サブウィンドウ生成用のDOM
    this.placeDataInput = createA('javascript:void(0)', '地点' + str(this.n) + 'のデータを編集')
      .class('btn btn-outline-primary mb-2')
      .parent('placePointDataInput')
      .id('placeDataInput' + str(this.n));
  }
}

// p5.jsのグローバルモードのためにsetup/draw関数をwindowオブジェクトに公開
window.setup = setup;
window.draw = draw;
