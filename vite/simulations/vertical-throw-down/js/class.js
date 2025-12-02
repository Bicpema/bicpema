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
    if (this.height <= 1) {
      this.height = 1;
      this.isMoving = false;
    }
  }

  /**
   * ボールを描画
   * @param {number} canvasHeight キャンバスの高さ
   */
  display(canvasHeight) {
    // ビルの固定サイズ
    const buildingHeight = 400; // ビルの高さを固定
    const groundHeight = 50;

    // ビルの位置（キャンバスの中央やや左）
    const buildingCenterX = 400;

    // 座標系の変換 (物理座標からキャンバス座標へ)
    // ボールの高さをビルの高さに基づいてスケーリング
    const scale = buildingHeight / 100; // 100mの高さに対してビルの高さを使用
    const ballY =
      canvasHeight - groundHeight - this.height * scale - this.radius;

    // 背景にビルの画像を描画
    if (typeof tallBuildingImage !== "undefined") {
      const buildingWidth =
        buildingHeight * (tallBuildingImage.width / tallBuildingImage.height);
      const buildingX = buildingCenterX - buildingWidth / 2;
      const buildingY = canvasHeight - groundHeight - buildingHeight;

      imageMode(CORNER);
      image(
        tallBuildingImage,
        buildingX,
        buildingY,
        buildingWidth,
        buildingHeight,
      );

      // 初期位置の点線を描画（ビルの横幅と同じ長さ）
      const initialBallY =
        canvasHeight - groundHeight - this.initialHeight * scale;
      stroke(0, 0, 0);
      strokeWeight(3);
      drawingContext.setLineDash([10, 10]);
      line(
        buildingX + buildingWidth,
        initialBallY,
        buildingX + 2 * buildingWidth,
        initialBallY,
      );
      drawingContext.setLineDash([]);

      // 点線の右側に初期高さを描画
      fill(0, 0, 0);
      noStroke();
      textAlign(LEFT, CENTER);
      textSize(16);
      text(
        `${this.initialHeight.toFixed(0)} m`,
        buildingX + 2 * buildingWidth + 10,
        initialBallY,
      );
    }

    // ボールをビルの右側に配置
    const buildingWidth =
      buildingHeight * (tallBuildingImage.width / tallBuildingImage.height);
    const ballX = buildingCenterX + buildingWidth;

    // ボール
    if (typeof ballImage !== "undefined") {
      imageMode(CENTER);
      image(ballImage, ballX, ballY, this.radius * 2, this.radius * 2);
    } else {
      fill(255, 100, 100);
      noStroke();
      circle(ballX, ballY, this.radius * 2);
    }

    // ボールの右側に速度を描画
    fill(255, 100, 100);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(16);
    text(`${this.velocity.toFixed(1)} m/s`, ballX + this.radius + 10, ballY);

    // 地面
    if (typeof groundImage !== "undefined") {
      const groundWidth = 1000;
      imageMode(CORNER);
      image(
        groundImage,
        0,
        canvasHeight - groundHeight - 10, // 微調整
        groundWidth,
        groundHeight,
      );
    } else {
      stroke(255);
      strokeWeight(2);
      line(0, canvasHeight - groundHeight, 1000, canvasHeight - groundHeight);
    }

    // 情報表示（右上）
    fill(255);
    noStroke();
    textAlign(RIGHT, TOP);
    textSize(18);
    const rightX = canvasHeight * (16 / 9) - 20; // キャンバスの右端
    text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    text(`高さ: ${this.height.toFixed(2)} m`, rightX, 50);
    text(`速度: ${this.velocity.toFixed(2)} m/s`, rightX, 80);
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
