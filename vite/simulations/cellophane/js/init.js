// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { createRays } from "./class.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { FPS } from "./constants.js";
import {
  waveRepresentationFunction,
  cellophaneCountSliderFunction,
  rButtonFunction,
  gButtonFunction,
  bButtonFunction,
  onPlayPause,
} from "./element-function.js";

/**
 * DOM要素の参照を取得し、イベントを設定する。
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.waveRepresentationButton = p.select("#waveRepresentationButton");
  state.cellophaneCountSlider = p.select("#cellophaneCountSlider");
  state.cellophaneCountValue = p.select("#cellophaneCountValue");
  state.rButton = p.select("#rButton");
  state.gButton = p.select("#gButton");
  state.bButton = p.select("#bButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.incidentColor = p.select("#incidentColor");
  state.transmittedColor = p.select("#transmittedColor");

  state.waveRepresentationButton.mousePressed(() =>
    waveRepresentationFunction()
  );
  state.cellophaneCountSlider.input(() => cellophaneCountSliderFunction());
  state.rButton.mousePressed(() => rButtonFunction());
  state.gButton.mousePressed(() => gButtonFunction());
  state.bButton.mousePressed(() => bButtonFunction());
  state.playPauseButton.mousePressed(() => onPlayPause());
}

/**
 * 設定モーダルの開閉を初期化する。
 */
export function uiInit() {
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#settingsModal",
    closeSelectors: ".modal-close",
  });
}

/**
 * カメラ位置・フレームレート・光線の初期値を設定する。
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  createRays();
  p.camera(300, 0, 0, 0, 0, 0, 0, 1, 0);
  p.frameRate(FPS);
}
