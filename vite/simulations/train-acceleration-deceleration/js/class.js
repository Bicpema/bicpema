/**
 * 電車オブジェクト
 */
class Train {
  /**
   * @constructor
   * @param {number} x x方向の座標（ピクセル）
   * @param {number} y y方向の座標（ピクセル）
   * @param {number} acceleration 加速度（m/s²）
   */
  constructor(x, y, acceleration) {
    this.x = x;
    this.y = y;
    this.acceleration = acceleration; // 加速度（m/s²）
    this.velocity = 0; // 速度（m/s）
    this.time = 0; // 経過時間（秒）
    this.velocityData = [{ x: 0, y: 0 }]; // v-tグラフ用のデータ
  }

  /**
   * 状態を更新する
   * @param {number} deltaTime フレーム間の時間（秒）
   */
  update(deltaTime) {
    // 新しい速度を計算
    const newVelocity = this.velocity + this.acceleration * deltaTime;
    
    // 速度が負にならないようにする
    if (newVelocity < 0) {
      this.velocity = 0;
      this.acceleration = 0; // 速度が0になったら加速度も0に
    } else {
      this.velocity = newVelocity;
    }

    // 位置を更新（x = x0 + v*t）
    this.x += this.velocity * deltaTime * 50; // 50はピクセル/メートルの変換係数

    // 時間を更新
    this.time += deltaTime;

    // グラフ用のデータを追加
    this.velocityData.push({ x: this.time, y: this.velocity });
  }

  /**
   * 電車を描画する
   */
  draw() {
    fill(100, 150, 255);
    stroke(255);
    strokeWeight(2);
    rect(this.x - 40, this.y, 80, 30, 5);
    
    // 窓を描画
    fill(200, 220, 255);
    rect(this.x - 30, this.y + 5, 15, 15, 2);
    rect(this.x - 10, this.y + 5, 15, 15, 2);
    rect(this.x + 10, this.y + 5, 15, 15, 2);
    
    // 車輪を描画
    fill(50);
    circle(this.x - 25, this.y + 35, 10);
    circle(this.x + 25, this.y + 35, 10);
  }

  /**
   * 加速度を設定する
   * @param {number} acceleration 新しい加速度（m/s²）
   */
  setAcceleration(acceleration) {
    this.acceleration = acceleration;
  }

  /**
   * リセットする
   */
  reset(acceleration) {
    this.x = 50;
    this.velocity = 0;
    this.time = 0;
    this.acceleration = acceleration;
    this.velocityData = [{ x: 0, y: 0 }];
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
