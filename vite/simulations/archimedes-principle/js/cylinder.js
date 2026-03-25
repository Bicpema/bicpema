/**
 * Cylinderクラス
 *
 * アルキメデスの原理シミュレーションで使用する円柱を表すクラス。
 */
export class Cylinder {
  /**
   * @constructor
   * @param {number} cx 円柱の中心X座標（キャンバス座標）
   * @param {number} cy 円柱の底面Y座標（キャンバス座標）
   * @param {number} r 円柱の半径（キャンバス単位）
   * @param {number} h 円柱の高さ（キャンバス単位）
   * @param {number} density 円柱の密度（g/cm³）
   */
  constructor(cx, cy, r, h, density) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.h = h;
    this.density = density;

    this.vy = 0;
    this.ay = 0;
    this.dragging = false;
    this.dragOffsetY = 0;
  }

  /**
   * アルキメデスの原理に基づいて円柱の位置を更新する。
   * @param {number} waterSurfaceY 水面のY座標（キャンバス座標）
   * @param {number} tankBottomY 水槽底面のY座標（キャンバス座標）
   */
  update(waterSurfaceY, tankBottomY) {
    if (this.dragging) return;

    const WATER_DENSITY = 1.0;
    const G = 0.5;
    const DAMPING = 0.92;

    const topY = this.cy - this.h;
    const bottomY = this.cy;

    let submergedFraction = 0;
    if (bottomY <= waterSurfaceY) {
      submergedFraction = 0;
    } else if (topY >= waterSurfaceY) {
      submergedFraction = 1;
    } else {
      submergedFraction = (bottomY - waterSurfaceY) / this.h;
    }

    const gravity = G * this.density;
    const buoyancy = G * WATER_DENSITY * submergedFraction;
    this.ay = gravity - buoyancy;
    this.vy += this.ay;
    this.vy *= DAMPING;
    this.cy += this.vy;

    if (this.cy > tankBottomY) {
      this.cy = tankBottomY;
      this.vy = -this.vy * 0.3;
    }

    if (this.cy - this.h < waterSurfaceY - this.h * 2) {
      this.cy = waterSurfaceY - this.h * 2 + this.h;
      this.vy = -this.vy * 0.3;
    }
  }

  /**
   * 円柱の水中体積比を返す。
   * @param {number} waterSurfaceY 水面のY座標
   * @returns {number} 水中体積比（0〜1）
   */
  getSubmergedFraction(waterSurfaceY) {
    const topY = this.cy - this.h;
    const bottomY = this.cy;
    if (bottomY <= waterSurfaceY) return 0;
    if (topY >= waterSurfaceY) return 1;
    return (bottomY - waterSurfaceY) / this.h;
  }

  /**
   * ドラッグ判定（マウス座標が円柱上にあるか）。
   * @param {number} mx マウスX座標
   * @param {number} my マウスY座標
   * @returns {boolean}
   */
  isOver(mx, my) {
    return (
      mx >= this.cx - this.r &&
      mx <= this.cx + this.r &&
      my >= this.cy - this.h &&
      my <= this.cy
    );
  }
}
