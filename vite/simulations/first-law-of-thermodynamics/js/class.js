// class.js は分子クラスを定義するファイルです。

import { state } from "./state.js";
import { computeMoleculeSpeed } from "./physics.js";
import {
  DT_UNIT,
  MOLECULE_MARGIN,
  MOLECULE_X_MIN as X_MIN,
  MOLECULE_Y_MIN as Y_MIN,
  MOLECULE_Y_MAX as Y_MAX
} from "./constants.js";

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
    const speed = computeMoleculeSpeed(T, this.z);
    this.x += this.vx * speed;
    this.y += this.vy * speed;

    if (this.x < X_MIN) {
      this.x = X_MIN;
      this.vx *= -1;
    }
    if (this.x > state.pistonX - MOLECULE_MARGIN) {
      this.x = state.pistonX - MOLECULE_MARGIN;
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
