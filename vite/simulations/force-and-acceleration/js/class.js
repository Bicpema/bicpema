import {
  CART_WHEEL_RADIUS,
  CART_BODY_WIDTH,
  CART_BODY_HEIGHT,
  CART_BOX_WIDTH,
  CART_BOX_HEIGHT,
} from "./constants.js";

/**
 * Cartクラス
 * 力と加速度の関係を示す台車
 */
export class Cart {
  /**
   * @constructor
   * @param {number} x 台車の中心x座標（論理ピクセル）
   * @param {number} mass 質量 (kg)
   */
  constructor(x, mass) {
    this.initialX = x;
    this.x = x;
    this.mass = mass;
    this.velocity = 0;
    this.force = 0;
    this.acceleration = 0;

    // 履歴としての最大値を保持する
    this.maxForce = 0;
    this.maxAcceleration = 0;
    this.massAtMaxForce = mass;
    this.massAtMaxAcceleration = mass;

    this.WHEEL_R = CART_WHEEL_RADIUS;
    this.BODY_W = CART_BODY_WIDTH;
    this.BODY_H = CART_BODY_HEIGHT;
    this.BOX_W = CART_BOX_WIDTH;
    this.BOX_H = CART_BOX_HEIGHT;

    // 見た目の調整: 台車を地面にもう少し近づけるためのオフセット
    this.groundOffset = 6;
  }

  /**
   * 台車の右端x座標を返す
   * @returns {number}
   */
  get rightEdge() {
    return this.x + this.BODY_W / 2;
  }

  /**
   * 台車の表示上の右端x座標を返す（画像描画後に更新される）
   * @returns {number}
   */
  get displayRightEdge() {
    return this.x + (this._displayW || this.BODY_W) / 2;
  }

  /**
   * 台車の左端x座標を返す
   * @returns {number}
   */
  get leftEdge() {
    return this.x - this.BODY_W / 2;
  }

  /**
   * 位置・速度を更新する
   * @param {number} dt 時間ステップ (s)
   * @param {number} pxPerMeter 1メートルあたりのピクセル数
   */
  update(dt, pxPerMeter) {
    this.acceleration = this.force / this.mass;
    this.velocity += this.acceleration * dt;
    if (this.velocity < 0) this.velocity = 0;
    this.x += this.velocity * pxPerMeter * dt;

    // 履歴としての最大値を更新（保持する）
    if (this.force > this.maxForce) {
      this.maxForce = this.force;
      this.massAtMaxForce = this.mass;
    }
    if (this.acceleration > this.maxAcceleration) {
      this.maxAcceleration = this.acceleration;
      this.massAtMaxAcceleration = this.mass;
    }
  }

  /**
   * 台車を描画する
   * @param {*} p p5インスタンス
   * @param {number} groundY 地面のy座標（論理ピクセル）
   * @param {*} cartImg 台車画像
   */
  display(p, groundY, cartImg) {
    const imgH = this.WHEEL_R * 2 + this.BODY_H + this.BOX_H;
    const imgW = imgH * (cartImg.width / cartImg.height);
    this._displayW = imgW;
    const imgX = this.x - imgW / 2;
    // 地面から少し下に描画して "浮いている" 印象を軽減する
    const imgY = groundY - imgH + this.groundOffset;
    p.image(cartImg, imgX, imgY, imgW, imgH);
  }

  /**
   * 台車を初期状態にリセットする
   */
  reset() {
    this.x = this.initialX;
    this.velocity = 0;
    this.force = 0;
    this.acceleration = 0;
  }
}
