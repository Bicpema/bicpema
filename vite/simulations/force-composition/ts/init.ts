import { FPS, LABEL_FONT_SIZE } from "./constants.js";

/**
 * DOM要素の初期化（現在は設定なし）。
 * @param _p - p5インスタンス
 */
export function elCreate(_p: p5) {}

/**
 * キャンバス設定とシミュレーションの初期値を設定する。
 * @param p - p5インスタンス
 */
export function initValue(p: p5) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(LABEL_FONT_SIZE);
}
