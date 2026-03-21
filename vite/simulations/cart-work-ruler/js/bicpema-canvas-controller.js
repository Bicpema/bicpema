/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
export class BicpemaCanvasController {
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
   * @param {*} p p5インスタンス。
   */
  fullScreen(p) {
    const P5_CANVAS = p.select("#p5Canvas");
    const NAV_BAR = p.select("#navBar");
    let canvas, w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = p.windowWidth;
      h = w * RATIO;
      if (h > p.windowHeight - NAV_BAR.height) {
        h = p.windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = p.windowWidth;
      h = p.windowHeight - NAV_BAR.height;
    }
    if (this.is3D) {
      canvas = p.createCanvas(
        w * this.widthRatio,
        h * this.heightRatio,
        p.WEBGL
      );
    } else {
      canvas = p.createCanvas(w * this.widthRatio, h * this.heightRatio);
    }
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
   * @param {*} p p5インスタンス。
   */
  resizeScreen(p) {
    const NAV_BAR = p.select("#navBar");
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = p.windowWidth;
      h = w * RATIO;
      if (h > p.windowHeight - NAV_BAR.height) {
        h = p.windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = p.windowWidth;
      h = p.windowHeight - NAV_BAR.height;
    }
    p.resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}
