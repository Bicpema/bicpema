import { state } from "./state.js";
import {
  placeAddButtonFunction,
  placeRemoveButtonFunction,
  strataAddButtonFunction,
  strataRemoveButtonFunction,
  setRadioButtonFunction,
  unitSelectFunction,
  strataFileInputFunction,
} from "./element-function.js";

/**
 * UI要素の生成とイベントリスナーの設定を担当する関数。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  state.buttonParent = p.select("#buttonParent");
  let placeAddButton = p.select("#placeAddButton");
  let placeRemoveButton = p.select("#placeRemoveButton");
  let strataAddButton = p.select("#strataAddButton");
  let strataRemoveButton = p.select("#strataRemoveButton");
  let setRadioParent = p.select("#setRadioParent");

  state.setRadioButton = p.createRadio().parent(setRadioParent);
  state.unitSelect = p.select("#unitSelect");
  state.strataFileInput = p.createFileInput((file) =>
    strataFileInputFunction(p, file)
  );

  state.buttonParent.position(5, 65);
  placeAddButton.mousePressed(() => placeAddButtonFunction(p));
  placeRemoveButton.mousePressed(() => placeRemoveButtonFunction(p));
  strataAddButton.mousePressed(() => strataAddButtonFunction(p));
  strataRemoveButton.mousePressed(() => strataRemoveButtonFunction());
  state.setRadioButton.option("自動", "auto");
  state.setRadioButton.option("手動", "manual");
  state.setRadioButton.value("auto");
  state.setRadioButton.changed(setRadioButtonFunction);
  state.unitSelect.option("緯度・経度", "latlng");
  state.unitSelect.option("メートル", "meter");
  state.unitSelect.changed(unitSelectFunction);
  state.strataFileInput.position(
    0,
    state.buttonParent.y + state.buttonParent.height + 5
  );
}

/**
 * p5設定と状態の初期化を行う関数。
 * @param {*} p p5インスタンス。
 */
export function initValue(p) {
  p.frameRate(60);
  p.textAlign(p.CENTER);
  p.textSize(20);
  p.textFont(state.font);
  state.rotateTime = 0;
}

