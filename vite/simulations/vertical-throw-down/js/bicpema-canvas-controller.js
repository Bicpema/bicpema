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
   * #simPanel が存在する場合はそのサイズ、なければウィンドウサイズを返す
   * @param {p5} p
   * @returns {{ panelW: number, panelH: number }}
   */
  _getPanelSize(p) {
    const simPanel = document.getElementById("simPanel");
    if (simPanel) {
      return { panelW: simPanel.clientWidth, panelH: simPanel.clientHeight };
    }
    const NAV_BAR = p.select("#navBar");
    return { panelW: p.windowWidth, panelH: p.windowHeight - NAV_BAR.height };
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
   * @param {p5} p p5インスタンス
   */
  fullScreen(p) {
    const P5_CANVAS = p.select("#p5Canvas");
    const { panelW, panelH } = this._getPanelSize(p);
    let w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = panelW;
      h = w * RATIO;
      if (h > panelH) {
        h = panelH;
        w = h / RATIO;
      }
    } else {
      w = panelW;
      h = panelH;
    }
    let canvas;
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
   * @param {p5} p p5インスタンス
   */
  resizeScreen(p) {
    const { panelW, panelH } = this._getPanelSize(p);
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = panelW;
      h = w * RATIO;
      if (h > panelH) {
        h = panelH;
        w = h / RATIO;
      }
    } else {
      w = panelW;
      h = panelH;
    }
    p.resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}
