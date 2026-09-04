// class.js はセロハンの組ごとの入力DOM要素を管理するCellophaneクラス管理専用のファイルです。

/**
 * 1組分のセロハンの枚数・回転角・光路差の入力欄を生成するクラス。
 */
export class Cellophane {
  /**
   * @param {number} n セロハンの組番号
   * @param {*} p p5インスタンス
   */
  constructor(n, p) {
    this.number = n;
    const parentDiv = p
      .createDiv()
      .parent("#cellophaneColabNum")
      .id("cellophane-" + this.number)
      .class("mb-1 pb-1");
    const inputGroup = p.createDiv().parent(parentDiv).class("flex");
    p.createSpan(this.number + "組目の枚数")
      .parent(inputGroup)
      .class(
        "inline-flex items-center whitespace-nowrap rounded-l border border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    p.createInput(1, "number")
      .parent(inputGroup)
      .class(
        "min-w-0 flex-1 border border-l-0 border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .attribute("min", 1)
      .id("numInput-" + this.number);
    p.createSpan(this.number + "組目の回転角")
      .parent(inputGroup)
      .class(
        "inline-flex items-center whitespace-nowrap border border-l-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    p.createInput(1, "number")
      .parent(inputGroup)
      .class(
        "min-w-0 flex-1 border border-l-0 border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .id("rotateInput-" + this.number);
    p.createSpan(this.number + "組目の光路差")
      .parent(inputGroup)
      .class(
        "inline-flex items-center whitespace-nowrap border border-l-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    p.createInput(270, "number")
      .parent(inputGroup)
      .class(
        "min-w-0 flex-1 rounded-r border border-l-0 border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .id("opdInput-" + this.number);
  }
}
