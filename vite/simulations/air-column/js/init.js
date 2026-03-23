// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { updateWaveLayer } from "./logic.js";
import {
  onPlusBtnClick,
  onMinusBtnClick,
  onL_PlusBtnClick,
  onL_MinusBtnClick,
} from "./element-function.js";

/**
 * 状態の初期化とオフスクリーンレイヤーの生成を行う。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  if (state.waveLayer) {
    state.waveLayer.remove();
  }
  state.waveLayer = p.createGraphics(p.width, p.height);
  state.pipeY = p.height / 3;
  state.time = 0;
  updateWaveLayer(p);
}

/**
 * DOM 要素を取得してイベントハンドラを設定する。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  state.typeSelect = p.select("#typeSelect");
  state.plusBtn = p.select("#plusBtn");
  state.minusBtn = p.select("#minusBtn");
  state.L_plusBtn = p.select("#L_plusBtn");
  state.L_minusBtn = p.select("#L_minusBtn");
  state.mnDisplay = p.select("#mnDisplay");
  state.pipeLDisplay = p.select("#pipeLDisplay");

  state.typeSelect.changed(() => {
    state.type = state.typeSelect.value();
    if (state.type === "closed" && state.m_n % 2 === 0) {
      state.m_n = p.constrain(state.m_n - 1, 1, 9);
      state.mnDisplay.html(state.m_n);
    }
    updateWaveLayer(p);
  });

  state.plusBtn.mousePressed(() => onPlusBtnClick(p));
  state.minusBtn.mousePressed(() => onMinusBtnClick(p));
  state.L_plusBtn.mousePressed(() => onL_PlusBtnClick(p));
  state.L_minusBtn.mousePressed(() => onL_MinusBtnClick(p));
}
