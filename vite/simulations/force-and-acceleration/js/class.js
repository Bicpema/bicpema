/**
 * Cartクラス
 * 力と加速度の関係を示す台車
 */
class Cart {
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
   * @param {number} groundY 地面のy座標（論理ピクセル）
   */
  display(groundY) {
    const wY = groundY - this.WHEEL_R;
    const bodyBottom = groundY - this.WHEEL_R * 2;
    const bodyTop = bodyBottom - this.BODY_H;
    const boxBottom = bodyTop;
    const boxTop = boxBottom - this.BOX_H;

    // 車軸
    stroke(60);
    strokeWeight(4);
    line(
      this.x - this.BODY_W / 2 + 30,
      wY,
      this.x + this.BODY_W / 2 - 30,
      wY
    );

    // 車体（シャーシ）
    fill(230);
    stroke(30);
    strokeWeight(3);
    rect(this.x - this.BODY_W / 2, bodyTop, this.BODY_W, this.BODY_H);

    // 荷台（上部ボックス）
    fill(250);
    stroke(30);
    strokeWeight(3);
    rect(this.x - this.BOX_W / 2, boxTop, this.BOX_W, this.BOX_H);

    // 車輪（左）
    fill(240);
    stroke(30);
    strokeWeight(3);
    circle(this.x - this.BODY_W / 2 + 30, wY, this.WHEEL_R * 2);
    // ハブ（左）
    fill(180);
    noStroke();
    circle(this.x - this.BODY_W / 2 + 30, wY, this.WHEEL_R * 0.4 * 2);

    // 車輪（右）
    fill(240);
    stroke(30);
    strokeWeight(3);
    circle(this.x + this.BODY_W / 2 - 30, wY, this.WHEEL_R * 2);
    // ハブ（右）
    fill(180);
    noStroke();
    circle(this.x + this.BODY_W / 2 - 30, wY, this.WHEEL_R * 0.4 * 2);
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
