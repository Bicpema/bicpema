/**
 * 画面サイズの管理クラス。
 */
export class BicpemaCanvasController {
  /**
   * @param {boolean} f 画面サイズを固定するかどうかのフラグ。trueの場合16:9比率を維持する。
   * @param {boolean} i 3D描画を使用するかどうかのフラグ。trueの場合WEBGLモードでキャンバスを作成する。
   * @param {number} w_r キャンバスの幅の比率（0.0〜1.0）。
   * @param {number} h_r キャンバスの高さの比率（0.0〜1.0）。
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }

  /**
   * フルスクリーン表示を設定する関数。
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
   * 画面サイズをリサイズする関数。
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
