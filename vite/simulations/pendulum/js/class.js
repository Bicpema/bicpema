// class.jsはクラス管理専用のファイルです。

import { state } from "./state.js";
import { computePendulumAngle } from "./physics.js";

/**
 * 振り子のおもりを表すクラス。
 */
export class Ball {
  /**
   * @param {number} stringLength 振り子の長さ（表示ピクセル単位）
   * @param {number} theta0 振れ幅（初期角度、度）
   */
  constructor(stringLength, theta0) {
    this.posx = 0;
    this.posy = 0;
    this.stringLength = stringLength;
    this.theta0 = theta0;
    this.theta = computePendulumAngle(
      this.theta0,
      this.stringLength,
      state.gravity,
      state.count
    );
  }

  /**
   * 現在のフレームカウントに応じて位置を更新する。
   * @param {*} p p5インスタンス
   * @param {number} n 支点のオフセットx座標
   */
  calculate(p, n) {
    this.posx = n + p.width / 6 + this.stringLength * p.sin(this.theta);
    this.posy = 100 + this.stringLength * p.cos(this.theta);
    this.theta = computePendulumAngle(
      this.theta0,
      this.stringLength,
      state.gravity,
      state.count
    );
  }

  /**
   * 支点からの糸とおもりを描画する。
   * @param {*} p p5インスタンス
   * @param {number} n 支点のオフセットx座標
   */
  display(p, n) {
    p.line(this.posx, this.posy, n + p.width / 6, 100);
    p.image(
      state.weightImage,
      this.posx - state.radi,
      this.posy - state.radi,
      state.radi * 2,
      state.radi * 2
    );
  }
}
