// class.js はセロハンのDOMクラス管理専用のファイルです。

/**
 * セロハンのDOMクラス
 */
export class Cellophane {
  /**
   * @param {*} p p5インスタンス
   * @param {number} n セロハンの組番号
   */
  constructor(p, n) {
    this.number = n;
    let parentDiv = p
      .createDiv()
      .parent("#cellophaneColabNum")
      .id("cellophane-" + this.number)
      .class("mb-1 pb-1");
    let inputGroup = p.createDiv().parent(parentDiv).class("flex");
    let numSpan = p
      .createSpan(this.number + "組目の枚数")
      .parent(inputGroup)
      .class(
        "inline-flex items-center whitespace-nowrap rounded-l border border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    let numInput = p
      .createInput(1, "number")
      .parent(inputGroup)
      .class(
        "min-w-0 flex-1 border border-l-0 border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .attribute("min", 1)
      .id("numInput-" + this.number);
    let rotateSpan = p
      .createSpan(this.number + "組目の回転角")
      .parent(inputGroup)
      .class(
        "inline-flex items-center whitespace-nowrap border border-l-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700"
      );
    let rotateInput = p
      .createInput(1, "number")
      .parent(inputGroup)
      .class(
        "min-w-0 flex-1 rounded-r border border-l-0 border-neutral-300 bg-white px-3 py-1.5 text-neutral-900"
      )
      .id("rotateInput-" + this.number);
    //let opdSpan = createSpan(this.number + "組目の光路差").parent(inputGroup).class("input-group-text")
    //let opdIInput = createInput(270, "number").parent(inputGroup).class("form-control").id("opdInput-" + this.number)
  }
}
