import { state } from "./state.js";
import {
  placeAddButtonFunction,
  placeRemoveButtonFunction,
  strataAddButtonFunction,
  strataRemoveButtonFunction,
  aSetButtonFunction,
  bSetButtonFunction,
  cSetButtonFunction,
  dSetButtonFunction,
  allSetButtonFunction,
} from "./element-function.js";

/**
 * UI要素の生成とイベントリスナーの設定を担当する関数。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  let placeAddButton = p.select("#placeAddButton");
  let placeRemoveButton = p.select("#placeRemoveButton");
  let strataAddButton = p.select("#strataAddButton");
  let strataRemoveButton = p.select("#strataRemoveButton");
  let aSetButton = p.select("#aSetButton");
  let bSetButton = p.select("#bSetButton");
  let cSetButton = p.select("#cSetButton");
  let dSetButton = p.select("#dSetButton");
  let allSetButton = p.select("#allSetButton");

  placeAddButton.mousePressed(() => placeAddButtonFunction(p));
  placeRemoveButton.mousePressed(() => placeRemoveButtonFunction(p));
  strataAddButton.mousePressed(() => strataAddButtonFunction(p));
  strataRemoveButton.mousePressed(() => strataRemoveButtonFunction());
  aSetButton.mousePressed(() => aSetButtonFunction(p));
  bSetButton.mousePressed(() => bSetButtonFunction(p));
  cSetButton.mousePressed(() => cSetButtonFunction(p));
  dSetButton.mousePressed(() => dSetButtonFunction(p));
  allSetButton.mousePressed(() => allSetButtonFunction(p));
}

/**
 * p5設定と状態の初期化を行う関数。
 * @param {*} p p5インスタンス。
 */
export function initValue(p) {
  p.camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
  p.frameRate(60);
  p.textAlign(p.CENTER);
  p.textSize(25);
  if (state.font) {
    p.textFont(state.font);
  }
  state.rotateTime = 0;
  state.allSetIs = false;
}
