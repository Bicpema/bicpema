/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
class BicpemaCanvasController {
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
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
   */
  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    let canvas, w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    if (this.is3D) {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL);
    } else {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio);
    }
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
   */
  resizeScreen() {
    const NAV_BAR = select("#navBar");
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}

/**
 * Ballクラス
 *
 * 鉛直投げ下ろし運動をするボールを表現する。
 * 物理量はすべてメートル単位で管理し、描画時にピクセルに変換する。
 */
class Ball {
  /**
   * @constructor
   * @param {number} x x座標（ピクセル、固定）
   * @param {number} y y座標（メートル、初期位置 = 0）
   * @param {number} v0 初速度（m/s）
   * @param {number} r ボールの半径（ピクセル）
   */
  constructor(x, y, v0, r) {
    this.x = x;
    this.initialY = y; // メートル単位での初期位置（0）
    this.y = y; // メートル単位での現在位置
    this.v0 = v0; // 初速度（m/s）
    this.velocity = v0; // 現在の速度（m/s）
    this.radius = r;
    this.time = 0;
  }

  /**
   * 物理演算でボールの位置と速度を更新する。
   * 鉛直投げ下ろし運動: y = y0 + v0*t + (1/2)*g*t^2
   * v = v0 + g*t
   * @param {number} dt 時間ステップ（秒）
   * @param {number} g 重力加速度（m/s^2）
   */
  update(dt, g) {
    this.time += dt;
    // 位置の計算（下向きを正とする、メートル単位）
    this.y = this.initialY + this.v0 * this.time + 0.5 * g * this.time * this.time;
    // 速度の計算（m/s）
    this.velocity = this.v0 + g * this.time;
  }

  /**
   * ボールを描画する。
   * @param {number} pixelsPerMeter メートルからピクセルへの変換係数
   * @param {number} topY キャンバス上端からの開始位置（ピクセル）
   */
  draw(pixelsPerMeter, topY) {
    fill(255, 100, 100);
    noStroke();
    const pixelY = topY + this.y * pixelsPerMeter;
    ellipse(this.x, pixelY, this.radius * 2, this.radius * 2);
  }

  /**
   * ボールの状態をリセットする。
   */
  reset() {
    this.y = this.initialY;
    this.velocity = this.v0;
    this.time = 0;
  }

  /**
   * 初速度を設定する。
   * @param {number} v0 新しい初速度（m/s）
   */
  setInitialVelocity(v0) {
    this.v0 = v0;
    this.reset();
  }
}
