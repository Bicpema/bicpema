/**
 * pixelDensityの上限値。
 * 高DPI環境（displayDensityが3以上の端末等）でそのまま追従すると、
 * キャンバスの実ピクセル数が過大になり描画負荷が急増するため上限を設ける。
 * 詳細は docs/docs/simulation/index.md の「パフォーマンス方針」を参照。
 */
const MAX_PIXEL_DENSITY = 2;

/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 * 各シミュレーションから共通のユーティリティとしてimportして利用する。
 */
export class BicpemaCanvasController {
  /**
   * @constructor
   * @param {boolean} f 回転時に比率を固定化するか
   * @param {boolean} i 3Dかどうか
   * @param {number} w_r 幅の比率（0.0~1.0）
   * @param {number} h_r 高さの比率（0.0~1.0）
   * @param {object} [options] 個別シミュレーションのレイアウト差分を吸収するための追加オプション
   * @param {string|null} [options.panelSelector] 指定した場合、そのDOM要素のサイズをウィンドウサイズの代わりに利用可能領域として使用する
   * @param {string|null} [options.bottomBarSelector] 指定した場合、そのDOM要素の高さ（+4px）を利用可能な高さから差し引く
   * @param {"aspect"|"half"} [options.heightMode] "half"の場合、アスペクト比の計算を行わず、利用可能な高さの半分をそのままキャンバスの高さにする
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0, options = {}) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
    this.panelSelector = options.panelSelector ?? null;
    this.bottomBarSelector = options.bottomBarSelector ?? null;
    this.heightMode = options.heightMode ?? "aspect";
  }

  /**
   * キャンバスに割り当て可能な幅・高さを求める。
   * panelSelectorが指定されている場合はそのDOM要素のサイズを、
   * それ以外はウィンドウサイズから#navBar（およびbottomBarSelector）の高さを差し引いたサイズを返す。
   * @param {*} p p5インスタンス。
   */
  _getAvailableSize(p) {
    if (this.panelSelector) {
      const panel = document.querySelector(this.panelSelector);
      if (panel) {
        return { w: panel.clientWidth, h: panel.clientHeight };
      }
    }

    const NAV_BAR = p.select("#navBar");
    let h = p.windowHeight - NAV_BAR.height;
    if (this.bottomBarSelector) {
      const bottomEl = /** @type {HTMLElement | null} */ (
        document.querySelector(this.bottomBarSelector)
      );
      h -= (bottomEl ? bottomEl.offsetHeight : 0) + 4;
    }
    return { w: p.windowWidth, h };
  }

  /**
   * 利用可能領域を元に、fixed・heightModeの設定に応じたキャンバスサイズ（widthRatio・heightRatio適用前）を求める。
   * @param {*} p p5インスタンス。
   */
  _getSize(p) {
    const { w: availW, h: availH } = this._getAvailableSize(p);

    if (this.heightMode === "half") {
      return { w: availW, h: availH / 2 };
    }

    if (!this.fixed) {
      return { w: availW, h: availH };
    }

    const RATIO = 9 / 16;
    let w = availW;
    let h = w * RATIO;
    if (h > availH) {
      h = availH;
      w = h / RATIO;
    }
    return { w, h };
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
   * @param {*} p p5インスタンス。
   */
  fullScreen(p) {
    p.pixelDensity(Math.min(p.displayDensity(), MAX_PIXEL_DENSITY));
    const P5_CANVAS = p.select("#p5Canvas");
    const { w, h } = this._getSize(p);
    const canvas = this.is3D
      ? p.createCanvas(w * this.widthRatio, h * this.heightRatio, p.WEBGL)
      : p.createCanvas(w * this.widthRatio, h * this.heightRatio);
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
   * @param {*} p p5インスタンス。
   */
  resizeScreen(p) {
    const { w, h } = this._getSize(p);
    p.resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}
