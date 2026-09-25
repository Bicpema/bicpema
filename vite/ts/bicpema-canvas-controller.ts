/**
 * pixelDensityの上限値。
 * 高DPI環境（displayDensityが3以上の端末等）でそのまま追従すると、
 * キャンバスの実ピクセル数が過大になり描画負荷が急増するため上限を設ける。
 * 詳細は docs/docs/simulation/index.md の「パフォーマンス方針」を参照。
 */
const MAX_PIXEL_DENSITY = 2;

/**
 * BicpemaCanvasControllerのコンストラクタオプション。
 */
interface BicpemaCanvasControllerOptions {
  /** 回転時に比率（16:9）を固定化するか。falseの場合は利用可能領域いっぱいに広がる */
  fixedAspectRatio?: boolean;
  /** WEBGLモードの3Dキャンバスとして生成するか */
  is3D?: boolean;
  /** 算出した幅に対する比率（0.0~1.0） */
  widthRatio?: number;
  /** 算出した高さに対する比率（0.0~1.0） */
  heightRatio?: number;
  /** 指定した場合、そのDOM要素のサイズをウィンドウサイズの代わりに利用可能領域として使用する */
  panelSelector?: string | null;
  /** 指定した場合、そのDOM要素の高さ（+4px）を利用可能な高さから差し引く */
  bottomBarSelector?: string | null;
  /** "half"の場合、アスペクト比の計算を行わず、利用可能な高さの半分をそのままキャンバスの高さにする */
  heightMode?: "aspect" | "half";
}

/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 * 各シミュレーションから共通のユーティリティとしてimportして利用する。
 */
export class BicpemaCanvasController {
  fixed: boolean;
  is3D: boolean;
  widthRatio: number;
  heightRatio: number;
  panelSelector: string | null;
  bottomBarSelector: string | null;
  heightMode: "aspect" | "half";

  constructor({
    fixedAspectRatio = true,
    is3D = false,
    widthRatio = 1.0,
    heightRatio = 1.0,
    panelSelector = null,
    bottomBarSelector = null,
    heightMode = "aspect"
  }: BicpemaCanvasControllerOptions = {}) {
    this.fixed = fixedAspectRatio;
    this.is3D = is3D;
    this.widthRatio = widthRatio;
    this.heightRatio = heightRatio;
    this.panelSelector = panelSelector;
    this.bottomBarSelector = bottomBarSelector;
    this.heightMode = heightMode;
  }

  /**
   * キャンバスに割り当て可能な幅・高さを求める。
   * panelSelectorが指定されている場合はそのDOM要素のサイズを、
   * それ以外はウィンドウサイズから#navBar（およびbottomBarSelector）の高さを差し引いたサイズを返す。
   * @param p p5インスタンス。
   */
  _getAvailableSize(p: any): { w: number; h: number } {
    if (this.panelSelector) {
      const panel = document.querySelector(this.panelSelector);
      if (panel) {
        return { w: panel.clientWidth, h: panel.clientHeight };
      }
    }

    const NAV_BAR = p.select("#navBar");
    let h = p.windowHeight - NAV_BAR.height;
    if (this.bottomBarSelector) {
      const bottomEl = document.querySelector(
        this.bottomBarSelector
      ) as HTMLElement | null;
      h -= (bottomEl ? bottomEl.offsetHeight : 0) + 4;
    }
    return { w: p.windowWidth, h };
  }

  /**
   * 利用可能領域を元に、fixed・heightModeの設定に応じたキャンバスサイズ（widthRatio・heightRatio適用前）を求める。
   * @param p p5インスタンス。
   */
  _getSize(p: any): { w: number; h: number } {
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
   * @param p p5インスタンス。
   */
  fullScreen(p: any): void {
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
   * @param p p5インスタンス。
   */
  resizeScreen(p: any): void {
    const { w, h } = this._getSize(p);
    p.resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}
