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
 * 鉛直投げ上げ運動をする物体を表現
 */
class Ball {
  /**
   * @constructor
   * @param {number} initialVelocity 初速度 (m/s) - 上向きを正とする
   */
  constructor(initialVelocity = 30) {
    this.initialVelocity = initialVelocity;
    this.height = 0; // 地面からの高さ
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = 9.8; // 重力加速度 (m/s^2)
    this.radius = 15; // ボールの半径 (ピクセル)
    this.isMoving = false;
    this.maxHeight = (initialVelocity * initialVelocity) / (2 * this.g); // 最高到達点
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    // v = v0 - gt (上向きを正とする)
    this.velocity = this.initialVelocity - this.g * this.time;
    // h = v0*t - 1/2*g*t^2
    this.height =
      this.initialVelocity * this.time - 0.5 * this.g * this.time * this.time;

    // 地面に到達したら停止
    if (this.height <= 0) {
      this.height = 0;
      this.velocity = 0;
      this.isMoving = false;
    }
  }

  /**
   * ボールを描画
   * @param {number} canvasHeight キャンバスの高さ
   */
  display(canvasHeight) {
    const groundHeight = 50;
    const scale = 8; // スケール調整

    // 人物の位置（キャンバスの中央やや左）
    const personCenterX = 400;
    const personHeight = 80; // 人物の高さ

    // 座標系の変換 (物理座標からキャンバス座標へ)
    const ballY =
      canvasHeight - groundHeight - this.height * scale - this.radius;

    // 人物を描画（簡易的な棒人間）
    const personX = personCenterX;
    const personY = canvasHeight - groundHeight - personHeight;

    // 体
    stroke(255);
    strokeWeight(3);
    line(personX, personY + 15, personX, personY + 50);

    // 腕（投げ上げたポーズ）
    if (this.time < 0.1 || !this.isMoving) {
      // 右腕を上に
      line(personX, personY + 20, personX + 20, personY - 5);
    } else {
      // 通常の腕
      line(personX, personY + 20, personX + 20, personY + 30);
    }
    // 左腕
    line(personX, personY + 20, personX - 20, personY + 30);

    // 脚
    line(personX, personY + 50, personX + 15, personY + 80);
    line(personX, personY + 50, personX - 15, personY + 80);

    // 最高到達点の点線を描画
    const maxHeightY = canvasHeight - groundHeight - this.maxHeight * scale;
    stroke(0);
    strokeWeight(2);
    drawingContext.setLineDash([10, 10]);
    line(personX + 50, maxHeightY, personX + 250, maxHeightY);
    drawingContext.setLineDash([]);

    // 点線の右側に最高到達点の高さを描画
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(16);
    text(
      `最高到達点: ${this.maxHeight.toFixed(1)} m`,
      personX + 260,
      maxHeightY
    );

    // ボールを人物の上に配置
    const ballX = personX;

    // ボール
    if (typeof ballImage !== "undefined") {
      imageMode(CENTER);
      image(ballImage, ballX, ballY, this.radius * 2, this.radius * 2);
    } else {
      fill(255, 100, 100);
      noStroke();
      circle(ballX, ballY, this.radius * 2);
    }

    // ボールの右側に速度を描画（上向きを正とする）
    fill(255, 100, 100);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(16);
    const velocityText =
      this.velocity >= 0
        ? `↑ ${this.velocity.toFixed(1)} m/s`
        : `↓ ${Math.abs(this.velocity).toFixed(1)} m/s`;
    text(velocityText, ballX + this.radius + 10, ballY);

    // 地面
    if (typeof groundImage !== "undefined") {
      const groundWidth = 1000;
      imageMode(CORNER);
      image(
        groundImage,
        0,
        canvasHeight - groundHeight - 5, // 微調整
        groundWidth,
        groundHeight
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
    const rightX = canvasHeight * (16 / 9) - 20;
    text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    text(`高さ: ${this.height.toFixed(2)} m`, rightX, 50);
    text(`速度: ${this.velocity.toFixed(2)} m/s`, rightX, 80);
    text(`初速: ${this.initialVelocity.toFixed(1)} m/s`, rightX, 110);
  }

  /**
   * リセット
   * @param {number} newVelocity 新しい初速度
   */
  reset(newVelocity) {
    this.initialVelocity = newVelocity;
    this.height = 0;
    this.velocity = newVelocity;
    this.time = 0;
    this.isMoving = false;
    this.maxHeight = (newVelocity * newVelocity) / (2 * this.g);
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
