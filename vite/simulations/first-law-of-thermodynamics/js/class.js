// class.js は分子クラスを定義するファイルです。

import { state } from "./state.js";

const DT_UNIT = 0.3;
const X_MIN = 201;
const Y_MIN = 146;
const Y_MAX = 341;

export class Molecule {
  /**
   * @param {object} p - p5 インスタンス
   * @param {number} x - 初期X座標
   * @param {number} y - 初期Y座標
   * @param {number} vx - X方向速度
   * @param {number} vy - Y方向速度
   */
  constructor(p, x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.z = p.random();
    this.vx = vx;
    this.vy = vy;
  }

  move() {
    const T = state.T;
    const speed = Math.sqrt(T * T * T) * (0.6 + this.z);
    this.x += this.vx * speed;
    this.y += this.vy * speed;

    if (this.x < X_MIN) {
      this.x = X_MIN;
      this.vx *= -1;
    }
    if (this.x > state.pistonX - 27) {
      this.x = state.pistonX - 27;
      this.vx *= -1;
    }
    if (this.y < Y_MIN || this.y > Y_MAX) this.vy *= -1;
  }

  draw(p) {
    const T = state.T;
    const size = p.lerp(7, 13, this.z);
    const c = p.map(T, state.T0, state.T0 + 5 * DT_UNIT, 120, 255);
    p.fill(c, 100, 255 - c);
    p.noStroke();
    p.ellipse(this.x, this.y, size);
  }
}
