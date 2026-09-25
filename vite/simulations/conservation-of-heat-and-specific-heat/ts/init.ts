import type p5 from "p5";
import { state } from "./state.js";

// 温度変化はゆっくりであり、高フレームレートは不要なため低frameRateを採用する。
// 詳細は docs/docs/simulation/index.md の「パフォーマンス方針」を参照。
const FPS = 20;

/** p5 基本設定（フレームレート・テキスト配置） */
export function settingInit(p: p5) {
  p.frameRate(FPS);
  p.textAlign(p.LEFT, p.TOP);
}

/** DOM要素の取得とイベントハンドラ登録 */
export function elementSelectInit(_p: p5) {
  // radio ボタンは logic.js 内で document.querySelector により直接参照するため
  // 追加のイベントバインドは不要
}

/** キャンバスサイズに依存するレイアウト変数の更新 */
export function elementPositionInit(_p: p5) {
  // グラフ座標は drawGraph() 内の仮想座標系（1600×800）で計算するため
  // ここでの位置更新は不要
}

/** シミュレーション状態の初期化 */
export function valueInit(_p: p5) {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
}
