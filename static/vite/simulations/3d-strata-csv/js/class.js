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
    this.placeNameInput = createInput()
      .parent(this.inputGroup1)
      .class("form-control")
      .input(placeNameInputFunction);
    // input要素の下の部分
    createElement("span", "y方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.yInput = createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    createElement("span", "x方向")
      .parent(this.inputGroup2)
      .class("input-group-text");
    this.xInput = createInput(0, "number")
      .parent(this.inputGroup2)
      .class("form-control");
    createDiv("地点" + str(this.n) + "の名前、y方向、x方向を入力してください。")
      .parent(this.parentDiv)
      .class("form-text");
    // サブウィンドウ生成用のDOM
    this.placeDataInput = createA(
      "javascript:void(0)",
      "地点" + str(this.n) + "のデータを編集"
    )
      .class("btn btn-outline-primary mb-2")
      .parent("placePointDataInput")
      .id("placeDataInput" + str(this.n));
  }
}

/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
class BicpemaCanvasController {
  /**
   * @constructor
   * @param {boolean} f 回転時に比率を固定化するか
   * @param {boolean} i 3Dかどうか
   * @param {number} w_r 幅の比率（0.0~1.0）
   * @param {number} h_r 高さの比率（0.0~1.0）
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }
  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
   */
  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    let canvas, w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    if (this.is3D) {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL);
    } else {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio);
    }
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
   */
  resizeScreen() {
    const NAV_BAR = select("#navBar");
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}

/**
 * 3D座標系を描画するクラス
 */
class CoordinateSystem {
  /**
   * @constructor
   * @param {number} x x方向の長さ
   * @param {number} y y方向の長さ
   * @param {number} z z方向の長さ
   */
  constructor(x = 500, y = 500, z = 500) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * x,y,z軸を描画する。
   */
  line() {
    stroke(255, 0, 0);
    line(this.x, 0, 0, 0, 0, 0);
    stroke(0, 255, 0);
    line(0, this.y, 0, 0, 0, 0);
    stroke(0, 0, 255);
    line(0, 0, this.z, 0, 0, 0);
  }

  /**
   * x,y,z方向のスケールを描画するメソッド
   */
  scale() {
    stroke(100, 100);
    for (let x = 50; x <= this.x; x += 50) {
      line(x, 0, 0, x, this.y, 0);
      line(x, 0, 0, x, 0, this.z);
    }
    for (let y = 50; y <= this.y; y += 50) {
      line(0, y, 0, this.x, y, 0);
      line(0, y, 0, 0, y, this.z);
    }
    for (let z = 50; z <= this.z; z += 50) {
      line(0, 0, z, this.x, 0, z);
      line(0, 0, z, 0, this.y, z);
    }
  }

  /**
   * x,y,z方向の軸ラベルを描画するメソッド
   * @param {string} xLabel x方向のラベル
   * @param {string} yLabel y方向のラベル
   * @param {string} zLabel z方向のラベル
   * @param {number} size フォントサイズ
   */
  axisLabel(xLabel, yLabel, zLabel, size) {
    fill(0);
    textSize(size);

    push();
    translate(0, -size, 0);
    text(xLabel, this.x / 2, 0);
    pop();

    push();
    translate(-size, 0, 0);
    text(yLabel, 0, this.y / 2);
    pop();

    push();
    rotateY(PI / 2);
    translate(0, -size, 0);
    text(zLabel, -this.z / 2, 0);
    pop();
  }
}
