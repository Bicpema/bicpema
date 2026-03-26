import { state } from "./state.js";

const SCALE = 5; // ピクセル/メートル（仮想座標系）
const GROUND_HEIGHT_PX = 50; // 地面エリアの高さ（ピクセル）
const CLIFF_WIDTH = 120; // 崖の幅（ピクセル）
const ARROW_SCALE = 4; // 速度矢印のスケール係数

/**
 * Ballクラス
 * 水平投射運動をする物体を表現
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialHeight 初期の高さ (m)
   * @param {number} initialVelocity 初速度 (m/s) - 水平方向
   */
  constructor(initialHeight = 30, initialVelocity = 15) {
    this.initialHeight = initialHeight;
    this.initialVelocity = initialVelocity;
    this.x = 0; // 水平位置 (m)
    this.height = initialHeight; // 鉛直位置 (m)
    this.vx = initialVelocity; // 水平速度 (m/s)
    this.vy = 0; // 鉛直速度 (m/s, 下向きが正)
    this.time = 0;
    this.g = 9.8;
    this.radius = 15;
    this.isMoving = false;
    this.trail = [];
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.x = this.initialVelocity * this.time;
    this.height =
      this.initialHeight - 0.5 * this.g * this.time * this.time;
    this.vx = this.initialVelocity;
    this.vy = this.g * this.time;

    this.trail.push({ x: this.x, y: this.height });

    if (this.height <= 0) {
      this.height = 0;
      this.isMoving = false;
    }
  }

  /**
   * 物体を描画
   * @param {p5} p p5インスタンス
   * @param {number} canvasHeight 仮想キャンバスの高さ
   */
  display(p, canvasHeight) {
    const groundY = canvasHeight - GROUND_HEIGHT_PX;
    const launchX = CLIFF_WIDTH;

    // ピクセル座標変換
    const toPixX = (xm) => launchX + xm * SCALE;
    const toPixY = (ym) => groundY - ym * SCALE;

    const ballPixX = toPixX(this.x);
    const ballPixY = toPixY(this.height);
    const cliffTopY = toPixY(this.initialHeight);

    // 崖/台（茶色）
    p.fill(120, 90, 60);
    p.noStroke();
    p.rect(0, cliffTopY, launchX, groundY - cliffTopY);

    // 崖の高さラベル
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text(`${this.initialHeight}m`, launchX / 2, (cliffTopY + groundY) / 2);

    // 地面
    if (state.groundImage) {
      p.imageMode(p.CORNER);
      p.image(state.groundImage, 0, groundY - 5, 1000, GROUND_HEIGHT_PX);
    } else {
      p.fill(60, 130, 60);
      p.noStroke();
      p.rect(0, groundY, 1000, GROUND_HEIGHT_PX);
    }

    // 軌跡
    if (this.trail.length > 1) {
      p.noFill();
      p.stroke(255, 220, 50, 180);
      p.strokeWeight(2);
      p.beginShape();
      for (const pos of this.trail) {
        p.vertex(toPixX(pos.x), toPixY(pos.y));
      }
      p.endShape();
    }

    // 速度矢印（開始後）
    if (this.time > 0) {
      // 水平速度 vx（青）
      drawArrow(
        p,
        ballPixX,
        ballPixY,
        ballPixX + this.vx * ARROW_SCALE,
        ballPixY,
        p.color(80, 160, 255)
      );
      // 鉛直速度 vy（赤）
      drawArrow(
        p,
        ballPixX,
        ballPixY,
        ballPixX,
        ballPixY + this.vy * ARROW_SCALE,
        p.color(255, 100, 80)
      );
    }

    // ボール
    if (state.ballImage) {
      p.imageMode(p.CENTER);
      p.image(
        state.ballImage,
        ballPixX,
        ballPixY,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      p.fill(255, 180, 60);
      p.noStroke();
      p.circle(ballPixX, ballPixY, this.radius * 2);
    }

    // 速度凡例（左下付近）
    const legendX = launchX + 15;
    const legendY = groundY - 50;
    p.noStroke();
    p.fill(80, 160, 255);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);
    p.text(`→ vx = ${this.vx.toFixed(1)} m/s`, legendX, legendY);
    p.fill(255, 100, 80);
    p.text(`↓ vy = ${this.vy.toFixed(1)} m/s`, legendX, legendY + 22);

    // 情報表示（右上）
    p.fill(255);
    p.noStroke();
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(18);
    const rightX = canvasHeight * (16 / 9) - 20;
    p.text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    p.text(`水平距離: ${this.x.toFixed(2)} m`, rightX, 50);
    p.text(`高さ: ${this.height.toFixed(2)} m`, rightX, 80);
    p.text(`初速: ${this.initialVelocity.toFixed(1)} m/s`, rightX, 110);
    p.text(`初高さ: ${this.initialHeight.toFixed(0)} m`, rightX, 140);
  }

  /**
   * リセット
   * @param {number} newHeight 新しい初期高さ
   * @param {number} newVelocity 新しい初速度
   */
  reset(newHeight, newVelocity) {
    this.initialHeight = newHeight;
    this.initialVelocity = newVelocity;
    this.x = 0;
    this.height = newHeight;
    this.vx = newVelocity;
    this.vy = 0;
    this.time = 0;
    this.isMoving = false;
    this.trail = [];
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
 * 矢印を描画するヘルパー関数
 * @param {p5} p p5インスタンス
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {p5.Color} color 色
 */
function drawArrow(p, x1, y1, x2, y2, color) {
  const arrowHeadSize = 10;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  p.stroke(color);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);

  p.push();
  p.translate(x2, y2);
  p.rotate(Math.atan2(dy, dx));
  p.fill(color);
  p.noStroke();
  p.triangle(0, 0, -arrowHeadSize, arrowHeadSize / 2, -arrowHeadSize, -arrowHeadSize / 2);
  p.pop();
}
