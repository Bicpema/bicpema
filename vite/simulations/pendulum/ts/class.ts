// class.tsはクラス管理専用のファイルです。

import p5 from "p5";
import { state } from "./state.js";
import { computePendulumAngle } from "./physics.js";

/**
 * 振り子のおもりを表すクラス。
 */
export class Ball {
  posx: number;
  posy: number;
  stringLength: number;
  theta0: number;
  theta: number;

  /**
   * @param stringLength - 振り子の長さ（表示ピクセル単位）
   * @param theta0 - 振れ幅（初期角度、度）
   */
  constructor(stringLength: number, theta0: number) {
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
   * @param p - p5インスタンス
   * @param n - 支点のオフセットx座標
   */
  calculate(p: p5, n: number) {
    const displayLength = this.stringLength * state.displayScale;
    this.posx = n + p.width / 6 + displayLength * p.sin(this.theta);
    this.posy = state.pivotY + displayLength * p.cos(this.theta);
    this.theta = computePendulumAngle(
      this.theta0,
      this.stringLength,
      state.gravity,
      state.count
    );
  }

  /**
   * 支点からの糸とおもりを描画する。
   * @param p - p5インスタンス
   * @param n - 支点のオフセットx座標
   */
  display(p: p5, n: number) {
    p.line(this.posx, this.posy, n + p.width / 6, state.pivotY);
    p.image(
      state.weightImage!,
      this.posx - state.radi,
      this.posy - state.radi,
      state.radi * 2,
      state.radi * 2
    );
  }
}
