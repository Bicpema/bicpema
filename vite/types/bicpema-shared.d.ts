// templates/js/ は vite/simulations/<name>/js/ にコピーされて初めて実際のパス階層になるため、
// テンプレート自身の位置からは "../../../js/bicpema-*.js" を実ファイルとして解決できない。
// ここではその相対パスパターンに一致するワイルドカードアンビエント宣言を用意し、
// テンプレートの型チェックを通す（コピー後の実シミュレーションでは実ファイルの解決が優先される）。

declare module "*/js/bicpema-canvas-controller.js" {
  export class BicpemaCanvasController {
    constructor(
      fixed?: boolean,
      is3D?: boolean,
      widthRatio?: number,
      heightRatio?: number,
      options?: {
        panelSelector?: string | null;
        bottomBarSelector?: string | null;
        heightMode?: "aspect" | "half";
      }
    );
    fullScreen(p: p5): void;
    resizeScreen(p: p5): void;
  }
}

declare module "*/js/bicpema-loading-spinner.js" {
  export function hideLoadingSpinner(selector?: string): void;
}

declare module "*/js/bicpema-modal-controller.js" {
  export function initModal(options: {
    openSelectors: string;
    modalSelector: string;
    closeSelectors: string;
  }): void;
}
