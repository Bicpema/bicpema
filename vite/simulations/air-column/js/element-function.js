// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";
import { updateWaveLayer } from "./logic.js";

/**
 * 倍振動数増加ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onPlusBtnClick(p) {
  if (state.type === "closed") {
    state.m_n = p.constrain(state.m_n + 2, 1, 9);
  } else {
    state.m_n = p.constrain(state.m_n + 1, 1, 9);
  }
  state.mnDisplay.html(state.m_n);
  updateWaveLayer(p);
}

/**
 * 倍振動数減少ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onMinusBtnClick(p) {
  if (state.type === "closed") {
    state.m_n = p.constrain(state.m_n - 2, 1, 9);
  } else {
    state.m_n = p.constrain(state.m_n - 1, 1, 9);
  }
  state.mnDisplay.html(state.m_n);
  updateWaveLayer(p);
}

/**
 * 管の長さ増加ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onL_PlusBtnClick(p) {
  state.pipeL = p.constrain(state.pipeL + 50, 200, 600);
  state.pipeLDisplay.html(state.pipeL);
  updateWaveLayer(p);
}

/**
 * 管の長さ減少ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onL_MinusBtnClick(p) {
  state.pipeL = p.constrain(state.pipeL - 50, 200, 600);
  state.pipeLDisplay.html(state.pipeL);
  updateWaveLayer(p);
}
