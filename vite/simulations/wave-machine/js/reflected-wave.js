// ReflectedWave.js はクラス管理専用のファイルです。

import { state, MEDIUM_QUANTITY } from "./state.js";

/**
 * ReflectedWave クラス
 *
 * 反射波を表すクラス。
 */
export class ReflectedWave {
  constructor(p, x, y, t, n, f) {
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
        if (this.theta < 30) {
          this.theta++;
        }
      } else {
        if (this.theta > -30) {
          this.theta--;
        }
      }
    } else {
      this.theta = 0;
    }
    this.time += state.speed;
    this.posy = (p.height / 100) * p.sin(p.radians(6 * this.theta));
  }
}
