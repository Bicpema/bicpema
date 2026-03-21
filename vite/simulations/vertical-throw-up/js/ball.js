import { state } from "./state.js";

/**
 * Ballクラス
 * 鉛直投げ上げ運動をする物体を表現
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialVelocity 初速度 (m/s) - 上向きを正とする
   */
  constructor(initialVelocity = 30) {
    this.initialVelocity = initialVelocity;
    this.height = 0;
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = 9.8;
    this.radius = 15;
    this.isMoving = false;
    this.maxHeight = (initialVelocity * initialVelocity) / (2 * this.g);
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.velocity = this.initialVelocity - this.g * this.time;
    this.height =
      this.initialVelocity * this.time - 0.5 * this.g * this.time * this.time;

    if (this.height <= 0) {
      this.height = 0;
      this.velocity = 0;
      this.isMoving = false;
    }
  }

  /**
   * ボールを描画
   * @param {p5} p p5インスタンス
   * @param {number} canvasHeight キャンバスの高さ
   */
  display(p, canvasHeight) {
    const groundHeight = 50;
    const scale = 8;

    const ballX = 400;
    const ballY =
      canvasHeight - groundHeight - this.height * scale - this.radius;

    // 最高到達点の点線を描画
    const maxHeightY = canvasHeight - groundHeight - this.maxHeight * scale;
    p.stroke(0);
    p.strokeWeight(2);
    p.drawingContext.setLineDash([10, 10]);
    p.line(ballX + 50, maxHeightY, ballX + 250, maxHeightY);
    p.drawingContext.setLineDash([]);

    // 点線の右側に最高到達点の高さを描画
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    p.text(`最高到達点: ${this.maxHeight.toFixed(1)} m`, ballX + 260, maxHeightY);

    // ボール
    if (state.ballImage) {
      p.imageMode(p.CENTER);
      p.image(state.ballImage, ballX, ballY, this.radius * 2, this.radius * 2);
    } else {
      p.fill(255, 100, 100);
      p.noStroke();
      p.circle(ballX, ballY, this.radius * 2);
    }

    // ボールの右側に速度を描画
    p.fill(255, 100, 100);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(16);
    const velocityText =
      this.velocity >= 0
        ? `↑ ${this.velocity.toFixed(1)} m/s`
        : `↓ ${Math.abs(this.velocity).toFixed(1)} m/s`;
    p.text(velocityText, ballX + this.radius + 10, ballY);

    // 地面
    if (state.groundImage) {
      const groundWidth = 1000;
      p.imageMode(p.CORNER);
      p.image(
        state.groundImage,
        0,
        canvasHeight - groundHeight - 5,
        groundWidth,
        groundHeight
      );
    } else {
      p.stroke(255);
      p.strokeWeight(2);
      p.line(0, canvasHeight - groundHeight, 1000, canvasHeight - groundHeight);
    }

    // 情報表示（右上）
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
