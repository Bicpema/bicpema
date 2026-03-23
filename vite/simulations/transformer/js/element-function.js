// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";

/**
 * 一次コイルの巻数を増やす。
 */
export function onCoil1PlusBtn() {
  state.count1 = Math.min(
    Math.max(state.count1 + 5, state.minCount),
    state.maxCount
  );
  if (state.count1Display)
    state.count1Display.textContent = state.count1 + 1;
}

/**
 * 一次コイルの巻数を減らす。
 */
export function onCoil1MinusBtn() {
  state.count1 = Math.min(
    Math.max(state.count1 - 5, state.minCount),
    state.maxCount
  );
  if (state.count1Display)
    state.count1Display.textContent = state.count1 + 1;
}

/**
 * 二次コイルの巻数を増やす。
 */
export function onCoil2PlusBtn() {
  state.count2 = Math.min(
    Math.max(state.count2 + 5, state.minCount),
    state.maxCount
  );
  if (state.count2Display)
    state.count2Display.textContent = state.count2 + 1;
}

/**
 * 二次コイルの巻数を減らす。
 */
export function onCoil2MinusBtn() {
  state.count2 = Math.min(
    Math.max(state.count2 - 5, state.minCount),
    state.maxCount
  );
  if (state.count2Display)
    state.count2Display.textContent = state.count2 + 1;
}
