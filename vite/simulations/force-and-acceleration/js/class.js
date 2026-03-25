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

    this.WHEEL_R = 28;
    this.BODY_W = 160;
    this.BODY_H = 55;
    this.BOX_W = 90;
    this.BOX_H = 70;
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
    const imgY = groundY - imgH;
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
