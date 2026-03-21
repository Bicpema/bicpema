// element-function.jsはDOMイベント処理専用のファイルです。

import html2canvas from "html2canvas";
import { state } from "./state.js";

/**
 * セロハンのDOMクラス
 */
export class Cellophane {
  constructor(p, n) {
    this.number = n;
    let parentDiv = p
      .createDiv()
      .parent("#cellophaneColabNum")
      .id("cellophane-" + this.number)
      .class("mb-1 pb-1");
    let inputGroup = p.createDiv().parent(parentDiv).class("input-group");
    p.createSpan(this.number + "組目の枚数")
      .parent(inputGroup)
      .class("input-group-text");
    p.createInput(1, "number")
      .parent(inputGroup)
      .class("form-control")
      .attribute("min", 1)
      .id("numInput-" + this.number);
    p.createSpan(this.number + "組目の回転角")
      .parent(inputGroup)
      .class("input-group-text");
    p.createInput(1, "number")
      .parent(inputGroup)
      .class("form-control")
      .id("rotateInput-" + this.number);
    p.createSpan(this.number + "組目の光路差")
      .parent(inputGroup)
      .class("input-group-text");
    p.createInput(270, "number")
      .parent(inputGroup)
      .class("form-control")
      .id("opdInput-" + this.number);
  }
}

/**
 * 追加ボタンを押したときの処理
 * @param {*} p p5インスタンス
 */
export function cellophaneAddButtonFunction(p) {
  state.colabNum += 1;
  state.cellophaneArr.push(new Cellophane(p, state.colabNum));
}

/**
 * 削除ボタンを押したときの処理
 * @param {*} p p5インスタンス
 */
export function cellophaneRemoveButtonFunction(p) {
  if (state.colabNum > 0) {
    let targetDiv = p.select("#cellophane-" + state.colabNum);
    state.cellophaneArr.pop();
    targetDiv.remove();
    state.colabNum -= 1;
  }
}

/**
 * スクリーンショットボタンのイベントリスナーを設定する
 */
export function setupScreenshot() {
  document.getElementById("screenshotButton").addEventListener("click", () => {
    html2canvas(document.body).then((canvas) => {
      const name = "screenshot.png";
      const a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = name;
      a.click();
    });
  });
}

/**
 * optRadioの変更時の処理
 */
export function optChanged() {
  if (state.optRadio.value() == "セロハンテープ") {
    state.dArr = state.dTable.getColumn("d");
    state.dRowNum = state.dTable.getRowCount();
    state.preValue = state.optRadio.value();
  }
  if (state.optRadio.value() == "OPPフィルム") {
    state.dArr = state.dTableOPP.getColumn("d");
    state.dRowNum = state.dTableOPP.getRowCount();
    state.preValue = state.optRadio.value();
  }
}
