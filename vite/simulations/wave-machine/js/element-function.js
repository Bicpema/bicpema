// elementFunction.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * 減速ボタンがクリックされたときの処理。
 */
export function onDecelerationButtonClick() {
  state.speed -= 1;
}

/**
 * 加速ボタンがクリックされたときの処理。
 */
export function onAccelerationButtonClick() {
  state.speed += 1;
}
