// class.js は Ball クラス管理専用のファイルです。

import { state } from "./state.js";
import { groundLevel, BALL_START_X, GRAVITY, FPS } from "./init.js";
import { computeDragProjectilePosition } from "./physics.js";

/**
 * 斜方投射されるボールを表すクラス。
 */
export class Ball {
  constructor(x, y, s, t, w, y0, k, n) {
    this.posx = x;
    this.posy = y;
    this.speed = s;
    this.theta = t;
    this.weight = w;
    this.konstant = k;
    this.number = n;
    this.posx0 = BALL_START_X;
    this.posy0 = y0;
    this.gravity = GRAVITY;
    this.fps = FPS;
  }

  /**
   * ボールの位置を更新し描画する。
   * @param {*} p p5インスタンス
   */
  _draw(p) {
    if (state.clickedCount === true) {
      if (
        this.posy >= groundLevel(p) - state.radi &&
        this.posx !== BALL_START_X
      ) {
        this.posy = groundLevel(p) - state.radi;
      } else {
        const { x, y } = computeDragProjectilePosition({
          t: state.count / this.fps,
          speed: this.speed,
          angleDeg: this.theta,
          mass: this.weight,
          k: this.konstant,
          gravity: this.gravity,
          posx0: this.posx0,
          posy0: this.posy0,
        });
        this.posx = x;
        this.posy = y;
      }
    } else if (state.resetCount === true) {
      this.posx = this.posx0;
      this.posy = this.posy0;
    }
    if (this.number === 1) {
      p.fill(255, 0, 0, 100);
    }
    if (this.number === 2) {
      p.fill(0, 0, 255, 100);
    }
    p.strokeWeight(1);
    p.ellipse(this.posx, this.posy, state.radi * 2, state.radi * 2);
    if (state.clickedCount === false) {
      p.strokeWeight(3);
      p.line(
        this.posx,
        this.posy,
        this.posx + 100 * p.cos(p.radians(-this.theta)),
        this.posy + 100 * p.sin(p.radians(-this.theta))
      );
    }
  }
}
