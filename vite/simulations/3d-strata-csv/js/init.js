// init.jsは初期処理専用のファイルです。

import {
  initModal,
  initOffcanvas,
  initTabs,
} from "../../../js/bicpema-modal-controller.js";
import { state } from "./state.js";
import {
  onScreenshotClick,
  placeAddButtonFunction,
  placeRemoveButtonFunction,
  strataAddButtonFunction,
  strataRemoveButtonFunction,
  setRadioButtonFunction,
  unitSelectFunction,
  strataFileInputFunction,
} from "./element-function.js";

/** 日本語フォントのURL */
const JA_FONT_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580";

/**
 * DOM要素の参照を取得・生成する。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.buttonParent = p.select("#buttonParent");
  state.placeAddButton = p.select("#placeAddButton");
  state.placeRemoveButton = p.select("#placeRemoveButton");
  state.strataAddButton = p.select("#strataAddButton");
  state.strataRemoveButton = p.select("#strataRemoveButton");

  const setRadioParent = p.select("#setRadioParent");
  state.setRadioButton = p.createRadio().parent(setRadioParent);

  state.unitSelect = p.select("#unitSelect");
  state.strataFileInput = p
    .createFileInput((file) => strataFileInputFunction(file, p))
    .class(
      "block text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-500"
    );
}

/**
 * DOM要素の位置・イベントを設定する。
 * @param {*} p p5インスタンス
 */
export function elInit(p) {
  state.buttonParent.position(5, 65);
  state.buttonParent.elt.style.left = "auto";
  state.buttonParent.elt.style.right = "5px";
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
    state.buttonParent.y + state.buttonParent.height + 5
  );
  state.strataFileInput.elt.style.left = "auto";
  state.strataFileInput.elt.style.right = "5px";
}

/**
 * スクリーンショットボタンとモーダル・オフキャンバス・タブのUIを初期化する。
 */
export function uiInit() {
  document
    .getElementById("screenshotButton")
    .addEventListener("click", onScreenshotClick);
  initModal({
    openSelectors: ".data-register-modal-open",
    modalSelector: "#dataRegisterModal",
    closeSelectors: ".modal-close",
  });
  initModal({
    openSelectors: ".csv-example-modal-open",
    modalSelector: "#csvExampleModal",
    closeSelectors: ".csv-example-modal-close",
  });
  initOffcanvas({
    openSelectors: ".legend-offcanvas-open",
    offcanvasSelector: "#legendOffCanvas",
    closeSelectors: ".offcanvas-close",
  });
  initTabs({ tabSelector: "#dataRegisterModal .nav-link" });
}

/**
 * カメラ位置・フレームレートなどシミュレーションの初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(60);
  p.textAlign(p.CENTER);
  p.textSize(20);
  p.camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
  state.rotateTime = 0;
}

/**
 * 日本語フォントを非同期で読み込む（読み込み失敗してもシミュレーションは動作する）。
 * @param {*} p p5インスタンス
 */
export function loadJapaneseFont(p) {
  p.loadFont(
    JA_FONT_URL,
    (font) => {
      state.jaFont = font;
      p.textFont(state.jaFont);
    },
    () => {
      console.warn(
        "Japanese font could not be loaded. Text labels will not be displayed."
      );
    }
  );
}
