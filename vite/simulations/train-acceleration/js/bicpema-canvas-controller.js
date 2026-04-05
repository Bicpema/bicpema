/**
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 * 上半分のみ使用するため高さは利用可能領域の半分にする。
 */
export class BicpemaCanvasController {
  /**
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
   * #p5Canvas と #navBar を元に canvas を生成する。
   * @param {*} p p5インスタンス。
   */
  fullScreen(p) {
    const P5_CANVAS = p.select("#p5Canvas");
    const NAV_BAR = p.select("#navBar");
    const navH = NAV_BAR.height;
    const availH = p.windowHeight - navH;
    const w = p.windowWidth;
    const h = availH / 2;
    const canvas = this.is3D
      ? p.createCanvas(w, h, p.WEBGL)
      : p.createCanvas(w, h);
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * キャンバスをリサイズする。
   * @param {*} p p5インスタンス。
   */
  resizeScreen(p) {
    const NAV_BAR = p.select("#navBar");
    const navH = NAV_BAR.height;
    const availH = p.windowHeight - navH;
    p.resizeCanvas(p.windowWidth, availH / 2);
  }
}
