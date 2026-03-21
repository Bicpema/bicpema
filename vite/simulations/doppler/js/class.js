// class.js は SOUND クラス管理専用のファイルです。

import { state } from "./state.js";
import { FPS, H } from "./init.js";

/**
 * 音波を表すクラス。
 */
export class SOUND {
  /**
   * @param {number} x 音波が生成された X 座標
   * @param {number} r 初期半径
   */
  constructor(x, r) {
    this.soundx = x;
    this.radi = r;
  }

  /**
   * 音波を描画する。
   * @param {*} p p5 インスタンス。
   */
  _draw(p) {
    if (state.clickedCount === true) {
      this.radi += 340 / FPS;
    }
    p.noFill();
    p.ellipse(this.soundx, H / 2, this.radi * 2, this.radi * 2);
  }
}
