// init.jsは初期処理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { trAddButtonFunction } from "./element-function.js";

/**
 * DOM要素の参照を取得する。
 * @param {*} p p5インスタンス
 */
export function elCreate(p: p5) {
  state.trAddButton = p.select("#trAddButton");
}

/**
 * DOM要素にイベントを設定する。
 * @param {*} p p5インスタンス
 */
export function elInit(p: p5) {
  state.trAddButton.mousePressed(() => trAddButtonFunction(p));
}
