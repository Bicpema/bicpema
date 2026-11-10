// init.jsは初期処理専用のファイルです。

import type p5 from "p5";
import {
  initModal,
  initOffcanvas,
  initTabs
} from "../../../ts/bicpema-modal-controller.js";
import { state } from "./state.js";
import {
  onScreenshotClick,
  placeAddButtonFunction,
  placeRemoveButtonFunction,
  strataAddButtonFunction,
  strataRemoveButtonFunction,
  setRadioButtonFunction,
  unitSelectFunction,
  strataFileInputFunction
} from "./element-function.js";
import {
  CAMERA_EYE_X,
  CAMERA_EYE_Y,
  CAMERA_EYE_Z,
  FRAME_RATE,
  HEADER_HEIGHT,
  UI_EDGE_MARGIN
} from "./constants.js";

/**
 * DOM要素の参照を取得・生成する。
 * @param p - p5インスタンス
 */
export function elCreate(p: p5) {
  state.buttonParent = p.select("#buttonParent");
  state.placeAddButton = p.select("#placeAddButton");
  state.placeRemoveButton = p.select("#placeRemoveButton");
  state.strataAddButton = p.select("#strataAddButton");
  state.strataRemoveButton = p.select("#strataRemoveButton");

  const setRadioParent = p.select("#setRadioParent")!;
  state.setRadioButton = p.createRadio().parent(setRadioParent);

  state.unitSelect = p.select("#unitSelect");
  state.strataFileInput = p
    .createFileInput((file: p5.File) => strataFileInputFunction(file, p))
    .class(
      "block text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-500"
    );
}

/**
 * DOM要素の位置・イベントを設定する。
 * @param p - p5インスタンス
 */
export function elInit(p: p5) {
  state.buttonParent.position(UI_EDGE_MARGIN, HEADER_HEIGHT + UI_EDGE_MARGIN);
  state.buttonParent.elt.style.left = "auto";
  state.buttonParent.elt.style.right = `${UI_EDGE_MARGIN}px`;
  state.placeAddButton.mousePressed(() => placeAddButtonFunction(p));
  state.placeRemoveButton.mousePressed(() => placeRemoveButtonFunction(p));
  state.strataAddButton.mousePressed(() => strataAddButtonFunction(p));
  state.strataRemoveButton.mousePressed(() => strataRemoveButtonFunction());
  state.setRadioButton.option("auto", "自動");
  state.setRadioButton.option("manual", "手動");
  state.setRadioButton.selected("auto");
  state.setRadioButton.changed(setRadioButtonFunction);
  state.unitSelect.option("緯度・経度", "latlng");
  state.unitSelect.option("メートル", "meter");
  state.unitSelect.changed(unitSelectFunction);
  state.strataFileInput.position(
    0,
    state.buttonParent.y + state.buttonParent.height + UI_EDGE_MARGIN
  );
  state.strataFileInput.elt.style.left = "auto";
  state.strataFileInput.elt.style.right = `${UI_EDGE_MARGIN}px`;
}

/**
 * スクリーンショットボタンとモーダル・オフキャンバス・タブのUIを初期化する。
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
  initModal({
    openSelectors: ".csv-example-modal-open",
    modalSelector: "#csvExampleModal",
    closeSelectors: ".csv-example-modal-close"
  });
  initOffcanvas({
    openSelectors: ".legend-offcanvas-open",
    offcanvasSelector: "#legendOffCanvas",
    closeSelectors: ".offcanvas-close"
  });
  initTabs({ tabSelector: "#dataRegisterModal .nav-link" });
}

/**
 * カメラ位置・フレームレートなどシミュレーションの初期値を設定する。
 * @param p - p5インスタンス
 */
export function initValue(p: p5) {
  p.frameRate(FRAME_RATE);
  p.camera(CAMERA_EYE_X, CAMERA_EYE_Y, CAMERA_EYE_Z, 0, 0, 0, 0, 1, 0);
  state.rotateTime = 0;
}
