import { RIVER_BOTTOM, BOAT_Y, V_W } from "./constants.js";
import { drawArrowWithLabel } from "./logic.js";

/**
 * 川の流れを視覚的に表現する水の粒子。
 * 川は左向きに流れる（イメージの矢印 ← に対応）。
 */
export class WaterParticle {
  /**
   * @param {p5} p p5インスタンス
   * @param {number} x 初期X座標
   * @param {number} y 初期Y座標
   */
  constructor(p, x, y) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.waveWidth = p.random(14, 34);
    this.alpha = p.random(70, 155);
    this.speed = p.random(48, 90);
  }

  /**
   * 座標を更新する（左方向へ移動）。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    this.x -= this.speed * dt;
    if (this.x < -60) {
      this.x = 1060;
      this.y = this.p.random(20, RIVER_BOTTOM - 20);
    }
  }

  /**
   * 水の波紋を描画する。
   * @param {p5} p p5インスタンス
   */
  draw(p) {
    p.noFill();
    p.stroke(150, 210, 255, this.alpha);
    p.strokeWeight(1.8);
    p.arc(this.x, this.y, this.waveWidth, 9, 0, p.PI);
  }
}

/**
 * 川を進む船を表現する。
 *
 * 速度の定義（左向き正）:
 *   v_川: 川の流速（常に左向き、≥0）
 *   v_船: 船の速度（水に対して。+＝下流左向き、−＝上流右向き）
 *   v_合: 岸から見た合成速度 ＝ v_川 ＋ v_船
 */
export class Boat {
  /**
   * @param {number} boatSpeed 船の速度（水に対して、左向き正）
   * @param {number} riverSpeed 川の速度（左向き、≥0）
   */
  constructor(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W * 0.55;
    this.isMoving = false;
  }

  /** 岸から観測した合成速度（左向き正）を返す。 */
  get compositeSpeed() {
    return this.riverSpeed + this.boatSpeed;
  }

  /**
   * 座標を更新する。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    if (!this.isMoving) return;
    const PX_PER_MPS = 20;
    this.x -= this.compositeSpeed * PX_PER_MPS * dt;
    if (this.x > 1100) this.x = -100;
    if (this.x < -100) this.x = 1100;
  }

  /**
   * 船と速度ベクトルを描画する。
   * @param {p5} p p5インスタンス
   */
  draw(p) {
    p.push();
    p.translate(this.x, BOAT_Y);
    this._drawBody(p);
    this._drawArrows(p);
    p.pop();
  }

  /**
   * 船体を描画する。
   * @param {p5} p p5インスタンス
   */
  _drawBody(p) {
    p.fill(139, 90, 43);
    p.stroke(100, 60, 20);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(-52, -10);
    p.vertex(52, -10);
    p.vertex(36, 16);
    p.vertex(-36, 16);
    p.endShape(p.CLOSE);

    p.fill(225, 225, 235);
    p.stroke(170, 170, 180);
    p.strokeWeight(1);
    p.rect(-21, -30, 42, 22, 3);

    p.stroke(80, 80, 80);
    p.strokeWeight(2);
    p.line(6, -30, 6, -58);

    p.fill(200, 50, 50);
    p.noStroke();
    p.triangle(6, -58, 6, -44, 28, -51);
  }

  /**
   * 3本の速度矢印を描画する。
   * dx < 0 = 左方向、dx > 0 = 右方向（スクリーン座標）
   * @param {p5} p p5インスタンス
   */
  _drawArrows(p) {
    const S = 10;
    const y1 = -78;
    const y2 = -106;
    const y3 = -134;

    const rdx = -(this.riverSpeed * S);
    drawArrowWithLabel(
      p,
      0,
      y1,
      rdx,
      y1,
      p.color(230, 60, 60),
      `v川 ${this.riverSpeed.toFixed(1)} m/s`
    );

    const bdx = -(this.boatSpeed * S);
    const boatLabel =
      Math.abs(this.boatSpeed) < 0.05
        ? "v船 0 m/s"
        : `v船 ${Math.abs(this.boatSpeed).toFixed(1)} m/s`;
    drawArrowWithLabel(p, 0, y2, bdx, y2, p.color(30, 210, 60), boatLabel);

    const cs = this.compositeSpeed;
    const cdx = -(cs * S);
    const compLabel =
      Math.abs(cs) < 0.05
        ? "v合 0 m/s（静止）"
        : `v合 ${Math.abs(cs).toFixed(1)} m/s`;
    drawArrowWithLabel(p, 0, y3, cdx, y3, p.color(60, 130, 255), compLabel);
  }

  /**
   * 船をリセットする。
   * @param {number} boatSpeed 新しい船の速度
   * @param {number} riverSpeed 新しい川の速度
   */
  reset(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W * 0.55;
    this.isMoving = false;
  }
}

/**
 * 河岸に立って船を観察する人を表現する。
 */
export class Person {
  /**
   * @param {number} x X座標
   * @param {number} y Y座標（足元）
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 人（スティックフィギュア）を描画する。
   * @param {p5} p p5インスタンス
   */
  draw(p) {
    p.push();
    p.translate(this.x, this.y);

    p.fill(255, 220, 180);
    p.stroke(80, 50, 30);
    p.strokeWeight(2);
    p.circle(0, -42, 28);

    p.stroke(50, 80, 190);
    p.strokeWeight(3);
    p.line(0, -28, 0, 5);

    p.stroke(50, 80, 190);
    p.strokeWeight(2.5);
    p.line(0, -20, -22, -8);
    p.line(0, -20, 16, -32);

    p.stroke(30, 30, 70);
    p.strokeWeight(2.5);
    p.line(0, 5, -12, 28);
    p.line(0, 5, 12, 28);

    p.noStroke();
    p.fill(255, 255, 200);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("観測者", 0, 44);

    p.pop();
  }
}
