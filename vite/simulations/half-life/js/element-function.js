// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state, initAtoms } from "./state.js";

/**
 * トグルボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onToggleButtonClick(p) {
  state.isRunning = !state.isRunning;
  if (state.isRunning) {
    state.toggleButton.html("ストップ");
    state.toggleButton.removeClass("btn-primary");
    state.toggleButton.addClass("btn-danger");
  } else {
    state.toggleButton.html("スタート");
    state.toggleButton.removeClass("btn-danger");
    state.toggleButton.addClass("btn-primary");
  }
}

/**
 * 原子数増加ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onPlusBtnClick(p) {
  state.n = p.constrain(state.n + 1, 4, 30);
  state.N0 = state.n * state.n;
  state.currentTime = 0;
  state.nDisplay.html(state.n);
  initAtoms(p);
}

/**
 * 原子数減少ボタンがクリックされたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onMinusBtnClick(p) {
  state.n = p.constrain(state.n - 1, 4, 30);
  state.N0 = state.n * state.n;
  state.currentTime = 0;
  state.nDisplay.html(state.n);
  initAtoms(p);
}

/**
 * 物質選択ラジオボタンが変更されたときの処理。
 * @param {*} p - p5 インスタンス。
 */
export function onSubstanceChange(p) {
  const selected = document.querySelector('input[name="substance"]:checked');
  if (selected) {
    state.halfLife = Number(selected.value);
    state.maxYears = state.halfLife * 5;
    state.T = state.halfLife / 150;
    state.currentTime = 0;
    initAtoms(p);
  }
}
