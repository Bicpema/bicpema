// 子ウィンドウ（setWindow.html）から window.opener 経由で直接呼び出されるため、
// index.js が window オブジェクトへ公開している関数の型をここで補完する。
// ESモジュールのimport/exportでは別ドキュメント間を参照できないための対応であり、
// これらのプロパティは実行時にindex.jsのsketch内で必ず設定される。

export {};

declare global {
  interface Window {
    submit: (arr: [string, unknown[]]) => void;
    loadLayers: (placeName: string) => unknown[];
    placeRefreshFunction: () => void;
    firstPlaceSelectFunction: () => void;
    secondPlaceSelectFunction: () => void;
    thirdPlaceSelectFunction: () => void;
  }
}
