// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import {
  onAddBook,
  onRemoveBook,
  onBookMassChange,
  onReset,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

const FPS = 30;

/**
 * DOM 要素の取得とイベントリスナーの登録、基本設定を行う。
 * @param {*} p p5 インスタンス
 */
export function elCreate(p) {
  state.settingsModal = p.select("#settingsModal");
  state.bookMassInput = p.select("#bookMassInput");
  state.bookMassDisplay = p.select("#bookMassDisplay");

  state.bookMassInput.input(() => onBookMassChange());
  p.select("#addBookBtn").mousePressed(() => onAddBook());
  p.select("#removeBookBtn").mousePressed(() => onRemoveBook());
  p.select("#resetButton").mousePressed(() => onReset());
  p.select("#toggleModal").mousePressed(() => onToggleModal());
  p.select("#closeModal").mousePressed(() => onCloseModal());

  p.frameRate(FPS);
}

/**
 * シミュレーションの初期値を設定する。
 * @param {*} p p5 インスタンス
 */
export function initValue(p) {
  p.textFont("sans-serif");
}
