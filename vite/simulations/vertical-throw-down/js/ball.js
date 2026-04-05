import { state } from "./state.js";

/**
 * Ballクラス
 * 鉛直投げ下ろし運動をする物体を表現
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialHeight 初期高さ (m)
   * @param {number} initialVelocity 初速度 (m/s) - 下向きを正とする
   */
  constructor(initialHeight, initialVelocity = 10) {
    this.initialHeight = initialHeight;
    this.initialVelocity = initialVelocity;
    this.height = initialHeight;
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = 9.8;
    this.radius = 15;
    this.isMoving = false;
    this.graphDataInterval = 0.05;
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
   */
  display(p, canvasHeight) {
    const buildingHeight = 400;
    const groundHeight = 50;
    const buildingCenterX = 400;
    const scale = buildingHeight / 100;
    const ballY =
      canvasHeight - groundHeight - this.height * scale - this.radius;

    if (state.tallBuildingImage) {
      const buildingWidth =
        buildingHeight *
        (state.tallBuildingImage.width / state.tallBuildingImage.height);
      const buildingX = buildingCenterX - buildingWidth / 2;
      const buildingY = canvasHeight - groundHeight - buildingHeight;

      p.imageMode(p.CORNER);
      p.image(
        state.tallBuildingImage,
        buildingX,
        buildingY,
        buildingWidth,
        buildingHeight
      );

      const initialBallY =
        canvasHeight - groundHeight - this.initialHeight * scale;
      p.stroke(0, 0, 0);
      p.strokeWeight(3);
      p.drawingContext.setLineDash([10, 10]);
      p.line(
        buildingX + buildingWidth,
        initialBallY,
        buildingX + 2 * buildingWidth,
        initialBallY
      );
      p.drawingContext.setLineDash([]);

      p.fill(0, 0, 0);
      p.noStroke();
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(16);
      p.text(
        `${this.initialHeight.toFixed(0)} m`,
        buildingX + 2 * buildingWidth + 10,
        initialBallY
      );

      const ballX = buildingCenterX + buildingWidth;

      if (state.ballImage) {
        p.imageMode(p.CENTER);
        p.image(
          state.ballImage,
          ballX,
          ballY,
          this.radius * 2,
          this.radius * 2
        );
      } else {
        p.fill(255, 100, 100);
        p.noStroke();
        p.circle(ballX, ballY, this.radius * 2);
      }

      // 速度ベクトル（下向き矢印）
      const arrowLen = Math.min(this.velocity * 2, 80);
      p.stroke(220, 60, 60);
      p.strokeWeight(2);
      p.line(ballX, ballY + this.radius, ballX, ballY + this.radius + arrowLen);
      p.fill(220, 60, 60);
      p.noStroke();
      p.triangle(
        ballX - 6,
        ballY + this.radius + arrowLen,
        ballX + 6,
        ballY + this.radius + arrowLen,
        ballX,
        ballY + this.radius + arrowLen + 10
      );

      p.fill(255, 100, 100);
      p.noStroke();
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(16);
      p.text(
        `${this.velocity.toFixed(1)} m/s`,
        ballX + this.radius + 10,
        ballY
      );
    }

    if (state.groundImage) {
      const groundWidth = 1000;
      p.imageMode(p.CORNER);
      p.image(
        state.groundImage,
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
   * @param {number} [newInitialVelocity] 新しい初速度
   */
  reset(newHeight, newInitialVelocity = undefined) {
    this.initialHeight = newHeight;
    this.height = newHeight;
    if (newInitialVelocity !== undefined) {
      this.initialVelocity = newInitialVelocity;
    }
    this.velocity = this.initialVelocity;
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
