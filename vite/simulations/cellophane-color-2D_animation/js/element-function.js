// element-function.js は仮想DOMメソッド管理専用のファイルです。

import { domToPng } from "modern-screenshot";
import { state } from "./state.js";
import { Cellophane } from "./class.js";

/**
 * スクリーンショットボタンが押されたときの処理。
 */
export function onScreenshotClick() {
  domToPng(document.body).then((dataUrl) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "screenshot.png";
    a.click();
  });
}

/**
 * 追加ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneAddButtonFunction(p) {
  state.colabNum += 1;
  state.cellophaneArr.push(new Cellophane(p, state.colabNum));
}

/**
 * 削除ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneRemoveButtonFunction(p) {
  if (state.colabNum > 0) {
    let targetDiv = p.select("#cellophane-" + state.colabNum);
    state.cellophaneArr.pop(-1);
    targetDiv.remove();
    state.colabNum -= 1;
  }
}
