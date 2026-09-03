// class.js は地点データ入力用DOM要素をまとめるクラス管理専用のファイルです。

import { placeNameInputFunction } from "./element-function.js";

/**
 * 1地点分の名前・緯度・経度の入力欄と、地層データ編集リンクを生成するクラス。
 */
export class DOM {
  /**
   * @param {number} n 地点番号
   * @param {*} p p5インスタンス
   */
  constructor(n, p) {
    this.n = n;
    this.parentDiv = p
      .createDiv()
      .parent("placePointNameInput")
      .class("mb-2")
      .id("placeNameInput" + n);
    this.inputGroup1 = p.createDiv().parent(this.parentDiv).class("flex");
    this.inputGroup2 = p.createDiv().parent(this.parentDiv).class("flex");
    // input要素の上の部分
    p.createElement("span", "地点" + n + "：")
      .parent(this.inputGroup1)
      .class(
        "inline-flex items-center whitespace-nowrap rounded-l border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    this.placeNameInput = p
      .createInput()
      .parent(this.inputGroup1)
      .class(
        "w-full rounded-r border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .input(() => placeNameInputFunction(p));
    // input要素の下の部分
    p.createElement("span", "緯度")
      .parent(this.inputGroup2)
      .class(
        "inline-flex items-center whitespace-nowrap rounded-l border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    this.yInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class(
        "w-full rounded-r border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      );
    p.createElement("span", "経度")
      .parent(this.inputGroup2)
      .class(
        "inline-flex items-center whitespace-nowrap rounded-l border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    this.xInput = p
      .createInput(0, "number")
      .parent(this.inputGroup2)
      .class(
        "w-full rounded-r border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      );
    p.createDiv("地点" + n + "の名前、緯度、経度を入力してください。")
      .parent(this.parentDiv)
      .class("text-sm text-neutral-500");
    // サブウィンドウ生成用のDOM
    this.placeDataInput = p
      .createA("javascript:void(0)", "地点" + n + "のデータを編集")
      .class(
        "mb-2 inline-block rounded border border-blue-600 bg-white px-3 py-1.5 text-blue-600 hover:bg-blue-50"
      )
      .parent("placePointDataInput")
      .id("placeDataInput" + n);
  }
}
