import { state } from "./state.js";
import {
  GRAVITY,
  BALL_RADIUS,
  DEFAULT_INITIAL_VELOCITY,
  GRAPH_DATA_INTERVAL,
  GROUND_LEVEL_HEIGHT,
  CANVAS_VIRTUAL_WIDTH,
  GROUND_HEIGHT,
  BUILDING_HEIGHT,
  BUILDING_CENTER_X,
  HEIGHT_SCALE,
  LABEL_TEXT_SIZE,
  STATUS_TEXT_SIZE,
  SCALE_LINE_DASH,
  LINE_STROKE_WEIGHT,
  ARROW_LENGTH_VELOCITY_SCALE,
  ARROW_MAX_LENGTH,
} from "./constants.js";

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
  constructor(initialHeight, initialVelocity = DEFAULT_INITIAL_VELOCITY) {
    this.initialHeight = initialHeight;
    this.initialVelocity = initialVelocity;
    this.height = initialHeight;
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = GRAVITY;
    this.radius = BALL_RADIUS;
    this.isMoving = false;
    this.graphDataInterval = GRAPH_DATA_INTERVAL;
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

    if (this.height <= GROUND_LEVEL_HEIGHT) {
      this.height = GROUND_LEVEL_HEIGHT;
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
    const ballY =
      canvasHeight - GROUND_HEIGHT - this.height * HEIGHT_SCALE - this.radius;

    if (state.tallBuildingImage) {
      const buildingWidth =
        BUILDING_HEIGHT *
        (state.tallBuildingImage.width / state.tallBuildingImage.height);
      const buildingX = BUILDING_CENTER_X - buildingWidth / 2;
      const buildingY = canvasHeight - GROUND_HEIGHT - BUILDING_HEIGHT;

      p.imageMode(p.CORNER);
      p.image(
        state.tallBuildingImage,
        buildingX,
        buildingY,
        buildingWidth,
        BUILDING_HEIGHT
      );

      const initialBallY =
        canvasHeight - GROUND_HEIGHT - this.initialHeight * HEIGHT_SCALE;
      p.stroke(0, 0, 0);
      p.strokeWeight(3);
      p.drawingContext.setLineDash(SCALE_LINE_DASH);
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
      p.textSize(LABEL_TEXT_SIZE);
      p.text(
        `${this.initialHeight.toFixed(0)} m`,
        buildingX + 2 * buildingWidth + 10,
        initialBallY
      );

      const ballX = BUILDING_CENTER_X + buildingWidth;

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
      const arrowLen = Math.min(
        this.velocity * ARROW_LENGTH_VELOCITY_SCALE,
        ARROW_MAX_LENGTH
      );
      p.stroke(220, 60, 60);
      p.strokeWeight(LINE_STROKE_WEIGHT);
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
      p.textSize(LABEL_TEXT_SIZE);
      p.text(
        `${this.velocity.toFixed(1)} m/s`,
        ballX + this.radius + 10,
        ballY
      );
    }

    if (state.groundImage) {
      p.imageMode(p.CORNER);
      p.image(
        state.groundImage,
        0,
        canvasHeight - GROUND_HEIGHT - 10,
        CANVAS_VIRTUAL_WIDTH,
        GROUND_HEIGHT
      );
    } else {
      p.stroke(255);
      p.strokeWeight(LINE_STROKE_WEIGHT);
      p.line(
        0,
        canvasHeight - GROUND_HEIGHT,
        CANVAS_VIRTUAL_WIDTH,
        canvasHeight - GROUND_HEIGHT
      );
    }

    p.fill(255);
    p.noStroke();
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(STATUS_TEXT_SIZE);
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
