// class.js は新しく生成するtable要素内のtr（1層分の入力行）を管理するクラス専用のファイルです。

import { state, STRATA_KINDS } from "./state.js";

/**
 * 地層データ編集テーブルの1行（tr要素）を表すクラス。
 */
export class TR {
  /**
   * @param {number} n 新しく生成するtr要素の番号
   * @param {*} p p5インスタンス
   */
  constructor(n, p) {
    const num = n;
    this.num = num;

    // tr要素に関連するinput要素などの生成
    this.tr = p
      .createElement("tr")
      .id("tr" + num)
      .parent("tablebody");
    this.th = p
      .createElement("th")
      .id("th" + num)
      .html(state.trNum + "層目")
      .class("border border-neutral-300 px-2 py-1")
      .parent("tr" + num);
    this.td1 = p
      .createElement("td")
      .id("td1" + num)
      .class("border border-neutral-300 px-2 py-1")
      .parent("tr" + num);
    this.td1Input = p
      .createInput(0, "number")
      .id("td1Input" + num)
      .parent("td1" + num)
      .class(
        "w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      );
    this.td2 = p
      .createElement("td")
      .id("td2" + num)
      .class("border border-neutral-300 px-2 py-1")
      .parent("tr" + num);
    this.td2Input = p
      .createInput(0, "number")
      .id("td2Input" + num)
      .parent("td2" + num)
      .class(
        "w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      );
    this.td3 = p
      .createElement("td")
      .id("td3" + num)
      .class("border border-neutral-300 px-2 py-1")
      .parent("tr" + num);
    this.td3Select = p
      .createSelect()
      .id("td3Select" + num)
      .parent("td3" + num)
      .class(
        "block w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      );
    this.td4 = p
      .createElement("td")
      .id("td4" + num)
      .class("border border-neutral-300 px-2 py-1")
      .parent("tr" + num);

    // select要素（td3）にoption（選択肢）の追加
    for (let i = 0; i < STRATA_KINDS.length; i++) {
      this.td3Select.option(STRATA_KINDS[i]);
    }

    // 削除ボタンを押した時の処理
    const removeButtonFunction = () => {
      p.select("#tr" + num).remove();
      // Array.prototype.pop()は引数を無視して末尾要素しか削除できないため、
      // 削除対象の行番号(num)と一致する要素をfindIndex+spliceで特定して除去する。
      state.trArr.splice(
        state.trArr.findIndex((tr) => tr.num === num),
        1
      );
      state.trNum -= 1;
      state.idArr.splice(
        state.idArr.findIndex((idIndex) => idIndex == String(num)),
        1
      );
      for (let i = 0; i < state.idArr.length; i++) {
        p.select("#th" + state.idArr[i]).html(i + 1 + "層目");
      }
    };

    this.trRemoveButton = p
      .createButton("削除")
      .parent("td4" + num)
      .class(
        "w-full rounded border border-red-600 bg-white px-3 py-1.5 text-red-600 hover:bg-red-50"
      )
      .id("trRemoveButton" + num)
      .mousePressed(removeButtonFunction);

    state.idArr.push(String(num));
  }
}
