// element-function.jsは仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { Cellophane } from "./class.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadScreenshot = createLazyImporter(() => import("modern-screenshot"));

/**
 * スクリーンショットボタンが押されたときの処理。
 * modern-screenshotはボタン押下時に初めて動的importする。
 */
export function onScreenshotClick() {
  const button = document.getElementById("screenshotButton");
  if (button) button.disabled = true;
  loadScreenshot()
    .then(({ domToPng }) => domToPng(document.body))
    .then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "screenshot.png";
      a.click();
    })
    .finally(() => {
      if (button) button.disabled = false;
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
    state.cellophaneArr.pop();
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
