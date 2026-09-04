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

declare module "*/js/bicpema-controls-controller.js" {
  export function bindStartStopControls(
    p: p5,
    options: {
      startSelector: string;
      stopSelector: string;
      resetSelector: string;
      onStart: () => void;
      onStop: () => void;
      onReset: () => void;
      startAriaLabel?: string;
      stopAriaLabel?: string;
      resetAriaLabel?: string;
    }
  ): {
    startButton: p5.Element;
    stopButton: p5.Element;
    resetButton: p5.Element;
  };

  export function bindToggleControls(
    p: p5,
    options: {
      toggleSelector: string;
      resetSelector: string;
      onToggle: () => void;
      onReset: () => void;
      toggleAriaLabel?: string;
      resetAriaLabel?: string;
    }
  ): { toggleButton: p5.Element; resetButton: p5.Element };
}
