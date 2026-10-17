import {
  RIVER_BOTTOM,
  BOAT_Y,
  V_W,
  PX_PER_MPS,
  WATER_PARTICLE_MARGIN,
  BOAT_WRAP_MARGIN,
  RIVER_COLOR,
  BOAT_COLOR,
  COMPOSITE_COLOR,
  WATER_LINE_COLOR,
  HULL_COLOR,
  CABIN_COLOR,
  TEXT_MUTED_COLOR
} from "./constants.js";
import { drawVelocityArrow } from "./logic.js";
import { state } from "./state.js";

/**
 * 川の流れを視覚的に表現する水の粒子。
 * 川は左向きに流れる（イメージの矢印 ← に対応）。
 */
export class WaterParticle {
  p: p5;
  x: number;
  y: number;
  waveWidth: number;
  alpha: number;
  speedFactor: number;

  /**
   * @param p - p5インスタンス
   * @param x - 初期X座標
   * @param y - 初期Y座標
   */
  constructor(p: p5, x: number, y: number) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.waveWidth = p.random(14, 34);
    this.alpha = p.random(90, 190);
    this.speedFactor = p.random(0.8, 1.3);
  }

  /**
   * 座標を更新する（左方向へ移動）。
   * 川の速度（state.boat.riverSpeed）に連動してパーティクルの速さが変わる。
   * @param dt - 時間刻み（秒）
   */
  update(dt: number) {
    const riverSpeed = state.boat ? state.boat.riverSpeed : 3;
    const speed = riverSpeed * PX_PER_MPS * this.speedFactor;
    this.x -= speed * dt;
    if (this.x < -WATER_PARTICLE_MARGIN) {
      this.x = V_W + WATER_PARTICLE_MARGIN;
      this.y = this.p.random(20, RIVER_BOTTOM - 20);
    }
  }

  /**
   * 水の波紋を描画する。
   * @param p - p5インスタンス
   */
  draw(p: p5) {
    p.noFill();
    p.stroke(...WATER_LINE_COLOR, this.alpha);
    p.strokeWeight(1.8);
    p.arc(this.x, this.y, this.waveWidth, 9, 0, p.PI);
  }
}

/**
 * 船体を描画する。this（船の状態）に依存しないため、Boatのメソッドではなくモジュール関数として定義する。
 * @param p - p5インスタンス
 */
function drawBoatBody(p: p5) {
  p.noStroke();
  p.fill(...HULL_COLOR);
  p.beginShape();
  p.vertex(-52, -10);
  p.vertex(52, -10);
  p.vertex(36, 16);
  p.vertex(-36, 16);
  p.endShape(p.CLOSE);

  p.fill(...CABIN_COLOR);
  p.stroke(...HULL_COLOR);
  p.strokeWeight(2);
  p.rect(-21, -30, 42, 22, 4);
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
  boatSpeed: number;
  riverSpeed: number;
  x: number;
  isMoving: boolean;

  /**
   * @param boatSpeed - 船の速度（水に対して、左向き正）
   * @param riverSpeed - 川の速度（左向き、≥0）
   */
  constructor(boatSpeed: number, riverSpeed: number) {
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
   * @param dt - 時間刻み（秒）
   */
  update(dt: number) {
    if (!this.isMoving) return;
    this.x -= this.compositeSpeed * PX_PER_MPS * dt;
    if (this.x > V_W + BOAT_WRAP_MARGIN) this.x = -BOAT_WRAP_MARGIN;
    if (this.x < -BOAT_WRAP_MARGIN) this.x = V_W + BOAT_WRAP_MARGIN;
  }

  /**
   * 船と速度ベクトルを描画する。
   * @param p - p5インスタンス
   */
  draw(p: p5) {
    p.push();
    p.translate(this.x, BOAT_Y);
    drawBoatBody(p);
    this._drawArrows(p);
    p.pop();
  }

  /**
   * 3本の速度矢印を描画する。
   * `dx < 0` で左方向、`dx > 0` で右方向（スクリーン座標）
   * @param p - p5インスタンス
   */
  _drawArrows(p: p5) {
    const S = 10;
    const y1 = -78;
    const y2 = -106;
    const y3 = -134;

    const rdx = -(this.riverSpeed * S);
    drawVelocityArrow(
      p,
      0,
      y1,
      rdx,
      y1,
      RIVER_COLOR,
      `v川 ${this.riverSpeed.toFixed(1)} m/s`
    );

    const bdx = -(this.boatSpeed * S);
    const boatLabel =
      Math.abs(this.boatSpeed) < 0.05
        ? "v船 0 m/s"
        : `v船 ${Math.abs(this.boatSpeed).toFixed(1)} m/s`;
    drawVelocityArrow(p, 0, y2, bdx, y2, BOAT_COLOR, boatLabel);

    const cs = this.compositeSpeed;
    const cdx = -(cs * S);
    const compLabel =
      Math.abs(cs) < 0.05
        ? "v合 0 m/s（静止）"
        : `v合 ${Math.abs(cs).toFixed(1)} m/s`;
    drawVelocityArrow(p, 0, y3, cdx, y3, COMPOSITE_COLOR, compLabel);
  }

  /**
   * 船をリセットする。
   * @param boatSpeed - 新しい船の速度
   * @param riverSpeed - 新しい川の速度
   */
  reset(boatSpeed: number, riverSpeed: number) {
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
  x: number;
  y: number;

  /**
   * @param x - X座標
   * @param y - Y座標（足元）
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * 人（スティックフィギュア）を描画する。
   * @param p - p5インスタンス
   */
  draw(p: p5) {
    p.push();
    p.translate(this.x, this.y);

    p.stroke(...HULL_COLOR);
    p.strokeWeight(3);
    p.strokeCap(p.ROUND);
    p.fill(...CABIN_COLOR);
    p.circle(0, -42, 26);
    p.line(0, -29, 0, 5);
    p.line(0, -20, -18, -6);
    p.line(0, -20, 18, -6);
    p.line(0, 5, -11, 28);
    p.line(0, 5, 11, 28);

    p.noStroke();
    p.fill(...TEXT_MUTED_COLOR);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("観測者", 0, 46);

    p.pop();
  }
}
