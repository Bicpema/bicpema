// init.jsは初期処理専用のファイルです。

import {
  initModal,
  initCollapse,
  initTabs,
} from "../../../js/bicpema-modal-controller.js";
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
  allSetButtonFunction,
} from "./element-function.js";

/** 日本語フォントのURL */
const JA_FONT_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580";

/**
 * DOM要素の参照を取得する。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
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
 * @param {*} p p5インスタンス
 */
export function elInit(p) {
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
    .addEventListener("click", onScreenshotClick);
  initModal({
    openSelectors: ".data-register-modal-open",
    modalSelector: "#dataRegisterModal",
    closeSelectors: ".modal-close",
  });
  initCollapse({
    toggleSelectors: ".collapse-toggle",
    targetSelector: "#collapse",
  });
  initTabs({ tabSelector: "#dataRegisterModal .nav-link" });
}

/**
 * カメラ位置などシミュレーションの初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  p.camera(800, -500, 800, 0, 0, 0, 0, 1, 0);
  state.allSetIs = false;
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
      p.textSize(25);
      p.textAlign(p.CENTER);
    },
    () => {
      console.warn(
        "Japanese font could not be loaded. Text labels will not be displayed."
      );
    }
  );
}
