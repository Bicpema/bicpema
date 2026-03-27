import { state } from "./state.js";
import { FPS } from "./constants.js";

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する。
 * @param {p5} p p5インスタンス
 */
export function elCreate(_p) {
  // 設定UIなし
}

/**
 * キャンバス設定と初期値を設定する。
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) {
    p.textFont(state.font);
  }
  p.textSize(16);
}
