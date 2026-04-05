// Medium.js はクラス管理専用のファイルです。

import { state, MEDIUM_QUANTITY } from "./state.js";

/**
 * Medium クラス
 *
 * 媒質を表すクラス。
 */
export class Medium {
  constructor(p, x, y, n) {
    this.p = p;
    this.posx = x;
    this.posy = y;
    this.number = n;
  }

  /**
   * 媒質の位置を更新する。
   */
  calculate() {
    let sum = 0;
    for (let i = 0; i < state.incidentWaves.length; i++) {
      if (i % MEDIUM_QUANTITY === this.number) {
        sum += state.incidentWaves[i].posy;
      }
    }
    for (let i = 0; i < state.reflectedWaves.length; i++) {
      if (i % MEDIUM_QUANTITY === this.number) {
        sum += state.reflectedWaves[i].posy;
      }
    }
    this.posy = sum;
  }

  /**
   * 媒質を表示する。
   */
  display() {
    const p = this.p;
    p.strokeWeight(5);
    p.stroke(0);
    p.line(
      this.posx + 100,
      this.posy + p.height / 2,
      (this.number * (p.width - 200)) / MEDIUM_QUANTITY + 100,
      p.height / 2
    );
    p.strokeWeight(1);
    p.noStroke();
    p.fill(255, 255, 0);
    p.ellipse(this.posx + 100, this.posy + p.height / 2, 10, 10);
  }
}
