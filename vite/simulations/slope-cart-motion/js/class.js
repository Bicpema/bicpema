// class.js - クラス管理専用のファイルです。

import { PX_PER_M } from "./function.js";

/**
 * 斜面をくだる台車クラス
 */
export class SlopeCart {
  /**
   * @constructor
   * @param {number} angleDeg - 斜面の傾斜角 (度)
   * @param {number} slopeLengthM - 斜面の長さ (m)
   */
  constructor(angleDeg, slopeLengthM) {
    this.angleDeg = angleDeg;
    this.angleRad = (angleDeg * Math.PI) / 180;
    this.slopeLengthM = slopeLengthM;
    this.g = 9.8; // 重力加速度 (m/s²)
    this.accel = this.g * Math.sin(this.angleRad); // 斜面方向の加速度 (m/s²)
    this.time = 0; // 経過時間 (s)
    this.s = 0; // 斜面方向の変位 (m)
    this.v = 0; // 速度 (m/s)
    this.isAtBottom = false; // 台車が斜面の下端に達したか

    // 台車の見た目サイズ (仮想キャンバスピクセル)
    this.CART_W = 90;
    this.CART_H = 38;
    this.WHEEL_R = 11;
  }

  /**
   * 台車の状態を dt 秒進める
   * @param {number} dt - 時間ステップ (s)
   */
  update(dt) {
    if (this.isAtBottom) return;
    this.time += dt;
    this.s = 0.5 * this.accel * this.time * this.time;
    this.v = this.accel * this.time;

    // 斜面の端に到達したら停止
    const maxDisp = this.slopeLengthM - this.CART_W / (2 * PX_PER_M);
    if (this.s >= maxDisp) {
      this.s = maxDisp;
      this.v = Math.sqrt(2 * this.accel * maxDisp);
      this.isAtBottom = true;
    }
  }

  /**
   * 台車を初期状態にリセットする
   */
  reset() {
    this.time = 0;
    this.s = 0;
    this.v = 0;
    this.isAtBottom = false;
  }

  /**
   * 斜面角度と物理量を再初期化する
   * @param {number} angleDeg - 新しい傾斜角 (度)
   */
  setAngle(angleDeg) {
    this.angleDeg = angleDeg;
    this.angleRad = (angleDeg * Math.PI) / 180;
    this.accel = this.g * Math.sin(this.angleRad);
    this.reset();
  }
}
