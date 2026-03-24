import { state } from "./state.js";

/**
 * Ballクラス
 * 自由落下運動をする物体を表現
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialHeight 初期高さ (m)
   */
  constructor(initialHeight) {
    this.initialHeight = initialHeight;
    this.initialVelocity = 0;
    this.height = initialHeight;
    this.velocity = 0;
    this.time = 0;
    this.g = 9.8;
    this.radius = 15;
    this.isMoving = false;
    this.graphDataInterval = 0.05; // グラフデータ記録間隔 (秒)
    this.lastGraphUpdate = 0;
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.velocity = this.initialVelocity + this.g * this.time;
    this.height =
      this.initialHeight -
      (this.initialVelocity * this.time + 0.5 * this.g * this.time * this.time);

    if (this.height <= 1) {
      this.height = 1;
      this.isMoving = false;
    }

    // グラフデータ記録
    if (
      this.isMoving &&
      this.time - this.lastGraphUpdate >= this.graphDataInterval
    ) {
      state.vtData.push({
        x: parseFloat(this.time.toFixed(3)),
        y: parseFloat(this.velocity.toFixed(2)),
      });
      state.ytData.push({
        x: parseFloat(this.time.toFixed(3)),
        y: parseFloat((this.initialHeight - this.height).toFixed(2)),
      });
      this.lastGraphUpdate = this.time;
    }
  }

  /**
   * ボールを描画
   * @param {p5} p p5インスタンス
   * @param {number} canvasHeight キャンバスの高さ
   * @param {Object} options 描画オプション
   * @param {p5.Image} [options.ballImage] ボール画像
   * @param {p5.Image} [options.groundImage] 地面画像
   */
  display(p, canvasHeight, options = {}) {
    const { ballImage, groundImage } = options;

    const groundHeight = 50;
    const buildingHeight = 400;
    const scale = buildingHeight / 100;

    const ballX = 500;
    const ballY =
      canvasHeight - groundHeight - this.height * scale - this.radius;
    const initialBallY =
      canvasHeight - groundHeight - this.initialHeight * scale;

    // 目盛り線（初期高さ）
    p.stroke(0, 0, 0);
    p.strokeWeight(2);
    p.drawingContext.setLineDash([10, 6]);
    p.line(100, initialBallY, 900, initialBallY);
    p.drawingContext.setLineDash([]);

    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.text(`${this.initialHeight.toFixed(0)} m`, 910, initialBallY);

    // ボール
    if (ballImage) {
      p.imageMode(p.CENTER);
      p.image(ballImage, ballX, ballY, this.radius * 2, this.radius * 2);
    } else {
      p.fill(255, 100, 100);
      p.noStroke();
      p.circle(ballX, ballY, this.radius * 2);
    }

    // 速度表示
    p.fill(255, 100, 100);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.text(`${this.velocity.toFixed(1)} m/s`, ballX + this.radius + 10, ballY);

    // 地面
    if (groundImage) {
      const groundWidth = 1000;
      p.imageMode(p.CORNER);
      p.image(
        groundImage,
        0,
        canvasHeight - groundHeight - 10,
        groundWidth,
        groundHeight
      );
    } else {
      p.stroke(255);
      p.strokeWeight(2);
      p.line(0, canvasHeight - groundHeight, 1000, canvasHeight - groundHeight);
    }

    // 状態表示
    p.fill(255);
    p.noStroke();
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(18);
    const rightX = canvasHeight * (16 / 9) - 20;
    p.text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    p.text(`高さ: ${this.height.toFixed(2)} m`, rightX, 50);
    p.text(`速度: ${this.velocity.toFixed(2)} m/s`, rightX, 80);
    p.text(`初速: ${this.initialVelocity.toFixed(1)} m/s`, rightX, 110);
  }

  /**
   * リセット
   * @param {number} newHeight 新しい初期高さ
   */
  reset(newHeight) {
    this.initialHeight = newHeight;
    this.height = newHeight;
    this.initialVelocity = 0;
    this.velocity = 0;
    this.time = 0;
    this.isMoving = false;
    state.vtData = [];
    state.ytData = [];
    this.lastGraphUpdate = 0;
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
