import { BicpemaCanvasController, CoordinateSystem } from './class.js';
export let font;
export let setRadioButton;
export let unitSelect;
export let coordinateData = null;
export function setCoordinateData(cd) { coordinateData = cd; }

// settingInit関数
// シミュレーションそのものの設定を行う関数
export let canvasController;
export let coordinateSystem;
export function settingInit() {
  canvasController = new BicpemaCanvasController(false, true);
  coordinateSystem = new CoordinateSystem(1000, 1000, 1000);
  canvasController.fullScreen();
  frameRate(60);
  textAlign(CENTER);
  textSize(20);
  textFont(font);
  camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
export let buttonParent;
export let screenshotButton;
// 地点を追加、削除するボタン
export let placeAddButton, placeRemoveButton;
// 平面を構成する地層の組を追加、削除するボタン
export let strataAddButton, strataRemoveButton;
export let setRadioParent;
export let strataFileInput;
export function elementSelectInit(strataFileInputFn) {
  buttonParent = select("#buttonParent");
  screenshotButton = select("#screenshotButton");
  placeAddButton = select("#placeAddButton");
  placeRemoveButton = select("#placeRemoveButton");
  strataAddButton = select("#strataAddButton");
  strataRemoveButton = select("#strataRemoveButton");

  setRadioParent = select("#setRadioParent");
  setRadioButton = createRadio().parent(setRadioParent);

  unitSelect = select("#unitSelect");
  strataFileInput = createFileInput(strataFileInputFn);
}

export function elementPositionInit() {
  buttonParent.position(5, 65);
  placeAddButton.mousePressed(placeAddButtonFunction);
  placeRemoveButton.mousePressed(placeRemoveButtonFunction);
  strataAddButton.mousePressed(strataAddButtonFunction);
  strataRemoveButton.mousePressed(strataRemoveButtonFunction);
  setRadioButton.option("自動", "auto");
  setRadioButton.option("手動", "manual");
  setRadioButton.value("auto");
  setRadioButton.changed(setRadioButtonFunction);
  unitSelect.option("緯度・経度", "latlng");
  unitSelect.option("メートル", "meter");
  unitSelect.changed(unitSelectFunction);
  strataFileInput.position(0, buttonParent.y + buttonParent.height + 5);
}

// 地点のデータを入力するインプットの連想配列
export let dataInputArr = {};
// データ構造
// dataInputArr = {
//   地点+地点番号:{
//     name: 地点の名前,
//     data:{
//       x: 経度,
//       y: 緯度
//     },
//     edit: データを編集するボタン,
//     layer:[
//       [
//         1層目の浅い方の深さ,
//         1層目の深い方の深さ,
//         岩層の種類,
//       ],
//       [
//         2層目の浅い方の深さ,
//         2層目の深い方の深さ,
//         岩層の種類,
//       ]
//     ]
//   }
// }

export let rotateTime;
export function valueInit() {
  rotateTime = 0;
}
