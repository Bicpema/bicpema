// ReflectedWave.ts はクラス管理専用のファイルです。

import {
  state,
  MEDIUM_QUANTITY,
  MAX_THETA,
  WAVE_FREQUENCY_SCALE,
  AMPLITUDE_SCALE_DIVISOR
} from "./state.js";

/**
 * ReflectedWave クラス
 *
 * 反射波を表すクラス。
 */
export class ReflectedWave {
  p: any;
  time: number;
  posx: number;
  posy: number;
  theta: number;
  number: number;
  fixed: boolean;

  constructor(p: any, x: number, y: number, t: number, n: number, f: boolean) {
    this.p = p;
    this.time = 0;
    this.posx = x;
    this.posy = y;
    this.theta = t;
    this.number = n;
    this.fixed = f;
  }

  /**
   * 波の位置を更新する。
   */
  calculate() {
    const p = this.p;
    if (this.number < this.time - MEDIUM_QUANTITY) {
      if (state.fixedIs) {
        if (this.theta < MAX_THETA) {
          this.theta++;
        }
      } else if (this.theta > -MAX_THETA) {
        this.theta--;
      }
    } else {
      this.theta = 0;
    }
    this.time += state.speed;
    this.posy =
      (p.height / AMPLITUDE_SCALE_DIVISOR) *
      p.sin(p.radians(WAVE_FREQUENCY_SCALE * this.theta));
  }
}
