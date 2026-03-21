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
   */
  display(p, groundY) {
    const wY = groundY - this.WHEEL_R;
    const bodyBottom = groundY - this.WHEEL_R * 2;
    const bodyTop = bodyBottom - this.BODY_H;
    const boxBottom = bodyTop;
    const boxTop = boxBottom - this.BOX_H;

    // 車軸
    p.stroke(60);
    p.strokeWeight(4);
    p.line(
      this.x - this.BODY_W / 2 + 30,
      wY,
      this.x + this.BODY_W / 2 - 30,
      wY
    );

    // 車体（シャーシ）
    p.fill(230);
    p.stroke(30);
    p.strokeWeight(3);
    p.rect(this.x - this.BODY_W / 2, bodyTop, this.BODY_W, this.BODY_H);

    // 荷台（上部ボックス）
    p.fill(250);
    p.stroke(30);
    p.strokeWeight(3);
    p.rect(this.x - this.BOX_W / 2, boxTop, this.BOX_W, this.BOX_H);

    // 車輪（左）
    p.fill(240);
    p.stroke(30);
    p.strokeWeight(3);
    p.circle(this.x - this.BODY_W / 2 + 30, wY, this.WHEEL_R * 2);
    // ハブ（左）
    p.fill(180);
    p.noStroke();
    p.circle(this.x - this.BODY_W / 2 + 30, wY, this.WHEEL_R * 0.4 * 2);

    // 車輪（右）
    p.fill(240);
    p.stroke(30);
    p.strokeWeight(3);
    p.circle(this.x + this.BODY_W / 2 - 30, wY, this.WHEEL_R * 2);
    // ハブ（右）
    p.fill(180);
    p.noStroke();
    p.circle(this.x + this.BODY_W / 2 - 30, wY, this.WHEEL_R * 0.4 * 2);
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

