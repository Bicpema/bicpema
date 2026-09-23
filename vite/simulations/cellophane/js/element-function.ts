// element-function.jsはボタン・スライダー操作時のイベントハンドラーをまとめたファイルです。

import { state } from "./state.js";
import { createRays } from "./class.js";
import { updateGraph } from "./graph.js";
import {
  BTN_PRIMARY,
  BTN_DANGER,
  BTN_SECONDARY,
  BTN_SUCCESS,
  swapButtonClass,
  INCIDENT_LIGHT_CSS_COLOR
} from "./constants.js";

/**
 * 入射光・出射光の色見本の背景色を、現在のセロハンの枚数に合わせて更新する。
 */
export function updateColorSwatches() {
  state.incidentColor.style("background", INCIDENT_LIGHT_CSS_COLOR);
  const rgbForCount = state.rgb[state.cellophaneCountSlider.value() - 1];
  state.transmittedColor.style(
    "background",
    `rgb(${rgbForCount[0]},${rgbForCount[1]},${rgbForCount[2]})`
  );
}

/**
 * csvファイル内のデータを配列に格納する。
 */
export function csvDataLoad() {
  const rowCount = state.spectrumSheet.getRowCount();
  for (let i = 0; i < 10; i++) {
    state.intensity[i] = [];
    state.rgb[i] = [];
    for (let j = 1; j < rowCount; j++) {
      state.intensity[i][j] = state.spectrumSheet.getNum(j, i) / 1000;
    }
    for (let j = 0; j < 3; j++) {
      state.rgb[i][j] = state.rgbSheet.getNum(i + 1, j + 1);
    }
  }
  for (let i = 1; i < rowCount; i++) {
    state.waveLength[i] = state.cmfSheet.getNum(i, 0);
    state.cmfr[i] = state.cmfSheet.getNum(i, 1);
    state.cmfg[i] = state.cmfSheet.getNum(i, 2);
    state.cmfb[i] = state.cmfSheet.getNum(i, 3);
    state.lightSourceIntensity[i] =
      state.lightSourceSpectrumSheet.getNum(i, 1) / 1000;
  }
}

/**
 * 光の波の表現方法（球/直線）を切り替える。
 * 波動表現の切り替えボタンが押されたときに呼び出される。
 */
export function waveRepresentationFunction() {
  if (state.waveRepresentation === "line") {
    state.waveRepresentation = "sphere";
    swapButtonClass(state.waveRepresentationButton, BTN_DANGER, BTN_PRIMARY);
  } else {
    state.waveRepresentation = "line";
    swapButtonClass(state.waveRepresentationButton, BTN_PRIMARY, BTN_DANGER);
  }
}

/**
 * セロハンの枚数変更に合わせて光線・色見本・グラフを更新する。
 * スライダーが動いた時に呼び出される。
 */
export function cellophaneCountSliderFunction() {
  createRays();
  state.cellophaneCountValue.html(state.cellophaneCountSlider.value());
  updateColorSwatches();
  updateGraph();
}

/**
 * アニメーションの再生/一時停止を切り替える。
 * 再生/一時停止ボタンが押されたときに呼び出される。
 */
export function onPlayPause() {
  if (state.isRunning) {
    state.isRunning = false;
    swapButtonClass(state.playPauseButton, BTN_DANGER, BTN_PRIMARY);
    state.playPauseButton.html("スタート");
  } else {
    state.isRunning = true;
    swapButtonClass(state.playPauseButton, BTN_PRIMARY, BTN_DANGER);
    state.playPauseButton.html("ストップ");
  }
}

/** 赤の光線を描画するかどうかを切り替える */
export function rButtonFunction() {
  state.rIs = !state.rIs;
  if (state.rIs) {
    swapButtonClass(state.rButton, BTN_SECONDARY, BTN_DANGER);
  } else {
    swapButtonClass(state.rButton, BTN_DANGER, BTN_SECONDARY);
  }
}

/** 緑の光線を描画するかどうかを切り替える */
export function gButtonFunction() {
  state.gIs = !state.gIs;
  if (state.gIs) {
    swapButtonClass(state.gButton, BTN_SECONDARY, BTN_SUCCESS);
  } else {
    swapButtonClass(state.gButton, BTN_SUCCESS, BTN_SECONDARY);
  }
}

/** 青の光線を描画するかどうかを切り替える */
export function bButtonFunction() {
  state.bIs = !state.bIs;
  if (state.bIs) {
    swapButtonClass(state.bButton, BTN_SECONDARY, BTN_PRIMARY);
  } else {
    swapButtonClass(state.bButton, BTN_PRIMARY, BTN_SECONDARY);
  }
}
