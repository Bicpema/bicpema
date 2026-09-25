// class.js は Ball クラス管理専用のファイルです。

import type p5 from "p5";
import { state } from "./state.js";
import { groundLevel, BALL_START_X, GRAVITY, FPS } from "./init.js";
import { computeDragProjectilePosition } from "./physics.js";

/**
 * 斜方投射されるボールを表すクラス。
 */
export class Ball {
  posx: number;
  posy: number;
  speed: number;
  theta: number;
  weight: number;
  konstant: number;
  number: 1 | 2;
  posx0: number;
  posy0: number;
  gravity: number;
  fps: number;

  constructor(
    x: number,
    y: number,
    s: number,
    t: number,
    w: number,
    y0: number,
    k: number,
    n: 1 | 2
  ) {
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
  _draw(p: p5) {
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
          posy0: this.posy0
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
