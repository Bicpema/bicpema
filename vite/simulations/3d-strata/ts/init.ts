// init.jsは初期処理専用のファイルです。

import type p5 from "p5";
import {
  initModal,
  initCollapse,
  initTabs
} from "../../../ts/bicpema-modal-controller.js";
import { state } from "./state.js";
import {
  onScreenshotClick,
  placeAddButtonFunction,
  placeRemoveButtonFunction,
  strataAddButtonFunction,
  strataRemoveButtonFunction,
  aSetButtonFunction,
  bSetButtonFunction,
  cSetButtonFunction,
  dSetButtonFunction,
  allSetButtonFunction
} from "./element-function.js";
import { CAMERA_EYE_X, CAMERA_EYE_Y, CAMERA_EYE_Z } from "./constants.js";

/**
 * DOM要素の参照を取得する。
 * @param p - p5インスタンス
 */
export function elCreate(p: p5) {
  state.placeAddButton = p.select("#placeAddButton");
  state.placeRemoveButton = p.select("#placeRemoveButton");
  state.strataAddButton = p.select("#strataAddButton");
  state.strataRemoveButton = p.select("#strataRemoveButton");
  state.aSetButton = p.select("#aSetButton");
  state.bSetButton = p.select("#bSetButton");
  state.cSetButton = p.select("#cSetButton");
  state.dSetButton = p.select("#dSetButton");
  state.allSetButton = p.select("#allSetButton");
}

/**
 * DOM要素にイベントを設定する。
 * @param p - p5インスタンス
 */
export function elInit(p: p5) {
  state.placeAddButton.mousePressed(() => placeAddButtonFunction(p));
  state.placeRemoveButton.mousePressed(() => placeRemoveButtonFunction(p));
  state.strataAddButton.mousePressed(() => strataAddButtonFunction(p));
  state.strataRemoveButton.mousePressed(() => strataRemoveButtonFunction());
  state.aSetButton.mousePressed(() => aSetButtonFunction(p));
  state.bSetButton.mousePressed(() => bSetButtonFunction(p));
  state.cSetButton.mousePressed(() => cSetButtonFunction(p));
  state.dSetButton.mousePressed(() => dSetButtonFunction(p));
  state.allSetButton.mousePressed(() => allSetButtonFunction(p));
}

/**
 * スクリーンショットボタンとモーダル・折りたたみ・タブのUIを初期化する。
 */
export function uiInit() {
  document
    .getElementById("screenshotButton")
    ?.addEventListener("click", onScreenshotClick);
  initModal({
    openSelectors: ".data-register-modal-open",
    modalSelector: "#dataRegisterModal",
    closeSelectors: ".modal-close"
  });
  initCollapse({
    toggleSelectors: ".collapse-toggle",
    targetSelector: "#collapse"
  });
  initTabs({ tabSelector: "#dataRegisterModal .nav-link" });
}

/**
 * カメラ位置などシミュレーションの初期値を設定する。
 * @param p - p5インスタンス
 */
export function initValue(p: p5) {
  p.camera(CAMERA_EYE_X, CAMERA_EYE_Y, CAMERA_EYE_Z, 0, 0, 0, 0, 1, 0);
  state.allSetIs = false;
}
