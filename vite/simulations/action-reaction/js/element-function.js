// element-function.js は UI イベントハンドラーを管理するファイルです。

import { state, MAX_BOOKS, INIT_NUM_BOOKS, INIT_BOOK_MASS } from "./state.js";

// ────────────────────────────────────────────
// UI イベントハンドラー
// ────────────────────────────────────────────

/**
 * 本を1冊追加する。
 */
export function onAddBook() {
  if (state.numBooks < MAX_BOOKS) {
    state.numBooks++;
  }
}

/**
 * 本を1冊削除する。
 */
export function onRemoveBook() {
  if (state.numBooks > 0) {
    state.numBooks--;
  }
}

/**
 * 本の質量スライダーが変更されたときの処理。
 */
export function onBookMassChange() {
  const val = parseFloat(state.bookMassInput.value());
  state.bookMass = val;
  state.bookMassDisplay.html(val.toFixed(1));
}

/**
 * リセットボタンが押されたときの処理。
 */
export function onReset() {
  state.numBooks = INIT_NUM_BOOKS;
  state.bookMass = INIT_BOOK_MASS;
  if (state.bookMassInput) {
    state.bookMassInput.value(INIT_BOOK_MASS);
    state.bookMassDisplay.html(INIT_BOOK_MASS.toFixed(1));
  }
  if (state.settingsModal) {
    state.settingsModal.style("display", "none");
  }
}

/**
 * 設定モーダルを開閉する。
 */
export function onToggleModal() {
  const display = state.settingsModal.style("display");
  state.settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定モーダルを閉じる。
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
