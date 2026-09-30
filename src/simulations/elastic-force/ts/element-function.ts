// element-function.ts はイベントハンドラー専用のファイルです。

import { state } from "./state.js";

/**
 * ばね定数スライダーの値が変更されたときの処理
 */
export function onSpringConstantChange() {
  const k = parseInt(String(state.springConstantInput!.value()), 10);
  state.springConstantDisplay!.html(`${k} N/m`);
  for (const spring of state.springs) {
    spring.updateK(k);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
export function onReset() {
  for (const spring of state.springs) {
    spring.reset();
  }
}
