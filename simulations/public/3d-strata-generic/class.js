// DOM要素のクラス
class DOM {
  constructor(n) {
    this.n = n;
    this.parentDiv = createDiv()
      .parent(placePointNameInput)
      .class("mb-2")
      .id("placeNameInput" + str(this.n));
    this.inputGroup1 = createDiv().parent(this.parentDiv).class("input-group");
    this.inputGroup2 = createDiv().parent(this.parentDiv).class("input-group");
    // input要素の上の部分
    createElement("span", "地点" + str(this.n) + "：")
      .parent(this.inputGroup1)
      .class("input-group-text");
    this.placeNameInput = createInput().parent(this.inputGroup1).class("form-control").input(placeNameInputFunction);
    // input要素の下の部分
    createElement("span", "y方向").parent(this.inputGroup2).class("input-group-text");
    this.yInput = createInput(0, "number").parent(this.inputGroup2).class("form-control");
    createElement("span", "x方向").parent(this.inputGroup2).class("input-group-text");
    this.xInput = createInput(0, "number").parent(this.inputGroup2).class("form-control");
    createDiv("地点" + str(this.n) + "の名前、y方向、x方向を入力してください。")
      .parent(this.parentDiv)
      .class("form-text");
    // サブウィンドウ生成用のDOM
    this.placeDataInput = createA("javascript:void(0)", "地点" + str(this.n) + "のデータを編集")
      .class("btn btn-outline-primary mb-2")
      .parent("placePointDataInput")
      .id("placeDataInput" + str(this.n));
  }
}
