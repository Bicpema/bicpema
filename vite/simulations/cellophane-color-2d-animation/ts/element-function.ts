// element-function.js は仮想DOMメソッド管理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { Cellophane } from "./class.js";
import { createLazyImporter } from "../../../ts/bicpema-lazy-import.js";

const loadScreenshot = createLazyImporter(() => import("modern-screenshot"));

/**
 * スクリーンショットボタンが押されたときの処理。
 * modern-screenshotはボタン押下時に初めて動的importする。
 */
export function onScreenshotClick() {
  const button = document.getElementById(
    "screenshotButton"
  ) as HTMLButtonElement | null;
  if (button) button.disabled = true;
  loadScreenshot()
    .then(({ domToPng }) => domToPng(document.body))
    .then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "screenshot.png";
      a.click();
    })
    .catch((error) => {
      // 失敗をユーザーへ通知するUIがないため、原因調査用にログのみ出力する。
      // oxlint-disable-next-line no-console -- 上記コメントの理由により意図的な出力
      console.error("スクリーンショットの取得に失敗しました。", error);
    })
    .finally(() => {
      if (button) button.disabled = false;
    });
}

/**
 * 追加ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneAddButtonFunction(p: p5) {
  state.colabNum! += 1;
  state.cellophaneArr.push(new Cellophane(p, state.colabNum!));
}

/**
 * 削除ボタンを押したときの処理。
 * @param {*} p p5インスタンス
 */
export function cellophaneRemoveButtonFunction(p: p5) {
  if (state.colabNum! > 0) {
    const targetDiv = p.select("#cellophane-" + state.colabNum)!;
    state.cellophaneArr.pop();
    targetDiv.remove();
    state.colabNum! -= 1;
  }
}
