import { state } from "./state.js";

const FPS = 60;

/** p5 基本設定（フレームレート・テキスト配置） */
export function settingInit(p) {
  p.frameRate(FPS);
  p.textAlign(p.LEFT, p.TOP);
}

/** DOM要素の取得とイベントハンドラ登録 */
export function elementSelectInit(_p) {
  // radio ボタンは logic.js 内で document.querySelector により直接参照するため
  // 追加のイベントバインドは不要
}

/** キャンバスサイズに依存するレイアウト変数の更新 */
export function elementPositionInit(_p) {
  // グラフ座標は drawGraph() 内の仮想座標系（1600×800）で計算するため
  // ここでの位置更新は不要
}

/** シミュレーション状態の初期化 */
export function valueInit(_p) {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
}
