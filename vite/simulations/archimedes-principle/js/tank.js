import { state } from "./state.js";

/**
 * Tankクラス
 * 水槽の描画と状態を保持する。
 */
export class Tank {
  /**
   * @param {number} cx 水槽中心X座標
   * @param {number} bottomY 水槽底面Y座標
   * @param {number} w 水槽幅
   * @param {number} h 水槽高さ
   * @param {number} d 水槽奥行き（未使用）
   */
  constructor(cx, bottomY, w, h, d) {
    this.cx = cx;
    this.bottomY = bottomY;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  /**
   * 水槽を描画する。
   * @param {*} p p5インスタンス
   */
  draw(p) {
    const halfW = this.w / 2;
    const imgX = this.cx - halfW;
    const imgY = this.bottomY - this.h;

    p.push();
    p.imageMode(p.CORNER);
    p.image(state.tankImage, imgX, imgY - 50, this.w, this.h + 100);
    p.pop();
  }
}
