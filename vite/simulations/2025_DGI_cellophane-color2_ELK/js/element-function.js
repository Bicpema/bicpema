// element-function.jsは仮想DOMメソッド管理専用のファイルです。

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
 * セロハン追加ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneAddButtonFunction(p) {
  state.colabNum += 1;
  state.cellophaneArr.push(new Cellophane(state.colabNum, p));
}

/**
 * セロハン削除ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneRemoveButtonFunction(p) {
  if (state.colabNum > 0) {
    const targetDiv = p.select("#cellophane-" + state.colabNum);
    state.cellophaneArr.pop(-1);
    targetDiv.remove();
    state.colabNum -= 1;
  }
}

/**
 * キー押下時の処理。上矢印キーで、分割計算(組数2以上の色計算・塗り分け)を
 * 最初からやり直すためのフラグをリセットする。
 * @param {*} p p5インスタンス
 */
export function onKeyPressed(p) {
  if (p.keyCode === p.UP_ARROW) {
    state.BisDead = false;
    state.CisDead = false;
    state.Bcount = 0;
    state.Bdraw = 0;
    state.DrawisDead = false;
    state.drawT = 0;
    state.drawCount = 0;
  }
}
