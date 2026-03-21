// class.js はクラス管理専用のファイルです。

import { TRAIN_HALF_W } from "./function.js";

/**
 * Trainクラス
 * 電車の物理状態（速度・位置）を管理する。
 */
export class Train {
  /**
   * @constructor
   * @param {number} startX 初期表示x座標（仮想ピクセル）
   */
  constructor(startX) {
    this.startX = startX;
    this.x = startX;
    /** 速度 (m/s) — 0以上 */
    this.velocity = 0;
    /** 線路スクロールオフセット（仮想ピクセル） */
    this.trackOffset = 0;
  }

  /**
   * 位置と速度を1ステップ更新する。
   * 速度は 0 以上に制限される（電車は後退しない）。
   * @param {number} dt 時間ステップ (s)
   * @param {number} acceleration 加速度 (m/s²)
   * @param {number} pxPerMeter 仮想ピクセル/メートル
   * @param {number} vw 仮想キャンバス幅（ラップ用）
   */
  update(dt, acceleration, pxPerMeter, vw) {
    this.velocity = Math.max(0, this.velocity + acceleration * dt);
    const dx = this.velocity * pxPerMeter * dt;
    this.x += dx;
    this.trackOffset += dx;
    // 電車が右端を超えたら左端に折り返す
    if (this.x > vw + TRAIN_HALF_W) {
      this.x = -TRAIN_HALF_W;
    }
  }

  /**
   * 電車を初期状態にリセットする。
   */
  reset() {
    this.x = this.startX;
    this.velocity = 0;
    this.trackOffset = 0;
  }
}

