/**
 * 車オブジェクト
 */
class CAR {
  /**
   * @constructor
   * @param {number} x x方向の座標
   * @param {number} y y方向の座標
   * @param {img} i 車の画像
   * @param {number} v x方向の速度
   * @param {numberarr} xa 各時刻におけるx方向の座標xの配列
   * @param {numberarr} va 各時刻におけるx方向の速度vの配列
   */
  constructor(x, y, i, v, xa, va) {
    this.posx = x;
    this.posy = y;
    this.img = i;
    this.speed = v;
    this.xarr = xa;
    this.varr = va;
  }

  /**
   * 座標をアップデートする。
   */
  update = () => {
    this.posx += (50 * this.speed) / 60;
  };

  /**
   * 軌跡の描画を行う。
   */
  drawTrajectory = () => {
    tint(255, 150);
    stroke(255, 0, 0);
    strokeWeight(3);
    for (let i = 0; i < this.xarr.length; i++) {
      if ((this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 < this.posx) {
        image(
          this.img,
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 - this.img.width / 2,
          this.posy,
        );
        line(
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height - 10,
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height + 10,
        );
      }
    }
  };

  /**
   * 車の描画を行う。
   */
  drawCar = () => {
    tint(255);
    image(this.img, this.posx - this.img.width / 2, this.posy);
  };
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
