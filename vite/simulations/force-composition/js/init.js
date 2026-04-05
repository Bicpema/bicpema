import { state } from "./state.js";
import { FPS } from "./constants.js";

/**
 * DOM要素の初期化（現在は設定なし）。
 * @param {p5} p p5インスタンス
 */
export function elCreate(_p) {}

/**
 * キャンバス設定とシミュレーションの初期値を設定する。
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
