import { state } from "./state.js";

/** 水の密度 (g/cm³) */
const WATER_DENSITY = 1.0;
/** シミュレーション用の重力加速度スケール */
const G = 0.5;
/** 速度の減衰係数（1フレームごとに掛け合わせる） */
const DAMPING = 0.92;
/** 速度の上限（座標飛び防止） */
const MAX_VY = 8;
/** 水槽底面・水面での跳ね返り時の反発係数 */
const RESTITUTION = 0.3;

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
    if (this.dragging) {
      return;
    }

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

    // 速度制限で座標飛びを防ぐ
    this.vy = Math.max(Math.min(this.vy, MAX_VY), -MAX_VY);

    this.vy *= DAMPING;

    // 更新前（本フレーム移動前）に完全水没していたかどうか
    const wasFullySubmerged = topY >= waterSurfaceY;

    this.cy += this.vy;

    // 密度が水と等しい（中性浮力）場合、水面と物体の上面が一致する位置で
    // 慣性を打ち消して静止させる。完全水没した状態ではどの深さでも力が
    // 釣り合ってしまい、慣性のみで沈み込む深さが毎回ばらついてしまうため、
    // 水面をちょうど通過した瞬間に位置と速度を固定して再現性を持たせる。
    if (this.density === WATER_DENSITY && !wasFullySubmerged) {
      const flushBottomY = waterSurfaceY + this.h;
      if (this.cy >= flushBottomY) {
        this.cy = flushBottomY;
        this.vy = 0;
      }
    }

    if (this.cy > tankBottomY) {
      this.cy = tankBottomY;
      this.vy = -this.vy * RESTITUTION;
    }

    const topLimitY = waterSurfaceY - this.h;
    if (this.cy - this.h < topLimitY) {
      this.cy = topLimitY + this.h;
      this.vy = -this.vy * RESTITUTION;
    }
  }

  /**
   * 円柱を描画する。
   * @param {*} p p5インスタンス
   */
  draw(p) {
    const r = this.r;
    const h = this.h;
    const cylCx = this.cx;
    const cylBottomY = this.cy;
    const cylTopY = cylBottomY - h;
    const ew = r * 2;

    p.push();
    p.imageMode(p.CORNER);
    p.image(state.cylinderImage, cylCx - r, cylTopY, ew, h);
    p.pop();
  }

  /**
   * 円柱の水中体積比を返す。
   * @param {number} waterSurfaceY 水面のY座標
   * @returns {number} 水中体積比（0〜1）
   */
  getSubmergedFraction(waterSurfaceY) {
    const topY = this.cy - this.h;
    const bottomY = this.cy;
    if (bottomY <= waterSurfaceY) {
      return 0;
    }
    if (topY >= waterSurfaceY) {
      return 1;
    }
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
