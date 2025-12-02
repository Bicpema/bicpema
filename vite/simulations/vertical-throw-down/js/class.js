// class.jsはクラス管理専用のファイルです。

// クラスの定義方法の例
// class ExampleClass{
//     constructor(p1,p2){
//         this.property1 =p1;
//         this.property2 =p2;
//     }
//     exampleMethod(){
//         this.property1 += this.property2
//     }
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下にクラスを定義してください。

/**
 * Ballクラス
 * 鉛直投げ下ろし運動をする物体を表現
 */
class Ball {
  /**
   * @constructor
   * @param {number} initialHeight 初期高さ (m)
   * @param {number} initialVelocity 初速度 (m/s) - 下向きを正とする
   */
  constructor(initialHeight, initialVelocity = 0) {
    this.initialHeight = initialHeight;
    this.initialVelocity = initialVelocity;
    this.height = initialHeight;
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = 9.8; // 重力加速度 (m/s^2)
    this.radius = 15; // ボールの半径 (ピクセル)
    this.isMoving = false;
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    // v = v0 + gt
    this.velocity = this.initialVelocity + this.g * this.time;
    // h = h0 - (v0*t + 1/2*g*t^2)
    this.height =
      this.initialHeight -
      (this.initialVelocity * this.time + 0.5 * this.g * this.time * this.time);

    // 地面に到達したら停止
    if (this.height <= 0) {
      this.height = 0;
      this.isMoving = false;
    }
  }

  /**
   * ボールを描画
   * @param {number} canvasHeight キャンバスの高さ
   */
  display(canvasHeight) {
    // 座標系の変換 (物理座標からキャンバス座標へ)
    const maxHeight = this.initialHeight + 10;
    const scale = (canvasHeight - 100) / maxHeight;
    const y = canvasHeight - 50 - this.height * scale;
    const x = 500; // 中央に配置

    // 背景にビルの画像を描画
    if (typeof tallBuildingImage !== "undefined") {
      const buildingHeight = this.initialHeight * scale;
      const buildingWidth =
        buildingHeight * (tallBuildingImage.width / tallBuildingImage.height);
      const buildingX = x - buildingWidth / 2;
      const buildingY = canvasHeight - 50 - buildingHeight;

      imageMode(CORNER);
      image(
        tallBuildingImage,
        buildingX,
        buildingY,
        buildingWidth,
        buildingHeight
      );
    }

    // ボール
    fill(255, 100, 100);
    noStroke();
    circle(x, y, this.radius * 2);

    // 地面
    stroke(255);
    strokeWeight(2);
    line(0, canvasHeight - 50, 1000, canvasHeight - 50);

    // 高さのライン
    stroke(100, 100, 255);
    strokeWeight(1);
    line(x, y, x, canvasHeight - 50);

    // 情報表示
    fill(255);
    noStroke();
    textAlign(LEFT, TOP);
    text(`時間: ${this.time.toFixed(2)} s`, 20, 20);
    text(`高さ: ${this.height.toFixed(2)} m`, 20, 45);
    text(`速度: ${this.velocity.toFixed(2)} m/s`, 20, 70);
  }

  /**
   * リセット
   * @param {number} newHeight 新しい初期高さ
   */
  reset(newHeight) {
    this.initialHeight = newHeight;
    this.height = newHeight;
    this.velocity = this.initialVelocity;
    this.time = 0;
    this.isMoving = false;
  }

  /**
   * 運動を開始
   */
  start() {
    this.isMoving = true;
  }

  /**
   * 運動を停止
   */
  stop() {
    this.isMoving = false;
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
