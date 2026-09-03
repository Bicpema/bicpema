// class.js は Ball クラス管理専用のファイルです。

import { state } from "./state.js";
import { computePendulumWaveAngle } from "./physics.js";

/**
 * 振り子の波を構成する1つのおもりを表すクラス。
 */
export class Ball {
  /**
   * @param {number} length 振り子の長さ（データ上の単位）
   * @param {number} theta0 振れ幅（初期角度、ラジアン）
   */
  constructor(length, theta0) {
    this.posx = 0;
    this.posy = 0;
    this.theta = 0;
    this.length = length;
    this.theta0 = theta0;
  }

  /**
   * 現在のフレームカウントに応じて位置を更新する。
   * @param {*} p p5インスタンス
   */
  move(p) {
    this.theta = computePendulumWaveAngle(
      this.theta0,
      this.length,
      state.gravity,
      state.count
    );
    this.posx = p.width / 2 + this.length * p.sin(this.theta);
    this.posy = 100 + this.length * p.cos(this.theta);
  }

  /**
   * 支点からの糸とおもりを描画する。
   * @param {*} p p5インスタンス
   */
  display(p) {
    p.line(p.width / 2, 100, this.posx, this.posy);
    p.image(
      state.weightImage,
      this.posx - state.weightImage.width / 2,
      this.posy - state.weightImage.height / 2
    );
  }
}
