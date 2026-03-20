// class.js はクラス管理専用のファイルです。

/** 電車の半幅（仮想ピクセル） */
export const TRAIN_HALF_W = 100;

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

/**
 * BicpemaCanvasControllerクラス
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
export class BicpemaCanvasController {
  /**
   * @constructor
   * @param {boolean} f 回転時に比率を固定化するか
   * @param {boolean} i 3Dかどうか
   * @param {number} w_r 幅の比率（0.0~1.0）
   * @param {number} h_r 高さの比率（0.0~1.0）
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }

  /**
   * HTML要素で生成している #p5Canvas と #navBar を元に canvas を生成する。
   * 上半分のみ使用するため高さは利用可能領域の半分にする。
   */
  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    const navH = NAV_BAR.height;
    const availH = windowHeight - navH;
    const w = windowWidth;
    const h = availH / 2;
    const canvas = this.is3D
      ? createCanvas(w, h, WEBGL)
      : createCanvas(w, h);
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * キャンバスをリサイズする。
   */
  resizeScreen() {
    const NAV_BAR = select("#navBar");
    const navH = NAV_BAR.height;
    const availH = windowHeight - navH;
    resizeCanvas(windowWidth, availH / 2);
  }
}
